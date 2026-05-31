Set-Content src\app\index.tsx @'
import { Redirect } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, Platform, View } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { supabase } from "../constants/supabase"

export default function Index() {
  const [session, setSession] = useState<any>(undefined)
  const [karakter, setKarakter] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      if (Platform.OS === "web") {
        setKarakter(localStorage.getItem("karakter"))
      } else {
        const k = await AsyncStorage.getItem("karakter")
        setKarakter(k)
      }
      setLoading(false)
    }
    init()
  }, [])

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#111", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#F5C518" size="large" />
      </View>
    )
  }

  if (!karakter) return <Redirect href="/splash" />
  if (session) return <Redirect href="/home" />
  return <Redirect href="/login" />
}
'@