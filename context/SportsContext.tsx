import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { loadMatches, saveMatches } from '../services/matchStorage';
import {ALL_MODALITIES} from '../constants/modalities';

export type Status = 'pending' | 'accepted' | 'rejected' | 'cancelled';
export type Request = { id: string; userId: string; name: string; sport: string; bio: string; status: Status; arrived?: boolean };
export type SportsMatch = { id: string; title: string; sport: string; date: string; time: string; location: string; latitude?: number; longitude?: number; capacity: number; organizerId: string; organizer: string; requests: Request[]; createdAt: string; status: 'open' | 'closed' | 'completed' };
type SportsState = { matches: SportsMatch[]; hydrated: boolean; connected: boolean; lastSync?: string; notice: string | null; clearNotice: () => void; create: (data: Pick<SportsMatch,'sport'|'date'|'time'|'location'|'capacity'|'latitude'|'longitude'>) => string | null; requestJoin: (id:string)=>void; cancel: (id:string)=>void; decide: (matchId:string,requestId:string,accept:boolean)=>void; checkIn: (matchId:string,requestId:string)=>void; complete: (id:string)=>void; refresh:()=>Promise<void> };
const Context = createContext<SportsState | null>(null);
const ME = 'demo-me';
const seed: SportsMatch[] = [
  { id:'sample-1', title:'Vôlei na praça', sport:'Vôlei', date:'2026-11-01', time:'08:00', location:'Praça do Centenário, Maceió', latitude:-9.663, longitude:-35.735, capacity:8, organizerId:'organizer-1',organizer:'Marta',requests:[{id:'r1',userId:'u1',name:'Ana',sport:'Vôlei',bio:'Jogo aos fins de semana',status:'accepted'},{id:'r2',userId:'u2',name:'Carlos',sport:'Vôlei',bio:'Iniciante',status:'accepted'}],createdAt:'2026-10-25T12:00:00Z',status:'open'},
  { id:'sample-2', title:'Futebol de sábado', sport:'Futebol', date:'2026-11-07', time:'16:00', location:'Quadra do bairro',capacity:10,organizerId:ME,organizer:'Você',requests:[{id:'r3',userId:'u3',name:'José',sport:'Futebol',bio:'Jogo toda semana',status:'pending'},{id:'r4',userId:'u4',name:'Paulo',sport:'Futebol',bio:'Goleiro',status:'accepted'}],createdAt:'2026-10-25T12:00:00Z',status:'open'},
  {id:'sample-3',title:'Xadrez na biblioteca',sport:'Xadrez',date:'2026-11-08',time:'14:00',location:'Biblioteca do bairro',capacity:4,organizerId:'organizer-3',organizer:'Clara',requests:[],createdAt:'2026-10-25T12:00:00Z',status:'open'},
  {id:'sample-4',title:'Mesa de Uno',sport:'Uno',date:'2026-11-09',time:'19:00',location:'Centro comunitário',capacity:6,organizerId:'organizer-4',organizer:'Pedro',requests:[],createdAt:'2026-10-25T12:00:00Z',status:'open'}
];
const count=(m:SportsMatch)=>m.requests.filter(r=>r.status==='accepted').length+1;
export const currentUserId=ME;
export const acceptedCount=count;
export function SportsProvider({children}:{children:React.ReactNode}){
 const [matches,setMatches]=useState<SportsMatch[]>(seed);const [hydrated,setHydrated]=useState(false);const [connected,setConnected]=useState(true);const [notice,setNotice]=useState<string|null>(null);const [lastSync,setLastSync]=useState<string|undefined>();
 useEffect(()=>{let active=true;loadMatches().then(v=>{if(active){if(v)setMatches(v.filter(m=>ALL_MODALITIES.includes(m.sport)));setHydrated(true);}});return()=>{active=false}},[]);
 useEffect(()=>{if(hydrated)void saveMatches(matches)},[matches,hydrated]);
 const refresh=useCallback(async()=>{const url=process.env.EXPO_PUBLIC_API_URL;if(!url){setConnected(true);return;}try{const r=await fetch(`${url}/matches`,{signal:AbortSignal.timeout(8000)});if(!r.ok)throw new Error('offline');const data=await r.json();if(Array.isArray(data)){setMatches(data);setLastSync(new Date().toISOString());setConnected(true);}}catch{setConnected(false);setNotice('Sem conexão: exibindo partidas salvas. Alterações exigem internet.')}},[]);
 useEffect(()=>{if(hydrated)void refresh()},[hydrated,refresh]);
 const mutate=(f:(all:SportsMatch[])=>SportsMatch[])=>setMatches(prev=>f(prev));
 const create:SportsState['create']=(data)=>{if(!connected){setNotice('Conecte-se para publicar a partida.');return null;}const id=`local-${Date.now()}`;mutate(a=>[{...data,id,title:`${data.sport} — ${data.location}`,organizerId:ME,organizer:'Você',requests:[],status:'open',createdAt:new Date().toISOString()},...a]);setNotice('Partida criada neste protótipo. Para publicar a outros usuários, conecte a API.');return id;};
 const requestJoin=(id:string)=>{if(!connected){setNotice('É necessário estar online para solicitar participação.');return;}mutate(all=>all.map(m=>m.id===id&&!m.requests.some(r=>r.userId===ME)&&m.status==='open'?{...m,requests:[...m.requests,{id:`req-${Date.now()}`,userId:ME,name:'Você',sport:m.sport,bio:'Jogador interessado',status:'pending'}]}:m));setNotice('Solicitação registrada no protótipo; aguarda aprovação.');};
 const cancel=(id:string)=>{if(!connected){setNotice('É necessário estar online para cancelar.');return;}mutate(all=>all.map(m=>m.id===id?{...m,requests:m.requests.map(r=>r.userId===ME?{...r,status:'cancelled'}:r)}:m));};
 const decide=(id:string,rid:string,accept:boolean)=>{if(!connected){setNotice('É necessário estar online para responder.');return;}mutate(all=>all.map(m=>{if(m.id!==id||m.organizerId!==ME)return m;const canAccept=count(m)<m.capacity;return {...m,requests:m.requests.map(r=>r.id===rid&&r.status==='pending'?{...r,status:accept&&canAccept?'accepted':'rejected'}:r)};}));};
 const checkIn=(id:string,rid:string)=>{if(!connected){setNotice('É necessário estar online para registrar presença.');return;}mutate(all=>all.map(m=>m.id===id&&m.organizerId===ME?{...m,requests:m.requests.map(r=>r.id===rid&&r.status==='accepted'?{...r,arrived:!r.arrived}:r)}:m));};
 const complete=(id:string)=>mutate(all=>all.map(m=>m.id===id&&m.organizerId===ME?{...m,status:'completed'}:m));
 return <Context.Provider value={{matches,hydrated,connected,lastSync,notice,clearNotice:()=>setNotice(null),create,requestJoin,cancel,decide,checkIn,complete,refresh}}>{children}</Context.Provider>
}
export function useSports(){const c=useContext(Context);if(!c)throw new Error('SportsProvider ausente');return c;}
