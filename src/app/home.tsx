import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'

export default function HomeScreen() {
  const [injected, setInjected] = useState('')

  useEffect(() => {
    async function loadStorage() {
      const keys = await AsyncStorage.getAllKeys()
      const pairs = await AsyncStorage.multiGet(keys)
      let js = ''
      pairs.forEach(([key, value]) => {
        if (value) {
          js += `localStorage.setItem(${JSON.stringify(key)}, ${JSON.stringify(value)});`
        }
      })
      js += 'true;'
      setInjected(js)
    }
    loadStorage()
  }, [])

  if (!injected) return null

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: 'https://kocai-self.vercel.app' }}
        style={styles.webview}
        injectedJavaScriptBeforeContentLoaded={injected}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  webview: { flex: 1 },
})