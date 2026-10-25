import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../context/AppContext';
import { SportsProvider } from '../context/SportsContext';

export default function RootLayout() {
  return (
    <AppProvider><SportsProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* A primeira tela exibida será sempre o index.tsx na raiz */}
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
        
        {/* Grupo de abas protegido */}
        <Stack.Screen name="(tabs)" />

        {/* Telas internas e Modais */}
        <Stack.Screen name="chat" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="create-match" />
        <Stack.Screen name="match-details" />
        <Stack.Screen name="partidas/[id]" />
        <Stack.Screen name="edit-profile" />
      </Stack>
    </SportsProvider></AppProvider>
  );
}