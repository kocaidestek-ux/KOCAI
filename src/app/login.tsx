import { useState } from 'react'
import {
  ActivityIndicator,
  ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View
} from 'react-native'
import { supabase } from '../constants/supabase'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '', passwordConfirm: '', general: '' })

  function validate() {
    const e = { email: '', password: '', passwordConfirm: '', general: '' }
    let valid = true
    if (!email) { e.email = 'E-posta adresi gerekli'; valid = false }
    else if (!emailRegex.test(email)) { e.email = 'Geçerli bir e-posta adresi girin'; valid = false }
    if (!password) { e.password = 'Şifre gerekli'; valid = false }
    else if (password.length < 6) { e.password = 'Şifre en az 6 karakter olmalı'; valid = false }
    if (!isLogin) {
      if (!passwordConfirm) { e.passwordConfirm = 'Şifrenizi tekrar girin'; valid = false }
      else if (password !== passwordConfirm) { e.passwordConfirm = 'Şifreler eşleşmiyor'; valid = false }
    }
    setErrors(e)
    return valid
  }

  async function handleAuth() {
    if (!validate() || loading) return
    setLoading(true)
    setSuccessMsg('')
    setErrors(prev => ({ ...prev, general: '' }))

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setErrors(prev => ({ ...prev, general: 'E-posta veya şifre hatalı' }))
        // Başarılıysa _layout.tsx onAuthStateChange ile otomatik yönlendirir
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) {
          if (error.message.includes('already registered')) {
            setErrors(prev => ({ ...prev, general: 'Bu e-posta zaten kayıtlı. Giriş yapın.' }))
          } else {
            setErrors(prev => ({ ...prev, general: 'Kayıt başarısız, tekrar deneyin' }))
          }
        } else {
          // Email onayı kapalıysa otomatik login olur, _layout yönlendirir
          // Kapalı değilse kullanıcıya bilgi ver
          const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
          if (loginError) {
            setSuccessMsg('✅ Kayıt başarılı! E-postanı doğrula, sonra giriş yap.')
            setIsLogin(true)
            setPassword('')
            setPasswordConfirm('')
          }
          // Başarılıysa _layout halleder
        }
      }
    } catch {
      setErrors(prev => ({ ...prev, general: 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.' }))
    } finally {
      setLoading(false)
    }
  }

  function switchMode() {
    setIsLogin(!isLogin)
    setEmail('')
    setPassword('')
    setPasswordConfirm('')
    setSuccessMsg('')
    setErrors({ email: '', password: '', passwordConfirm: '', general: '' })
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.title}>KoçAI</Text>
        <Text style={styles.sub}>Akıllı Sınav Koçun</Text>

        {successMsg ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{successMsg}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>E-posta</Text>
        <TextInput
          style={[styles.input, errors.email ? styles.inputError : null]}
          placeholder="ornek@mail.com"
          placeholderTextColor="#555"
          value={email}
          onChangeText={t => { setEmail(t); setErrors(p => ({ ...p, email: '' })) }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {errors.email ? <Text style={styles.errorText}>⚠ {errors.email}</Text> : null}

        <Text style={styles.label}>Şifre</Text>
        <View style={[styles.passRow, errors.password ? styles.inputError : null]}>
          <TextInput
            style={styles.passInput}
            placeholder="En az 6 karakter"
            placeholderTextColor="#555"
            value={password}
            onChangeText={t => { setPassword(t); setErrors(p => ({ ...p, password: '' })) }}
            secureTextEntry={!showPass}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
            <Text style={styles.eyeText}>{showPass ? '👁️' : '🙈'}</Text>
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.errorText}>⚠ {errors.password}</Text> : null}

        {!isLogin && (
          <>
            <Text style={styles.label}>Şifre Tekrar</Text>
            <TextInput
              style={[styles.input, errors.passwordConfirm ? styles.inputError : null]}
              placeholder="Şifrenizi tekrar girin"
              placeholderTextColor="#555"
              value={passwordConfirm}
              onChangeText={t => { setPasswordConfirm(t); setErrors(p => ({ ...p, passwordConfirm: '' })) }}
              secureTextEntry={!showPass}
            />
            {errors.passwordConfirm ? <Text style={styles.errorText}>⚠ {errors.passwordConfirm}</Text> : null}
          </>
        )}

        {errors.general ? (
          <View style={styles.generalError}>
            <Text style={styles.generalErrorText}>⚠ {errors.general}</Text>
          </View>
        ) : null}

        <TouchableOpacity style={styles.btn} onPress={handleAuth} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#111" />
            : <Text style={styles.btnText}>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={switchMode} style={styles.switchBtn}>
          <Text style={styles.switchText}>
            {isLogin ? 'Hesabın yok mu? ' : 'Zaten hesabın var mı? '}
            <Text style={styles.switchBold}>{isLogin ? 'Kayıt ol' : 'Giriş yap'}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111', padding: 16 },
  card: { width: '100%', maxWidth: 420, backgroundColor: '#1a1a1a', borderRadius: 20, padding: 28 },
  title: { fontSize: 38, fontWeight: 'bold', color: '#F5C518', textAlign: 'center', marginBottom: 4 },
  sub: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 28 },
  label: { color: '#aaa', fontSize: 13, marginBottom: 6, marginTop: 4 },
  input: { backgroundColor: '#2a2a2a', color: '#fff', padding: 14, borderRadius: 10, fontSize: 15, borderWidth: 1, borderColor: '#333', marginBottom: 4 },
  inputError: { borderColor: '#ff4d4d' },
  passRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2a2a2a', borderRadius: 10, borderWidth: 1, borderColor: '#333', marginBottom: 4 },
  passInput: { flex: 1, color: '#fff', padding: 14, fontSize: 15 },
  eyeBtn: { paddingHorizontal: 14 },
  eyeText: { fontSize: 18 },
  errorText: { color: '#ff4d4d', fontSize: 12, marginBottom: 8, marginTop: 2 },
  generalError: { backgroundColor: '#2a0000', borderRadius: 10, padding: 12, marginVertical: 10, borderWidth: 1, borderColor: '#ff4d4d' },
  generalErrorText: { color: '#ff4d4d', fontSize: 13, textAlign: 'center' },
  successBox: { backgroundColor: '#002a00', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#00cc44' },
  successText: { color: '#00cc44', fontSize: 13, textAlign: 'center' },
  btn: { backgroundColor: '#F5C518', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16, minHeight: 52, justifyContent: 'center' },
  btnText: { color: '#111', fontWeight: 'bold', fontSize: 16 },
  switchBtn: { marginTop: 20, alignItems: 'center' },
  switchText: { color: '#888', fontSize: 14 },
  switchBold: { color: '#F5C518', fontWeight: 'bold' },
})