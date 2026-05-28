import AsyncStorage from '@react-native-async-storage/async-storage'
import { router, Stack } from 'expo-router'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import { supabase } from '../constants/supabase'

export default function RootLayout() {
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/home')
      } else {
        if (Platform.OS === 'web') {
          const karakter = localStorage.getItem('karakter')
          if (karakter) router.replace('/login')
          else router.replace('/splash')
        } else {
          AsyncStorage.getItem('karakter').then(karakter => {
            if (karakter) router.replace('/login')
            else router.replace('/splash')
          })
        }
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  return <Stack screenOptions={{ headerShown: false }} />
}