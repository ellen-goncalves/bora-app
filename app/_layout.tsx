import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../context/AppContext';
import { AuthProvider } from '../context/AuthContext';
import { SportsProvider } from '../context/SportsContext';

export default function RootLayout() {
  return (
    <AuthProvider><AppProvider><SportsProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* A raiz redireciona visitantes para a tela inicial pública. */}
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
        <Stack.Screen name="login" />
        
        {/* Abas públicas: visitantes podem explorar partidas. */}
        <Stack.Screen name="(tabs)" />

        {/* Telas internas e Modais */}
        <Stack.Screen name="chat" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="create-match" />
        <Stack.Screen name="match-details" />
        <Stack.Screen name="partidas/[id]" />
        <Stack.Screen name="edit-profile" />
      </Stack>
    </SportsProvider></AppProvider></AuthProvider>
  );
}