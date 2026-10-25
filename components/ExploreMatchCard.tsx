import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SportsMatch, acceptedCount } from '../context/SportsContext';
import { CategoryIcon, palette } from './SportsUI';

export default function ExploreMatchCard({ match, distance }: { match: SportsMatch; distance?: number }) {
  const participants = acceptedCount(match);
  const capacity = Math.max(1, match.capacity);
  const remaining = Math.max(0, capacity - participants);
  const percentage = Math.min(100, (participants / capacity) * 100);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(match.date)
    ? match.date.split('-').reverse().join('/') : match.date;
  const goToMatch = () => router.push({ pathname: '/partidas/[id]', params: { id: match.id } });
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${match.title}. ${match.sport}. ${date} às ${match.time}. ${match.location}. ${participants} de ${capacity} participantes. ${remaining ? `${remaining} vagas disponíveis` : 'Sem vagas'}. ${distance !== undefined ? `${distance.toFixed(1).replace('.', ',')} quilômetros de distância.` : ''} Ver detalhes.`}
      accessibilityHint="Abre os detalhes da partida"
      onPress={goToMatch}
      style={({ pressed }) => ({ backgroundColor: pressed ? '#F0F6F1' : '#FFFFFF', borderColor: '#DFE7E2', borderWidth: 1, borderRadius: 20, padding: 16, gap: 12, minHeight: 180 })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <View style={{ backgroundColor: '#E6F2EB', width: 52, height: 52, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
          <CategoryIcon sport={match.sport} size={26} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: palette.ink }}>{match.title || match.sport}</Text>
          <Text style={{ fontSize: 15, color: palette.muted }}>{match.sport} · {date} · {match.time}</Text>
        </View>
        <View style={{ backgroundColor: remaining ? '#E6F2EB' : '#F3ECE7', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 7 }}>
          <Text style={{ color: remaining ? palette.teal : '#784A36', fontSize: 13, fontWeight: '800' }}>{remaining ? `${remaining} ${remaining === 1 ? 'vaga' : 'vagas'}` : 'Lotada'}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
        <Ionicons name="location-outline" size={19} color={palette.teal} />
        <Text style={{ flex: 1, color: palette.muted, fontSize: 15 }}>{match.location}{distance !== undefined ? ` · ${distance.toFixed(1).replace('.', ',')} km` : ''}</Text>
      </View>
      <View accessible accessibilityLabel={`${participants} de ${capacity} participantes confirmados`} style={{ backgroundColor: '#E7EEE9', height: 8, borderRadius: 8, overflow: 'hidden' }}>
        <View style={{ backgroundColor: palette.teal, width: `${percentage}%`, height: '100%', borderRadius: 8 }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <Text style={{ color: palette.muted, fontSize: 14 }}>{participants} de {capacity} participantes</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <Text style={{ color: palette.orange, fontWeight: '800', fontSize: 15 }}>Ver partida</Text>
          <Ionicons name="chevron-forward" size={18} color={palette.orange} />
        </View>
      </View>
    </Pressable>
  );
}
