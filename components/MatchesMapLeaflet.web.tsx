import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SportsMatch } from '../context/SportsContext';
import { Coordinates } from '../hooks/useNearbyMatches';
import { palette } from './SportsUI';

type Props = { matches: (SportsMatch & Coordinates)[]; position: Coordinates | null; radius: number; onSelect: (id: string) => void };
// Explicit icon URLs avoid Leaflet's missing default marker assets under Metro.
const matchIcon = L.divIcon({ html:'<span style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:3px solid white;border-radius:50%;background:#172B29;color:white;font-size:20px;box-shadow:0 2px 9px #0004">●</span>', className:'', iconSize:[36,36], iconAnchor:[18,18] });
const userIcon = L.divIcon({ html:'<span style="display:block;width:20px;height:20px;border:4px solid white;border-radius:50%;background:#C74720;box-shadow:0 2px 9px #0005"></span>', className:'', iconSize:[20,20], iconAnchor:[10,10] });
function FollowCenter({ center, radius }: {center:Coordinates;radius:number}) { const map=useMap(); useEffect(()=>{map.setView([center.latitude,center.longitude], radius<=3?13:radius<=10?12:11);},[map,center.latitude,center.longitude,radius]); return null; }
export default function MatchesMap({ matches, position, radius, onSelect }: Props) {
  const center = position ?? (matches[0] ? {latitude:matches[0].latitude,longitude:matches[0].longitude} : null);
  if (!center) return <View style={{height:290,alignItems:'center',justifyContent:'center',backgroundColor:'#E8F1E8',borderRadius:22,padding:20}}><Text style={{fontSize:16,color:palette.ink,textAlign:'center'}}>Ainda não há partidas com localização no mapa.</Text></View>;
  return <div role="region" aria-label="Mapa interativo das partidas. Todas as partidas também estão disponíveis em uma lista acessível abaixo." style={{height:320,width:'100%',borderRadius:22,overflow:'hidden',zIndex:0}}>
    <MapContainer center={[center.latitude,center.longitude]} zoom={13} scrollWheelZoom={false} style={{height:'100%',width:'100%'}}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FollowCenter center={center} radius={radius}/>
      {position && <><Circle center={[position.latitude,position.longitude]} radius={radius*1000} pathOptions={{color:'#12675C',fillColor:'#12675C',fillOpacity:0.09,weight:2}}/><Marker position={[position.latitude,position.longitude]} icon={userIcon}><Popup>Você está aqui (aproximadamente)</Popup></Marker></>}
      {matches.map(m=><Marker key={m.id} position={[m.latitude,m.longitude]} icon={matchIcon} eventHandlers={{click:()=>onSelect(m.id)}}><Popup><strong>{m.sport}</strong><div>{m.date} · {m.time}</div><div>{m.location}</div><button type="button" onClick={()=>onSelect(m.id)} style={{minHeight:44,marginTop:6}}>Ver detalhes da partida</button></Popup></Marker>)}
    </MapContainer>
  </div>;
}
