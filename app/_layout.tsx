import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../context/AppContext';

export default function RootLayout() {
  return (
    <AppProvider>
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
        <Stack.Screen name="online-team" />
        <Stack.Screen name="presencial-match" />
        <Stack.Screen name="edit-profile" />
      </Stack>
    </AppProvider>
  );
}