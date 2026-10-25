import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '../context/AppContext';
import {useAuth} from '../context/AuthContext';
import {useLocalSearchParams} from 'expo-router';
import {palette} from '../components/SportsUI';

export default function LoginScreen() {
  const { updateUserProfile } = useApp();
  const {signIn} = useAuth();
  const {returnTo} = useLocalSearchParams<{returnTo?:string}>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o e-mail e a senha.');
      return;
    }

    signIn();
    // Redireciona para a tela inicial nas abas
    router.replace((returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/(tabs)/tela-inicio') as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIconBox}>
            <Ionicons name="people" size={32} color="#FFF" />
          </View>
          <Text style={styles.appName}>bora</Text>
          <Text style={styles.tagline}>Esportes, tabuleiro e cartas. Jogue junto.</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputBox}>
            <Ionicons name="mail-outline" size={18} color="#888" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              accessibilityLabel="E-mail"
              keyboardType="email-address"
              autoComplete="email"
              placeholder="seu@email.com"
              placeholderTextColor="#A0A0A0"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={18} color="#888" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              accessibilityLabel="Senha"
              autoComplete="password"
              placeholder="Sua senha"
              placeholderTextColor="#A0A0A0"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Entrar no Bora" style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Criar uma conta no Bora"
            style={styles.registerLink}
            onPress={() => router.push({pathname:'/register',params:returnTo?{returnTo}:{}} as any)}
          >
            <Text style={styles.registerLinkText}>
              Ainda não tem conta? <Text style={styles.registerHighlight}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.paper },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 36 },
  logoIconBox: { width: 64, height: 64, borderRadius: 20, backgroundColor: palette.orange, justifyContent: 'center', alignItems: 'center', marginBottom: 12, shadowColor: '#F04E23', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  appName: { fontSize: 32, fontWeight: 'bold', color: palette.ink, letterSpacing: -1 },
  tagline: { fontSize: 16, color: palette.muted, marginTop: 4 },
  formContainer: { width: '100%' },
  label: { fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 6, marginTop: 12 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, paddingHorizontal: 14, minHeight: 52 },
  input: { flex: 1, fontSize: 17, color: palette.ink },
  loginButton: { backgroundColor: palette.orange, minHeight: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 24, shadowColor: '#F04E23', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  loginButtonText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  registerLink: { alignItems: 'center', marginTop: 20 },
  registerLinkText: { fontSize: 16, color: palette.muted },
  registerHighlight: { color: palette.orange, fontWeight: 'bold' },
});