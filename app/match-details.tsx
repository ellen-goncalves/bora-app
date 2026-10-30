import React from 'react';
import {Redirect,useLocalSearchParams} from 'expo-router';
export default function LegacyDetails(){const {id}=useLocalSearchParams<{id?:string}>();return <Redirect href={{pathname:'/partidas/[id]',params:{id:id||'sample-1'}}}/>}
