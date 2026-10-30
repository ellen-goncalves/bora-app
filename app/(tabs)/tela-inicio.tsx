import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Action, MatchCard, palette, styles } from '../../components/SportsUI';
import { ModalityCategory, categoryForModality } from '../../constants/modalities';
import { useAuth } from '../../context/AuthContext';
import { currentUserId, useSports } from '../../context/SportsContext';
export default function Home() {
    const { matches, connected } = useSports();
    const { isAuthenticated } = useAuth();
    const [category, setCategory] = useState<'Todas' | ModalityCategory>('Todas');
    const mine = (isAuthenticated ? matches : []).filter(m => m.organizerId === currentUserId || m.requests.some(r => r.userId === currentUserId && ['pending', 'accepted'].includes(r.status)));
    const upcoming = mine.filter(m => m.status === 'open').sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
    const discover = matches.filter(m => m.status === 'open' && (category === 'Todas' || categoryForModality(m.sport) === category));
    return <SafeAreaView style={styles.page}><ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={{ paddingTop: 10, gap: 5 }}><Text style={{ fontSize: 16, fontWeight: '700', color: palette.teal }}>ENCONTROS DE VERDADE, PERTO DE VOCÊ</Text><Text style={styles.h1}>Bora jogar?</Text><Text style={styles.muted}>Encontre uma turma para praticar suas atividades.</Text></View>
        <View style={styles.row}><Text style={styles.h2}>{isAuthenticated ? "Minha agenda" : "Sua próxima partida começa aqui"}</Text><Text style={{ color: palette.teal, fontWeight: '700', fontSize: 15 }}>{upcoming.length} {upcoming.length === 1 ? 'partida' : 'partidas'}</Text></View>
        {upcoming.length ? upcoming.slice(0, 3).map(m => <MatchCard key={m.id} match={m} />) : <View style={styles.card}><Text style={styles.text}>Entre para acompanhar suas partidas e solicitações.</Text><Action secondary label="Explorar partidas" onPress={() => router.push('/matches')} /></View>}
        <Action secondary label="Ver todas as partidas" onPress={() => router.push('/matches')} />
        <Pressable accessibilityRole="button" accessibilityLabel="Organizar uma partida presencial" onPress={() => router.push(isAuthenticated ? '/create-match' : { pathname: '/login', params: { returnTo: '/create-match' } })} style={{ minHeight: 74, backgroundColor: palette.ink, borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 12 }}><Ionicons name="add-circle" color="#F8B48A" size={34} /><View style={{ flex: 1 }}><Text style={{ fontSize: 19, fontWeight: '800', color: '#FFFFFF' }}>Organizar uma partida</Text><Text style={{ fontSize: 15, color: '#E4EDE8' }}>Convide pessoas para jogar com você</Text></View><Ionicons name="chevron-forward" color="#FFFFFF" size={23} /></Pressable>

    </ScrollView></SafeAreaView>
}
