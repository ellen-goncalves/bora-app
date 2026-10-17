import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '../../context/AppContext';

export default function MatchesScreen() {
  const { matches } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Partidas</Text>
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => router.push('/create-match' as any)}
          >
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.createBtnText}>Criar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Explore partidas abertas e entre para jogar!</Text>

        {matches.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.matchCard}
            onPress={() =>
              router.push(
                item.type === 'Online'
                  ? ('/online-team' as any)
                  : ('/match-details' as any)
              )
            }
          >
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                {item.type === 'Online' ? (
                  <Ionicons name="game-controller-outline" size={20} color="#F04E23" />
                ) : (
                  <MaterialCommunityIcons name="volleyball" size={20} color="#F04E23" />
                )}
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.matchTitle}>{item.title}</Text>
                <Text style={styles.matchCategory}>{item.category}</Text>
              </View>
              <View
                style={[
                  styles.typeBadge,
                  item.type === 'Online' ? styles.badgeOnline : styles.badgePresencial,
                ]}
              >
                <Text
                  style={[
                    styles.typeBadgeText,
                    item.type === 'Online' ? styles.textOnline : styles.textPresencial,
                  ]}
                >
                  {item.type}
                </Text>
              </View>
            </View>

            <View style={styles.cardDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={14} color="#6B7280" style={{ marginRight: 6 }} />
                <Text style={styles.detailText}>{item.date}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons
                  name={item.type === 'Online' ? 'desktop-outline' : 'location-outline'}
                  size={14}
                  color="#6B7280"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.detailText}>{item.locationOrPlatform}</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.vacanciesText}>
                {item.vacancies} vagas disponíveis ({item.participants.length}/{item.totalSpots})
              </Text>
              <Text style={styles.linkText}>Ver detalhes →</Text>
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 12, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  createBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F04E23', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  createBtnText: { color: '#FFF', fontWeight: 'bold', marginLeft: 4, fontSize: 13 },
  subtitle: { fontSize: 12, color: '#888', marginBottom: 16 },
  matchCard: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 18, padding: 14, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF0ED', justifyContent: 'center', alignItems: 'center' },
  matchTitle: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A' },
  matchCategory: { fontSize: 11, color: '#888', marginTop: 1 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeOnline: { backgroundColor: '#E0F2FE' },
  badgePresencial: { backgroundColor: '#FFF0ED' },
  typeBadgeText: { fontSize: 10, fontWeight: 'bold' },
  textOnline: { color: '#0284C7' },
  textPresencial: { color: '#F04E23' },
  cardDetails: { marginBottom: 10, paddingVertical: 6, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
  detailText: { fontSize: 12, color: '#4B5563' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vacanciesText: { fontSize: 11, fontWeight: '600', color: '#16A34A' },
  linkText: { fontSize: 12, fontWeight: 'bold', color: '#F04E23' },
});