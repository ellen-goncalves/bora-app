import React, {useState} from 'react';
import {Modal, Pressable, ScrollView, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {palette} from './SportsUI';

type Props = {label: string; value: string; options: readonly string[]; onChange: (value: string) => void; placeholder?: string};
export default function AccessibleDropdown({label,value,options,onChange,placeholder='Selecione uma opção'}: Props){
  const [open,setOpen]=useState(false);
  return <View style={{gap:8}}>
    <Text style={{fontSize:17,fontWeight:'800',color:palette.ink}}>{label}</Text>
    <Pressable accessibilityRole="button" accessibilityLabel={`${label}: ${value || placeholder}. Abrir opções`} accessibilityState={{expanded:open}} onPress={()=>setOpen(true)} style={{minHeight:56,borderWidth:1.5,borderColor:'#A8B9B1',backgroundColor:'#FFF',borderRadius:15,paddingHorizontal:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12}}>
      <Text style={{flex:1,fontSize:17,color:palette.ink}}>{value||placeholder}</Text><Ionicons name="chevron-down" size={22} color={palette.teal}/>
    </Pressable>
    <Modal visible={open} animationType="slide" transparent onRequestClose={()=>setOpen(false)} accessibilityViewIsModal>
      <View style={{flex:1,justifyContent:'flex-end',backgroundColor:'rgba(0,0,0,0.45)'}}>
        <View style={{backgroundColor:'#FFF',borderTopLeftRadius:24,borderTopRightRadius:24,maxHeight:'82%',paddingTop:20,paddingHorizontal:18,paddingBottom:24}}>
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:14,gap:10}}>
            <Text accessibilityRole="header" style={{flex:1,fontSize:22,fontWeight:'800',color:palette.ink}}>{label}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Fechar opções" onPress={()=>setOpen(false)} style={{minHeight:48,minWidth:48,justifyContent:'center',alignItems:'center'}}><Ionicons name="close" size={26} color={palette.ink}/></Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingBottom:20}}>
            {options.map(option=><Pressable key={option} accessibilityRole="button" accessibilityLabel={option} accessibilityState={{selected:option===value}} onPress={()=>{onChange(option);setOpen(false)}} style={{minHeight:52,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:12,paddingHorizontal:12,borderBottomWidth:1,borderColor:palette.line,backgroundColor:option===value?'#EDF4EF':'#FFF',borderRadius:8}}><Text style={{fontSize:17,color:palette.ink,flex:1}}>{option}</Text>{option===value&&<Ionicons name="checkmark-circle" size={23} color={palette.teal}/>}</Pressable>)}
          </ScrollView>
        </View>
      </View>
    </Modal>
  </View>;
}
