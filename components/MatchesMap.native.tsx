import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import MapView, { Circle, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { SportsMatch } from '../context/SportsContext';
import { Coordinates } from '../hooks/useNearbyMatches';
import { palette } from './SportsUI';

type Props = { matches: (SportsMatch & Coordinates)[]; position: Coordinates | null; radius: number; onSelect: (id: string) => void };
export default function MatchesMap({ matches, position, radius, onSelect }: Props) {
  const ref = useRef<MapView>(null);
  const center = position ?? (matches[0] ? {latitude:matches[0].latitude, longitude:matches[0].longitude} : null);
  useEffect(() => { if (center) ref.current?.animateToRegion({ ...center, latitudeDelta: position ? Math.max(0.015, radius / 55) : 0.06, longitudeDelta: position ? Math.max(0.015, radius / 55) : 0.06 }, 450); }, [center?.latitude, center?.longitude, radius, !!position]);
  if (!center) return <View style={{height:290,alignItems:'center',justifyContent:'center',backgroundColor:'#E8F1E8',borderRadius:22,padding:20}}><Text style={{fontSize:16,color:palette.ink,textAlign:'center'}}>Ainda não há partidas com localização no mapa.</Text></View>;
  return <MapView ref={ref} provider={PROVIDER_DEFAULT} style={{height:320,width:'100%',borderRadius:22}} initialRegion={{...center,latitudeDelta:0.07,longitudeDelta:0.07}} accessibilityLabel="Mapa de partidas disponíveis. A lista abaixo permite navegar por leitor de tela.">
    {position && <><Circle center={position} radius={radius * 1000} strokeColor="#12675CAA" fillColor="#12675C18"/><Marker coordinate={position} title="Sua localização aproximada" pinColor="#C74720"/></>}
    {matches.map(m => <Marker key={m.id} coordinate={{latitude:m.latitude,longitude:m.longitude}} title={m.sport} description={`${m.date} às ${m.time} · ${m.location}`} onCalloutPress={()=>onSelect(m.id)} onPress={()=>onSelect(m.id)}/>) }
  </MapView>;
}
