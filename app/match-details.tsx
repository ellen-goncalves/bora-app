import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '../context/AppContext';

export default function MatchDetailsScreen() {
  const { matches, joinMatch } = useApp();
  // Selecionando a partida presencial de exemplo (id '2')
  const match = matches.find((m) => m.id === '2') || matches[0];
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (joined) {
      Alert.alert('Aviso', 'Você já está confirmado nesta partida!');
      return;
    }
    if (match.vacancies <= 0) {
      Alert.alert('Aviso', 'Não há mais vagas disponíveis para esta partida.');
      return;
    }

    joinMatch(match.id);
    setJoined(true);
    Alert.alert('Sucesso! 🎉', 'Sua presença foi confirmada na partida!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* Topo / Barra de Navegação */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Detalhes da partida</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="share-outline" size={20} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho da Partida */}
        <View style={styles.matchHeaderRow}>
          <View style={styles.sportIconBox}>
            <MaterialCommunityIcons name="volleyball" size={26} color="#F04E23" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.matchTitle}>{match.title}</Text>
            <Text style={styles.matchSubText}>{match.category}</Text>
          </View>
        </View>

        {/* Badges de Tipo e Vagas Dinâmicas */}
        <View style={styles.badgesRow}>
          <View style={styles.badgePresencial}>
            <Text style={styles.badgePresencialText}>{match.type}</Text>
          </View>
          <View style={[styles.badgeVacancies, match.vacancies === 0 && { backgroundColor: '#FEE2E2' }]}>
            <Text style={[styles.badgeVacanciesText, match.vacancies === 0 && { color: '#DC2626' }]}>
              {match.vacancies > 0 ? `${match.vacancies} vagas disponíveis` : 'Lotado'}
            </Text>
          </View>
        </View>

        {/* Card de Data e Horário */}
        <View style={styles.dateCard}>
          <View style={styles.dateIconBox}>
            <Ionicons name="calendar-outline" size={20} color="#F04E23" />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.dateTitle}>{match.date}</Text>
            <Text style={styles.dateSubText}>1 hora de jogo</Text>
          </View>
        </View>

        {/* Onde Vamos Jogar */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Onde vamos jogar</Text>
          <Text style={styles.distanceText}>1,2 km de você</Text>
        </View>

        <View style={styles.locationCard}>
          <View style={styles.mapPreviewContainer}>
            <View style={styles.mapParkBg} />
            <View style={styles.mapRoadHorizontal} />
            <View style={styles.mapRoadVertical} />
            <Text style={styles.mapParkLabel}>Parque do Ibirapuera</Text>
            <View style={styles.mapPinContainer}>
              <View style={styles.mapPinIconBox}>
                <MaterialCommunityIcons name="volleyball" size={16} color="#FFF" />
              </View>
              <View style={styles.mapPinBadge}>
                <Text style={styles.mapPinBadgeText}>Quadras de vôlei</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.expandMapBtn}>
              <Feather name="maximize-2" size={14} color="#374151" />
            </TouchableOpacity>
          </View>

          <View style={styles.locationAddressRow}>
            <Ionicons name="location" size={20} color="#F04E23" style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.addressTitle}>Quadras do Ibirapuera</Text>
              <Text style={styles.addressSub}>Parque Ibirapuera · São Paulo</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.openRouteText}>Abrir rota</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quem Vai Jogar */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Quem vai jogar</Text>
          <Text style={styles.participantsCountText}>
            {match.participants.length} de {match.totalSpots} participantes
          </Text>
        </View>

        <View style={styles.organizerCard}>
          <View style={styles.organizerTopRow}>
            <View style={styles.avatarBox}>
              <FontAwesome name="user" size={18} color="#555" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.organizerName}>Bia</Text>
              <Text style={styles.organizerSub}>Organizadora · sua amiga</Text>
            </View>
            <TouchableOpacity style={styles.chatButton} onPress={() => router.push('/chat' as any)}>
              <Ionicons name="chatbubble-outline" size={14} color="#F04E23" style={{ marginRight: 6 }} />
              <Text style={styles.chatButtonText}>Conversar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.otherParticipantsRow}>
            <Text style={styles.otherParticipantsText}>
              Participantes: {match.participants.join(', ')}
            </Text>
          </View>
        </View>

        <View style={styles.beforeArrivalCard}>
          <Text style={styles.beforeArrivalTitle}>Antes de chegar</Text>
          <Text style={styles.beforeArrivalSub}>
            Chegue às 9h50 nas quadras. Leve água e tênis. A Bia leva a bola. Todos os níveis são bem-vindos!
          </Text>
        </View>

        {/* Botão de Confirmação com Estado Dinâmico */}
        <Text style={styles.footerNoteText}>
          {joined ? 'Sua participação está confirmada!' : 'Você ainda não participa. Amigos podem entrar direto.'}
        </Text>

        <TouchableOpacity
          style={[styles.confirmButton, joined && { backgroundColor: '#16A34A' }]}
          onPress={handleJoin}
        >
          <Ionicons name={joined ? 'checkmark-circle' : 'checkmark'} size={18} color="#FFF" style={{ marginRight: 6 }} />
          <Text style={styles.confirmButtonText}>
            {joined ? 'Presença Confirmada' : 'Confirmar participação'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  iconButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  navTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  matchHeaderRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 12 },
  sportIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#FFF0ED', justifyContent: 'center', alignItems: 'center' },
  matchTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  matchSubText: { fontSize: 12, color: '#888', marginTop: 2 },
  badgesRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  badgePresencial: { backgroundColor: '#FFF0ED', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginRight: 8 },
  badgePresencialText: { fontSize: 11, fontWeight: 'bold', color: '#F04E23' },
  badgeVacancies: { backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeVacanciesText: { fontSize: 11, fontWeight: 'bold', color: '#16A34A' },
  dateCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0ED', padding: 14, borderRadius: 16, marginBottom: 20 },
  dateIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  dateTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  dateSubText: { fontSize: 11, color: '#888', marginTop: 2 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  distanceText: { fontSize: 11, color: '#888' },
  participantsCountText: { fontSize: 11, color: '#888' },
  locationCard: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 18, overflow: 'hidden', marginBottom: 20 },
  mapPreviewContainer: { height: 120, backgroundColor: '#EBF2EA', position: 'relative', overflow: 'hidden' },
  mapParkBg: { position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', backgroundColor: '#D5E6D3' },
  mapRoadHorizontal: { position: 'absolute', top: '40%', left: -10, width: '120%', height: 16, backgroundColor: '#FFF', transform: [{ rotate: '5deg' }] },
  mapRoadVertical: { position: 'absolute', right: '30%', top: -10, width: 16, height: '130%', backgroundColor: '#FFF' },
  mapParkLabel: { position: 'absolute', top: 12, left: 16, fontSize: 10, color: '#8B9A8B', fontWeight: 'bold' },
  mapPinContainer: { position: 'absolute', top: '30%', left: '40%', alignItems: 'center' },
  mapPinIconBox: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F04E23', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  mapPinBadge: { backgroundColor: '#FFF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: -4, borderWidth: 1, borderColor: '#E5E7EB' },
  mapPinBadgeText: { fontSize: 9, fontWeight: 'bold', color: '#1F2937' },
  expandMapBtn: { position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  locationAddressRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  addressTitle: { fontSize: 13, fontWeight: 'bold', color: '#1A1A1A' },
  addressSub: { fontSize: 11, color: '#888', marginTop: 1 },
  openRouteText: { fontSize: 12, fontWeight: 'bold', color: '#F04E23' },
  organizerCard: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 18, padding: 14, marginBottom: 12 },
  organizerTopRow: { flexDirection: 'row', alignItems: 'center' },
  avatarBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  organizerName: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  organizerSub: { fontSize: 11, color: '#888', marginTop: 1 },
  chatButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12 },
  chatButtonText: { fontSize: 12, fontWeight: 'bold', color: '#F04E23' },
  otherParticipantsRow: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  otherParticipantsText: { fontSize: 11, color: '#6B7280' },
  beforeArrivalCard: { backgroundColor: '#F3F4F6', padding: 14, borderRadius: 16, marginBottom: 16 },
  beforeArrivalTitle: { fontSize: 13, fontWeight: 'bold', color: '#1F2937' },
  beforeArrivalSub: { fontSize: 11, color: '#4B5563', lineHeight: 16, marginTop: 4 },
  footerNoteText: { fontSize: 11, color: '#888', textAlign: 'center', marginBottom: 12 },
  confirmButton: { backgroundColor: '#F04E23', flexDirection: 'row', height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#F04E23', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  confirmButtonText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
});