import { router } from 'expo-router'
import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function SplashScreen() {
  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('/character-select')
    }, 2500)
    return () => clearTimeout(t)
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.loop}>loop</Text>
      <Text style={styles.studio}>studio</Text>
      <Text style={styles.presents}>PRESENTS</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#d9d9d9' },
  loop: { fontSize: 18, color: '#333', letterSpacing: 4, fontWeight: '300' },
  studio: { fontSize: 48, color: '#111', fontWeight: '700', letterSpacing: 2, marginTop: -8 },
  presents: { fontSize: 11, color: '#888', letterSpacing: 6, marginTop: 8 },
})