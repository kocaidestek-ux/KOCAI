import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function CharacterSelect() {
  async function select(type: 'erkek' | 'kiz') {
    await AsyncStorage.setItem('karakter', type)
    router.replace('/login')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KoçAI</Text>
      <Text style={styles.sub}>Koçunu seç!</Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.card} onPress={() => select('erkek')}>
          <Image
            source={require('../../assets/images/karakter-erkek.png')}
            style={styles.img}
            resizeMode="contain"
          />
          <Text style={styles.label}>Erkek Koç</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => select('kiz')}>
          <Image
            source={require('../../assets/images/karakter-kiz.png')}
            style={styles.img}
            resizeMode="contain"
          />
          <Text style={styles.label}>Kız Koç</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>İstediğin zaman değiştirebilirsin</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 42, fontWeight: 'bold', color: '#F5C518', marginBottom: 4 },
  sub: { fontSize: 16, color: '#aaa', marginBottom: 40 },