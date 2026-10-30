import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {router} from 'expo-router';
import {palette} from './SportsUI';
const tabs=[
  {label:'Início',icon:'home-outline',href:'/(tabs)/tela-inicio'},
  {label:'Explorar',icon:'search-outline',href:'/(tabs)/matches'},
  {label:'Pessoas',icon:'people-outline',href:'/(tabs)/friends'},
  {label:'Perfil',icon:'person-outline',href:'/(tabs)/profile'},
] as const;
export function InnerHeader({title}:{title:string}){
  return <View style={{backgroundColor:'#FFF',borderBottomWidth:1,borderColor:palette.line,minHeight:60,flexDirection:'row',alignItems:'center',paddingHorizontal:12,gap:12}}>
    <Pressable accessibilityRole="button" accessibilityLabel="Voltar para a tela anterior" onPress={()=>router.canGoBack()?router.back():router.replace('/(tabs)/tela-inicio')} style={{minHeight:48,minWidth:48,justifyContent:'center',alignItems:'center'}}><Ionicons name="arrow-back" size={25} color={palette.ink}/></Pressable>
    <Text accessibilityRole="header" style={{fontSize:20,fontWeight:'800',color:palette.ink,flex:1}}>{title}</Text>
  </View>;
}
export function InnerBottomTabs(){
  return <View accessibilityRole="tablist" style={{backgroundColor:'#FFF',borderTopWidth:1,borderColor:palette.line,flexDirection:'row',paddingTop:5,paddingBottom:10,minHeight:72}}>
    {tabs.map(tab=><Pressable key={tab.label} accessibilityRole="tab" accessibilityLabel={`Ir para ${tab.label}`} onPress={()=>router.replace(tab.href)} style={{flex:1,minHeight:52,alignItems:'center',justifyContent:'center',gap:3,paddingHorizontal:2}}><Ionicons name={tab.icon} size={23} color={palette.muted}/><Text style={{fontSize:13,fontWeight:'700',color:palette.muted}}>{tab.label}</Text></Pressable>)}
  </View>;
}
