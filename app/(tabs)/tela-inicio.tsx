import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '../../context/AppContext';

export default function TelaInicioScreen() {
  const { userProfile, matches, friends } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.userProfileBtn} onPress={() => router.push('/profile' as any)}>
            <Image source={{ uri: userProfile.avatarUrl }} style={styles.avatarImage} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.welcomeText}>Olá, {userProfile.name}</Text>
              <Text style={styles.locationText}>{userProfile.location}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/notifications' as any)}>
            <Ionicons name="notifications-outline" size={20} color="#1A1A1A" />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>

        {/* Mapa Centralizado de Partidas por Perto */}
        <View style={styles.mapSectionCard}>
          <View style={styles.mapPreviewContainer}>
            <View style={styles.mapParkBg} />
            <View style={styles.mapRoadHorizontal} />
            <View style={styles.mapRoadVertical} />
            <Text style={styles.mapParkLabel}>Parque do Ibirapuera · 1,2 km</Text>
            <View style={styles.mapPinContainer}>
              <View style={styles.mapPinIconBox}>
                <MaterialCommunityIcons name="volleyball" size={16} color="#FFF" />
              </View>
              <View style={styles.mapPinBadge}>
                <Text style={styles.mapPinBadgeText}>Vôlei amanhã, 10h</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.expandMapBtn}>
              <Feather name="maximize-2" size={14} color="#374151" />
            </TouchableOpacity>
          </View>
          <View style={styles.mapFooterRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.mapFooterTitle}>Partidas na proximidade</Text>
              <Text style={styles.mapFooterSub}>Toque para ver os detalhes e participar</Text>
            </View>
            <TouchableOpacity style={styles.mapActionBtn} onPress={() => router.push('/match-details' as any)}>
              <Text style={styles.mapActionText}>Ver partida</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botões de Ação Rápida (Presencial / Online) */}
        <View style={styles.heroButtonsRow}>
          <TouchableOpacity 
            style={styles.heroBtnPresencial}
            onPress={() => router.push('/matches' as any)}
          >
            <MaterialCommunityIcons name="volleyball" size={16} color="#F04E23" style={{ marginRight: 6 }} />
            <Text style={styles.heroBtnPresencialText}>Presencial</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.heroBtnOnline}
            onPress={() => router.push('/matches' as any)}
          >
            <Ionicons name="game-controller-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
            <Text style={styles.heroBtnOnlineText}>Online</Text>
          </TouchableOpacity>
        </View>

        {/* Seção: Partidas em Alta */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Partidas criadas/chamadas</Text>
          <TouchableOpacity onPress={() => router.push('/matches' as any)}>
            <Text style={styles.seeAllText}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {matches.slice(0, 2).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.matchCard}
            onPress={() => router.push(item.type === 'Online' ? ('/online-team' as any) : ('/match-details' as any))}
          >
            <View style={styles.matchCardTop}>
              <View style={styles.matchIconSquare}>
                {item.type === 'Online' ? (
                  <Ionicons name="game-controller" size={20} color="#F04E23" />
                ) : (
                  <MaterialCommunityIcons name="volleyball" size={20} color="#F04E23" />
                )}
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.matchTitle}>{item.title}</Text>
                <Text style={styles.matchSub}>{item.category}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        ))}

        {/* Seção: Amigos Ativos */}
        <View style={[styles.sectionHeaderRow, { marginTop: 16 }]}>
          <Text style={styles.sectionTitle}>Lista de Amigos</Text>
          <TouchableOpacity onPress={() => router.push('/friends' as any)}>
            <Text style={styles.seeAllText}>Ver amigos</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.friendsHorizontalList}>
          {friends.map((friend) => (
            <TouchableOpacity
              key={friend.id}
              style={styles.friendHorizontalChip}
              onPress={() => router.push({ pathname: '/chat', params: { friendId: friend.id, friendName: friend.name } } as any)}
            >
              <View style={styles.friendAvatarBox}>
                <Image source={{ uri: friend.avatarUrl }} style={styles.friendAvatarImage} />
                {friend.isOnline && <View style={styles.onlineDot} />}
              </View>
              <Text style={styles.friendNameText}>{friend.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 12, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  userProfileBtn: { flexDirection: 'row', alignItems: 'center' },
  avatarImage: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#E5E7EB' },
  welcomeText: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  locationText: { fontSize: 11, color: '#888', marginTop: 1 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  notifBadge: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F04E23', position: 'absolute', top: 8, right: 10 },
  mapSectionCard: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 20, overflow: 'hidden', marginBottom: 16 },
  mapPreviewContainer: { height: 140, backgroundColor: '#EBF2EA', position: 'relative', overflow: 'hidden' },
  mapParkBg: { position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', backgroundColor: '#D5E6D3' },
  mapRoadHorizontal: { position: 'absolute', top: '40%', left: -10, width: '120%', height: 16, backgroundColor: '#FFF', transform: [{ rotate: '5deg' }] },
  mapRoadVertical: { position: 'absolute', right: '30%', top: -10, width: 16, height: '130%', backgroundColor: '#FFF' },
  mapParkLabel: { position: 'absolute', top: 12, left: 16, fontSize: 10, color: '#8B9A8B', fontWeight: 'bold' },
  mapPinContainer: { position: 'absolute', top: '35%', left: '42%', alignItems: 'center' },
  mapPinIconBox: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F04E23', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  mapPinBadge: { backgroundColor: '#FFF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: -4, borderWidth: 1, borderColor: '#E5E7EB' },
  mapPinBadgeText: { fontSize: 9, fontWeight: 'bold', color: '#1F2937' },
  expandMapBtn: { position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  mapFooterRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  mapFooterTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  mapFooterSub: { fontSize: 11, color: '#888', marginTop: 2 },
  mapActionBtn: { backgroundColor: '#FFF0ED', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  mapActionText: { fontSize: 12, fontWeight: 'bold', color: '#F04E23' },
  heroButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  heroBtnPresencial: { flex: 0.48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 12, borderRadius: 14 },
  heroBtnPresencialText: { fontSize: 13, fontWeight: 'bold', color: '#F04E23' },
  heroBtnOnline: { flex: 0.48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F04E23', paddingVertical: 12, borderRadius: 14 },
  heroBtnOnlineText: { fontSize: 13, fontWeight: 'bold', color: '#FFF' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  seeAllText: { fontSize: 12, fontWeight: 'bold', color: '#F04E23' },
  matchCard: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, padding: 14, marginBottom: 10 },
  matchCardTop: { flexDirection: 'row', alignItems: 'center' },
  matchIconSquare: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#FFF0ED', justifyContent: 'center', alignItems: 'center' },
  matchTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  matchSub: { fontSize: 11, color: '#888', marginTop: 1 },
  friendsHorizontalList: { flexDirection: 'row' },
  friendHorizontalChip: { alignItems: 'center', marginRight: 16 },
  friendAvatarBox: { width: 48, height: 48, borderRadius: 24, position: 'relative' },
  friendAvatarImage: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#FEE2E2' },
  onlineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981', position: 'absolute', bottom: 0, right: 0, borderWidth: 2, borderColor: '#FFF' },
  friendNameText: { fontSize: 11, fontWeight: '600', color: '#374151', marginTop: 4 },
});