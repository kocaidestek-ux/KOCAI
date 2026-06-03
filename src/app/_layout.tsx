import AsyncStorage from '@react-native-async-storage/async-storage'
import { router, Stack } from 'expo-router'
import { useEffect } from 'react'
import { supabase } from '../constants/supabase'

export default function RootLayout() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/home')
      } else {
        AsyncStorage.getItem('karakter').then(karakter => {
          if (karakter) router.replace('/login')
          else router.replace('/splash')
        })
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/home')
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  return <Stack screenOptions={{ headerShown: false }} />
}