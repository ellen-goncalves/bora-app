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
  Image,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '../context/AppContext';

export default function NotificationsScreen() {
  const {
    notifications,
    pendingRequests,
    markAllNotificationsAsRead,
    acceptFriendRequest,
    rejectFriendRequest,
    confirmMatchInvite,
    acceptedInviteIds,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleAcceptFriend = (requestId: string, friendName: string, avatarUrl: string) => {
    acceptFriendRequest(requestId, friendName, avatarUrl);
    Alert.alert('Sucesso', `Solicitação de amizade de ${friendName} foi aceita!`);
  };

  const handleRejectFriend = (requestId: string) => {
    rejectFriendRequest(requestId);
  };

  const handleConfirmInvite = (inviteId: string, matchId: string) => {
    confirmMatchInvite(inviteId, matchId);
    Alert.alert('Presença confirmada!', 'Sua vaga foi garantida na partida.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* Topo / Barra de Navegação */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Notificações</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="settings" size={18} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Abas de Filtro */}
        <View style={styles.filterTabsRow}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>Todas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, filter === 'unread' && styles.filterTabActive]}
            onPress={() => setFilter('unread')}
          >
            <Text style={[styles.filterTabText, filter === 'unread' && styles.filterTabTextActive]}>
              Não lidas · {unreadCount}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Marcador de Lidas */}
        <View style={styles.actionsHeaderRow}>
          <Text style={styles.novidadesCountText}>Você tem {unreadCount} novidade(s)</Text>
          <TouchableOpacity onPress={markAllNotificationsAsRead}>
            <Text style={styles.markReadText}>Marcar todas como lidas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Novas</Text>
          <Text style={styles.sectionDateText}>Hoje, 9 out.</Text>
        </View>

        {/* Solicitações de Amizade com Foto Real */}
        {pendingRequests.map((req) => (
          <View key={req.id} style={[styles.notificationCard, styles.unreadCard]}>
            <View style={styles.cardHeaderRow}>
              <Image source={{ uri: req.avatarUrl }} style={styles.avatarImage} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.timeAgoText}>{req.time}</Text>
                <Text style={styles.cardTitle}>{req.name} quer ser sua amiga</Text>
              </View>
              <View style={styles.unreadDot} />
            </View>

            <Text style={styles.cardDescription}>{req.info}. Bora jogar junto?</Text>

            <View style={styles.friendButtonsRow}>
              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => handleAcceptFriend(req.id, req.name, req.avatarUrl)}
              >
                <Text style={styles.acceptBtnText}>Aceitar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => handleRejectFriend(req.id)}
              >
                <Text style={styles.rejectBtnText}>Recusar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Notificação de Convite para Partida com Foto da Bia */}
        {notifications.map((notif) => {
          const isAccepted = acceptedInviteIds.includes(notif.id);

          return (
            <View
              key={notif.id}
              style={[
                styles.notificationCard,
                !notif.read && styles.unreadCard,
              ]}
            >
              <View style={styles.cardHeaderRow}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' }}
                  style={styles.avatarImage}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.timeAgoText}>{notif.timeAgo}</Text>
                  <Text style={styles.cardTitle}>{notif.title}</Text>
                </View>
                {!notif.read && <View style={styles.unreadDot} />}
              </View>

              <Text style={styles.cardDescription}>{notif.description}</Text>

              <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                  style={styles.cardActionRow}
                  onPress={() => router.push('/match-details' as any)}
                >
                  <Text style={styles.actionText}>Ver partida</Text>
                  <Feather name="chevron-right" size={16} color="#F04E23" />
                </TouchableOpacity>

                {notif.type === 'invite' && (
                  <TouchableOpacity
                    style={[
                      styles.confirmInviteBtn,
                      isAccepted && { backgroundColor: '#10B981' },
                    ]}
                    disabled={isAccepted}
                    onPress={() => handleConfirmInvite(notif.id, '2')}
                  >
                    <Text style={styles.confirmInviteText}>
                      {isAccepted ? 'Confirmado ✓' : 'Aceitar Convite'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  iconButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  navTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
  filterTabsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 16 },
  filterTab: { flex: 0.48, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 10, borderRadius: 20, alignItems: 'center' },
  filterTabActive: { backgroundColor: '#111827', borderColor: '#111827' },
  filterTabText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  filterTabTextActive: { color: '#FFF' },
  actionsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  novidadesCountText: { fontSize: 12, color: '#6B7280' },
  markReadText: { fontSize: 12, fontWeight: 'bold', color: '#F04E23' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  sectionDateText: { fontSize: 11, color: '#9CA3AF' },
  notificationCard: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 18, padding: 14, marginBottom: 12 },
  unreadCard: { backgroundColor: '#FFF0ED', borderColor: '#FEE2E2' },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  avatarImage: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  timeAgoText: { fontSize: 10, color: '#9CA3AF' },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A', marginTop: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F04E23', alignSelf: 'flex-start', marginTop: 4 },
  cardDescription: { fontSize: 12, color: '#4B5563', lineHeight: 18, marginBottom: 12, marginLeft: 50 },
  friendButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginLeft: 50, marginTop: 4 },
  acceptBtn: { flex: 0.48, backgroundColor: '#F04E23', paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  acceptBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  rejectBtn: { flex: 0.48, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  rejectBtnText: { color: '#4B5563', fontSize: 12, fontWeight: 'bold' },
  actionButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 50, marginTop: 4 },
  cardActionRow: { flexDirection: 'row', alignItems: 'center' },
  actionText: { fontSize: 12, fontWeight: 'bold', color: '#F04E23', marginRight: 2 },
  confirmInviteBtn: { backgroundColor: '#F04E23', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  confirmInviteText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
});