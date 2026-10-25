import React from 'react';
import {Tabs} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
export default function TabsLayout(){return <Tabs screenOptions={{headerShown:false,tabBarActiveTintColor:'#12675C',tabBarInactiveTintColor:'#52635F',tabBarStyle:{backgroundColor:'#FFFFFF',borderTopColor:'#DFE7E2',height:72,paddingBottom:10,paddingTop:7},tabBarLabelStyle:{fontSize:13,fontWeight:'700'},tabBarItemStyle:{minHeight:48}}}>
<Tabs.Screen name="index" options={{href:null}}/>
<Tabs.Screen name="tela-inicio" options={{title:'Início',tabBarAccessibilityLabel:'Início, minhas partidas',tabBarIcon:({color,size})=><Ionicons name="home-outline" size={size} color={color}/>}}/>
<Tabs.Screen name="matches" options={{title:'Explorar',tabBarAccessibilityLabel:'Explorar partidas',tabBarIcon:({color,size})=><Ionicons name="search-outline" size={size} color={color}/>}}/>
<Tabs.Screen name="friends" options={{title:'Pessoas',tabBarAccessibilityLabel:'Pessoas e amigos',tabBarIcon:({color,size})=><Ionicons name="people-outline" size={size} color={color}/>}}/>
<Tabs.Screen name="profile" options={{title:'Perfil',tabBarAccessibilityLabel:'Meu perfil',tabBarIcon:({color,size})=><Ionicons name="person-outline" size={size} color={color}/>}}/>
</Tabs>}
