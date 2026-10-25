import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {useAuth} from '../../context/AuthContext';
import {Action,palette} from '../../components/SportsUI';
import { useApp } from '../../context/AppContext';
import {useSports} from '../../context/SportsContext';

export default function ProfileScreen() {
  const { userProfile, friends } = useApp();
  const {isAuthenticated,signOut}=useAuth();
  const {matches} = useSports();

  const handleLogout = () => {
    // Redireciona de volta para a tela de login na raiz
    signOut();
    router.replace('/(tabs)/tela-inicio' as any);
  };

  if (!isAuthenticated) return <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={[styles.scrollContent,{flexGrow:1,justifyContent:'center',gap:18}]}>
      <View style={{alignItems:'center',gap:12,padding:24,backgroundColor:'#FFFFFF',borderRadius:24,borderWidth:1,borderColor:palette.line}}>
        <Ionicons name="person-circle-outline" size={82} color={palette.teal} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"/>
        <Text accessibilityRole="header" style={{fontSize:28,fontWeight:'800',color:palette.ink,textAlign:'center'}}>Seu espaço no Bora</Text>
        <Text style={{fontSize:17,lineHeight:26,textAlign:'center',color:palette.muted}}>Entre para acompanhar sua agenda, organizar partidas, gerenciar solicitações e conhecer pessoas.</Text>
      </View>
      <Action label="Entrar na minha conta" onPress={()=>router.push('/login')}/>
      <Action secondary label="Criar conta grátis" onPress={()=>router.push('/register')}/>
      <Action secondary label="Continuar explorando" onPress={()=>router.push('/(tabs)/tela-inicio')}/>
    </ScrollView>
  </SafeAreaView>;
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho */}
        <View style={styles.topHeader}>
          <Text style={styles.headerTitle}>Perfil</Text>
          <TouchableOpacity style={styles.settingsBtn}>
            <Feather name="settings" size={20} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        {/* Card do Usuário com Foto Real */}
        <View style={styles.profileCard}>
          <Image source={{ uri: userProfile.avatarUrl }} style={styles.avatarLargeImage} />
          
          <Text style={styles.userName}>{userProfile.name}</Text>
          <Text style={styles.userHandle}>{userProfile.username}</Text>
          <Text style={styles.userLocation}>{userProfile.location}</Text>
          <Text style={styles.userBio}>{userProfile.bio}</Text>

          {/* Botão de Editar Perfil */}
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => router.push('/edit-profile' as any)}
          >
            <Feather name="edit-2" size={14} color="#F04E23" style={{ marginRight: 6 }} />
            <Text style={styles.editProfileText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userProfile.playedCount}</Text>
            <Text style={styles.statLabel}>Partidas jogadas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userProfile.organizedCount}</Text>
            <Text style={styles.statLabel}>Organizadas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{friends.length}</Text>
            <Text style={styles.statLabel}>Amigos</Text>
          </View>
        </View>

        {/* Esportes / Jogos Favoritos */}
        <Text style={styles.sectionTitle}>Esportes e Jogos</Text>
        <View style={styles.sportsContainer}>
          <View style={styles.sportChip}>
            <MaterialCommunityIcons name="volleyball" size={16} color="#F04E23" style={{ marginRight: 6 }} />
            <Text style={styles.sportChipText}>Vôlei</Text>
          </View>
          <View style={styles.sportChip}>
            <Ionicons name="grid-outline" size={16} color="#F04E23" style={{ marginRight: 6 }} />
            <Text style={styles.sportChipText}>Xadrez</Text>
          </View>
          <View style={styles.sportChip}>
            <Ionicons name="football-outline" size={16} color="#F04E23" style={{ marginRight: 6 }} />
            <Text style={styles.sportChipText}>Futebol</Text>
          </View>
        </View>

        {/* Próximas Partidas Agendadas */}
        <Text style={styles.sectionTitle}>Minha agenda</Text>
        {matches.slice(0, 2).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.agendaCard}
            onPress={() => router.push({pathname:'/partidas/[id]',params:{id:item.id}})}
          >
            <View style={styles.agendaCardLeft}>
              <View style={styles.agendaIconBox}>
                <MaterialCommunityIcons name="account-group-outline" size={20} color="#F04E23" />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.agendaTitle}>{item.title}</Text>
                <Text style={styles.agendaSub}>{item.date}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ))}

        {/* Botão de Deslogar / Sair da Conta */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#DC2626" style={{ marginRight: 8 }} />
          <Text style={styles.logoutButtonText}>Sair da conta</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 12, paddingBottom: 40 },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  settingsBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  profileCard: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 16 },
  avatarLargeImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 12, borderWidth: 2, borderColor: '#F04E23' },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  userHandle: { fontSize: 12, color: '#888', marginTop: 2 },
  userLocation: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  userBio: { fontSize: 12, color: '#4B5563', textAlign: 'center', marginTop: 8, paddingHorizontal: 10 },
  editProfileBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0ED', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, marginTop: 14 },
  editProfileText: { fontSize: 12, fontWeight: 'bold', color: '#F04E23' },
  statsRow: { flexDirection: 'row', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 18, paddingVertical: 14, marginBottom: 20, justifyContent: 'space-around', alignItems: 'center' },
  statBox: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  statDivider: { width: 1, height: 24, backgroundColor: '#E5E7EB' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12 },
  sportsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  sportChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, marginRight: 8, marginBottom: 8 },
  sportChipText: { fontSize: 12, fontWeight: 'bold', color: '#1A1A1A' },
  agendaCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, padding: 14, marginBottom: 16 },
  agendaCardLeft: { flexDirection: 'row', alignItems: 'center' },
  agendaIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF0ED', justifyContent: 'center', alignItems: 'center' },
  agendaTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  agendaSub: { fontSize: 11, color: '#888', marginTop: 2 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FCA5A5', height: 50, borderRadius: 16, marginTop: 10 },
  logoutButtonText: { color: '#DC2626', fontSize: 14, fontWeight: 'bold' },
});