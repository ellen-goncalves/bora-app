import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { SportsMatch } from '../context/SportsContext';
import { Coordinates } from '../hooks/useNearbyMatches';
import { palette } from './SportsUI';
type Props = { matches: (SportsMatch & Coordinates)[]; position: Coordinates | null; radius: number; onSelect: (id: string) => void };
export default function MatchesMap(props: Props) {
  const [Map, setMap] = useState<React.ComponentType<Props> | null>(null);
  useEffect(() => { let active=true; import('./MatchesMapLeaflet.web').then(mod => { if(active) setMap(() => mod.default); }); return ()=>{active=false}; }, []);
  if (!Map) return <View style={{height:320,backgroundColor:'#E8F1E8',borderRadius:22,alignItems:'center',justifyContent:'center'}}><Text style={{color:palette.ink,fontSize:16}}>Carregando mapa…</Text></View>;
  return <Map {...props}/>;
}
