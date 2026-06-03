import { router } from 'expo-router'
import { useEffect } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

export default function SplashScreen() {
  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('/character-select')
    }, 2500)
    return () => clearTimeout(t)
  }, [])

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/karakter-erkek.png')}
        style={styles.img}
        resizeMode="contain"
      />
      <Text style={styles.title}>KoçAI</Text>
      <Text style={styles.sub}>AKILLI SINAV KOÇUN</Text>
      <View style={styles.dots}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
      <Text style={styles.loop}>loop</Text>
      <Text style={styles.studio}>studio</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060b14', alignItems: 'center', justifyContent: 'center' },
  img: { width: 220, height: 320, marginBottom: 16 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#F5C518', fontFamily: 'serif' },
  sub: { fontSize: 11, color: '#2eb8b0', letterSpacing: 3, marginTop: 4 },
  dots: { flexDirection: 'row', gap: 6, marginTop: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#333' },
  dotActive: { backgroundColor: '#F5C518' },
  loop: { fontSize: 13, color: '#555', marginTop: 24, letterSpacing: 2 },
  studio: { fontSize: 20, color: '#444', fontWeight: '600', letterSpacing: 2 },
})