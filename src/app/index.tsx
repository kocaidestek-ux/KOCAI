import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Platform, View } from 'react-native'
import { supabase } from '../constants/supabase'

export default function Index() {
  const [session, setSession] = useState<any>(undefined)
  const karakter = Platform.OS === 'web' ? localStorage.getItem('karakter') : null

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  }, [])

  if (session === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#F5C518" size="large" />
      </View>
    )
  }

  if (!karakter) return <Redirect href="/splash" />
  if (session) return <Redirect href="/home" />
  return <Redirect href="/login" />
}