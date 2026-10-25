import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  const handleRegister = () => {
    // Após o cadastro, direciona para as abas principais
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Topo: Botão de voltar e Logo */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <View style={styles.logoIconBox}>
              <FontAwesome name="arrow-up" size={14} color="#FFF" style={{ transform: [{ rotate: '45deg' }] }} />
            </View>
            <Text style={styles.logoText}>bora</Text>
          </View>
        </View>

        {/* Badge: "Tem lugar no time pra você" */}
        <View style={styles.badgeContainer}>
          <Ionicons name="people-outline" size={14} color="#F04E23" style={{ marginRight: 6 }} />
          <Text style={styles.badgeText}>Tem lugar no time pra você</Text>
        </View>

        {/* Título Principal */}
        <Text style={styles.mainTitle}>Bora fazer parte?</Text>
        <Text style={styles.mainSubtitle}>
          Crie sua conta e encontre companhia para participar de encontros e partidas perto de você.
        </Text>

        {/* Formulário */}
        <View style={styles.formContainer}>
          
          {/* Nome completo */}
          <Text style={styles.inputLabel}>Nome completo</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.inputField}
              placeholder="Como você se chama?"
              placeholderTextColor="#A0A0A0"
              value={fullName}
              onChangeText={setFullName}
            />
            <Ionicons name="person-outline" size={18} color="#888" />
          </View>

          {/* Data de nascimento */}
          <Text style={styles.inputLabel}>Data de nascimento</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.inputField}
              placeholder="DD / MM / AAAA"
              placeholderTextColor="#A0A0A0"
              value={birthDate}
              onChangeText={setBirthDate}
            />
            <Ionicons name="calendar-outline" size={18} color="#888" />
          </View>

          {/* E-mail */}
          <Text style={styles.inputLabel}>E-mail</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.inputField}
              placeholder="voce@exemplo.com"
              placeholderTextColor="#A0A0A0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Ionicons name="mail-outline" size={18} color="#888" />
          </View>

          {/* Senha */}
          <Text style={styles.inputLabel}>Senha</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.inputField}
              placeholder="Crie uma senha"
              placeholderTextColor="#A0A0A0"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={18} color="#888" />
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>Use ao menos 8 caracteres, letras e números.</Text>

          {/* Confirmar senha */}
          <Text style={[styles.inputLabel, { marginTop: 6 }]}>Confirmar senha</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.inputField}
              placeholder="Digite sua senha novamente"
              placeholderTextColor="#A0A0A0"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={18} color="#888" />
            </TouchableOpacity>
          </View>

        </View>

        {/* Termos de Uso e Política de Privacidade */}
        <View style={styles.termsRow}>
          <TouchableOpacity 
            style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]} 
            onPress={() => setAcceptedTerms(!acceptedTerms)}
          >
            {acceptedTerms && <FontAwesome name="check" size={10} color="#FFF" />}
          </TouchableOpacity>
          <Text style={styles.termsText}>
            Li e aceito os <Text style={styles.termsLink}>Termos de Uso</Text> e a <Text style={styles.termsLink}>Política de Privacidade</Text> do Bora.
          </Text>
        </View>

        {/* Botão Criar Minha Conta */}
        <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
          <Text style={styles.submitButtonText}>Criar minha conta</Text>
          <FontAwesome name="arrow-right" size={14} color="#FFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        {/* Rodapé: Já está no time? Entrar */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Já está no time? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.footerLink}>Entrar</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoIconBox: { width: 24, height: 24, borderRadius: 6, backgroundColor: '#F04E23', justifyContent: 'center', alignItems: 'center', marginRight: 6 },
  logoText: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', letterSpacing: -0.5 },
  badgeContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0ED', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, marginBottom: 12 },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#F04E23' },
  mainTitle: { fontSize: 26, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 6 },
  mainSubtitle: { fontSize: 13, color: '#666', lineHeight: 18, marginBottom: 20 },
  formContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#374151', marginBottom: 4 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 14, height: 48, marginBottom: 12 },
  inputField: { flex: 1, fontSize: 13, color: '#1A1A1A' },
  helperText: { fontSize: 10, color: '#888', marginTop: -8, marginBottom: 6, marginLeft: 2 },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24, paddingRight: 10 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center', marginRight: 10, marginTop: 1 },
  checkboxChecked: { backgroundColor: '#F04E23', borderColor: '#F04E23' },
  termsText: { flex: 1, fontSize: 12, color: '#666', lineHeight: 16 },
  termsLink: { color: '#F04E23', fontWeight: 'bold' },
  submitButton: { backgroundColor: '#F04E23', flexDirection: 'row', height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', shadowColor: '#F04E23', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  submitButtonText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { fontSize: 12, color: '#666' },
  footerLink: { fontSize: 12, color: '#F04E23', fontWeight: 'bold' },
});