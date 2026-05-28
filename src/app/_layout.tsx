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
        const karakter = Platform.OS === 'web' ? localStorage.getItem('karakter') : null
        if (karakter) router.replace('/login')
        else router.replace('/splash')
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  return <Stack screenOptions={{ headerShown: false }} />
}