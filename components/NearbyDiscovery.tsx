import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SportsMatch } from '../context/SportsContext';
import { palette, styles, MatchCard } from './SportsUI';
import MatchesMap from './MatchesMap';
import ExploreMatchCard from './ExploreMatchCard';
import { distanceKm, RADIUS_OPTIONS, useNearbyMatches } from '../hooks/useNearbyMatches';

export default function NearbyDiscovery({ matches, compact = false, exploreMode = false }: { matches: SportsMatch[]; compact?: boolean; exploreMode?: boolean }) {
  const {position,radius,setRadius,locating,locationError,locate,nearby,withoutCoordinates}=useNearbyMatches(matches);
  const [showList,setShowList]=useState(!compact);
  const [showMap,setShowMap]=useState(false);
  const available = position ? nearby : matches.filter(m=>m.latitude!=null && m.longitude!=null);
  const unlocated = position ? withoutCoordinates : matches.filter(m=>m.latitude==null || m.longitude==null);
  const renderCards = () => <View style={{gap:12}}>{[...available,...unlocated].length===0
    ? <Text style={styles.muted}>Nenhuma partida encontrada. Tente outra busca ou ajuste os filtros.</Text>
    : [...available,...unlocated].map(m => <ExploreMatchCard key={m.id} match={m} distance={position && typeof m.latitude === 'number' && typeof m.longitude === 'number' ? distanceKm(position,{latitude:m.latitude,longitude:m.longitude}) : undefined} />)}
  </View>;
  if (exploreMode) return <View style={{gap:14}}>
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10}}>
      <Text accessibilityRole="header" style={{fontSize:19,fontWeight:'800',color:palette.ink,flex:1}}>Partidas encontradas</Text>
      <Pressable accessibilityRole="button" accessibilityState={{expanded:showMap}} accessibilityLabel={showMap?'Ocultar mapa de partidas':'Mostrar mapa de partidas'} onPress={()=>setShowMap(v=>!v)} style={{minHeight:48,minWidth:100,paddingHorizontal:14,backgroundColor:'#EDF4EF',borderRadius:14,flexDirection:'row',gap:7,alignItems:'center',justifyContent:'center'}}>
        <Ionicons name={showMap?'list-outline':'map-outline'} size={20} color={palette.teal}/>
        <Text style={{fontSize:16,fontWeight:'700',color:palette.teal}}>{showMap?'Ver lista':'Ver mapa'}</Text>
      </Pressable>
    </View>
    {showMap && <View style={{gap:12}}>
      <Pressable accessibilityRole="button" accessibilityLabel={position?'Atualizar minha localização':'Usar minha localização para filtrar partidas'} disabled={locating} onPress={()=>void locate()} style={{minHeight:50,backgroundColor:'#E6F2EB',borderRadius:14,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:8,padding:10}}>
        <Ionicons name="locate-outline" size={21} color={palette.teal}/><Text style={{fontSize:16,fontWeight:'700',color:palette.ink}}>{locating?'Localizando…':position?'Atualizar localização':'Usar minha localização'}</Text>
      </Pressable>
      {locationError && <Text accessibilityRole="alert" style={{color:'#A32617',fontSize:16}}>{locationError}</Text>}
      <Text style={{fontSize:16,fontWeight:'700',color:palette.ink}}>Raio de distância{position?` · ${radius} km`:''}</Text>
      <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{RADIUS_OPTIONS.map(km=><Pressable key={km} accessibilityRole="button" accessibilityState={{selected:radius===km,disabled:!position}} accessibilityLabel={`Raio de ${km} quilômetros`} disabled={!position} onPress={()=>setRadius(km)} style={{minHeight:48,minWidth:56,alignItems:'center',justifyContent:'center',borderRadius:12,borderWidth:1,borderColor:radius===km?palette.teal:palette.line,backgroundColor:radius===km?palette.teal:'#FFFFFF',opacity:position?1:0.6}}><Text style={{fontSize:15,fontWeight:'700',color:radius===km?'#FFFFFF':palette.ink}}>{km} km</Text></Pressable>)}</View>
      <MatchesMap matches={available.filter((m): m is SportsMatch & {latitude:number;longitude:number}=>typeof m.latitude==='number'&&typeof m.longitude==='number')} position={position} radius={radius} onSelect={id=>router.push({pathname:'/partidas/[id]',params:{id}})}/>
      <Text style={styles.muted}>{available.length} no mapa{unlocated.length?` · ${unlocated.length} sem localização no mapa`:''}. A lista também inclui partidas sem coordenadas.</Text>
    </View>}
    {renderCards()}
  </View>;
  return <View style={{gap:13}}>
    <View style={[styles.row,{alignItems:'flex-start'}]}>
      <View style={{flex:1,gap:3}}>
        <Text style={styles.h2}>Partidas perto de você</Text>
        <Text style={styles.muted}>{position ? `Até ${radius} km da sua localização aproximada` : 'Explore o mapa ou use sua localização para filtrar por distância'}</Text>
      </View>
      <Ionicons name="map-outline" size={27} color={palette.teal}/>
    </View>
    <Pressable accessibilityRole="button" accessibilityLabel={position?'Atualizar minha localização':'Usar minha localização para encontrar partidas'} accessibilityHint="Solicita acesso à localização apenas durante o uso" disabled={locating} onPress={()=>void locate()} style={{minHeight:52,backgroundColor:'#E6F2EB',borderRadius:15,paddingHorizontal:16,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:9,borderWidth:1,borderColor:'#C5E0D0'}}>
      {locating?<ActivityIndicator color={palette.teal}/>:<Ionicons name="locate-outline" size={23} color={palette.teal}/>}
      <Text style={{fontSize:16,fontWeight:'800',color:palette.ink}}>{locating?'Localizando…':position?'Atualizar localização':'Usar minha localização'}</Text>
    </Pressable>
    {locationError&&<Text accessibilityRole="alert" style={{fontSize:16,color:'#A32617',lineHeight:24}}>{locationError}</Text>}
    <View style={{gap:7}}>
      <Text style={{fontSize:16,fontWeight:'800',color:palette.ink}}>Distância máxima</Text>
      <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{RADIUS_OPTIONS.map(km=><Pressable key={km} accessibilityRole="button" accessibilityState={{selected:radius===km,disabled:!position}} accessibilityLabel={`Raio de ${km} quilômetros`} onPress={()=>setRadius(km)} disabled={!position} style={{minWidth:54,minHeight:48,paddingHorizontal:13,borderRadius:14,borderWidth:1,borderColor:radius===km?palette.teal:palette.line,backgroundColor:radius===km?palette.teal:'#FFFFFF',alignItems:'center',justifyContent:'center',opacity:position?1:0.6}}><Text style={{fontSize:16,fontWeight:'700',color:radius===km?'#FFFFFF':palette.ink}}>{km} km</Text></Pressable>)}</View>
      {!position&&<Text style={{fontSize:14,color:palette.muted}}>Ative sua localização para aplicar o raio. Nenhuma coordenada precisa ser digitada.</Text>}
    </View>
    <MatchesMap matches={available.filter((m): m is SportsMatch & {latitude:number;longitude:number}=>typeof m.latitude==='number'&&typeof m.longitude==='number')} position={position} radius={radius} onSelect={id=>router.push({pathname:'/partidas/[id]',params:{id}})}/>
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
      <View style={{flex:1}}><Text style={{fontSize:16,fontWeight:'800',color:palette.ink}}>{available.length} {available.length===1?'partida no mapa':'partidas no mapa'}</Text><Text style={{fontSize:14,color:palette.muted}}>{unlocated.length>0?`${unlocated.length} sem coordenadas, exibidas na lista`:position?'Dentro do raio selecionado':'Ative a localização para filtrar por distância'}</Text></View>
      <Pressable accessibilityRole="button" accessibilityState={{expanded:showList}} accessibilityLabel={showList?'Ocultar lista acessível de partidas':'Mostrar lista acessível de partidas'} onPress={()=>setShowList(v=>!v)} style={{minHeight:48,paddingHorizontal:14,justifyContent:'center',backgroundColor:'#EDF4EF',borderRadius:12}}><Text style={{color:palette.teal,fontWeight:'800',fontSize:15}}>{showList?'Ocultar lista':'Ver lista'}</Text></Pressable>
    </View>
    {showList&&<View style={{gap:12}}>{[...available,...unlocated].length===0?<Text style={styles.muted}>Nenhuma partida encontrada. Experimente aumentar o raio ou mudar a modalidade.</Text>:[...available,...unlocated].map(m=><View key={m.id} style={{gap:3}}>{position&&typeof m.latitude==='number'&&typeof m.longitude==='number'&&<Text style={{fontSize:15,fontWeight:'700',color:palette.teal}}>{distanceKm(position,{latitude:m.latitude,longitude:m.longitude}).toFixed(1).replace('.',',')} km de você</Text>}<MatchCard match={m}/></View>)}</View>}
  </View>;
}
