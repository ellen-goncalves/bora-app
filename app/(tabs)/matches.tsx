import React, {useMemo, useState} from 'react';
import {SafeAreaView, ScrollView, Text, TextInput, View, Pressable, Modal} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {router} from 'expo-router';
import {useSports} from '../../context/SportsContext';
import {useApp} from '../../context/AppContext';
import {MODALITY_CATEGORIES, ModalityCategory, categoryForModality} from '../../constants/modalities';
import {Action, Loading, NetworkNotice, styles, palette} from '../../components/SportsUI';
import NearbyDiscovery from '../../components/NearbyDiscovery';
import AccessibleDropdown from '../../components/AccessibleDropdown';

type CategoryFilter = 'Todas' | ModalityCategory;

export default function MatchesScreen() {
  const {matches, hydrated, connected, refresh} = useSports();
  const {userProfile} = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('Todas');
  const [modality, setModality] = useState('Todas');
  const [quickModality, setQuickModality] = useState('Todos');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Somente modalidades explicitamente registradas em perfis disponíveis.
  // No protótipo, o AppContext disponibiliza apenas o perfil local. A API deverá
  // fornecer os interesses públicos dos demais perfis, sem inventar preferências.
  const profileModalities = useMemo(() =>
    [...new Set((userProfile.modalities ?? []).filter(m =>
      Object.values(MODALITY_CATEGORIES).some(items => (items as readonly string[]).includes(m))
    ))].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [userProfile.modalities]
  );

  const visible = useMemo(() => connected ? matches.filter(m =>
    m.status === 'open' &&
    (quickModality === 'Todos' || m.sport === quickModality) &&
    (category === 'Todas' || categoryForModality(m.sport) === category) &&
    (modality === 'Todas' || m.sport === modality) &&
    `${m.title} ${m.sport} ${m.location}`.toLocaleLowerCase('pt-BR').includes(query.trim().toLocaleLowerCase('pt-BR'))
  ) : [], [matches, connected, quickModality, category, modality, query]);

  const options = ['Todas', ...(category === 'Todas'
    ? Object.values(MODALITY_CATEGORIES).flatMap(items => [...items])
    : [...MODALITY_CATEGORIES[category]])];
  const activeFilters = Number(category !== 'Todas') + Number(modality !== 'Todas');

  const chip = (label: string) => {
    const selected = quickModality === label;
    return <Pressable key={label} accessibilityRole="button"
      accessibilityLabel={`Filtrar por ${label === 'Todos' ? 'todas as modalidades' : label}`}
      accessibilityState={{selected}}
      onPress={() => setQuickModality(label)}
      style={{minHeight:48, paddingHorizontal:16, paddingVertical:10, borderRadius:24,
        justifyContent:'center', backgroundColor:selected ? palette.teal : '#FFFFFF',
        borderWidth:1, borderColor:selected ? palette.teal : palette.line}}>
      <Text style={{fontSize:16, fontWeight:'700', color:selected ? '#FFFFFF' : palette.ink}}>{label}</Text>
    </Pressable>;
  };

  return <SafeAreaView style={styles.page}>
    <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
      <View style={{gap:5, paddingTop:10}}>
        <Text accessibilityRole="header" style={styles.h1}>Explorar partidas</Text>
        <Text style={styles.muted}>Encontre uma atividade e uma turma perto de você.</Text>
      </View>
      <NetworkNotice/>
      <View style={{flexDirection:'row', alignItems:'center', backgroundColor:'#FFFFFF', borderWidth:1.5,
        borderColor:'#A8B9B1', borderRadius:16, paddingHorizontal:14, minHeight:58, gap:10}}>
        <Ionicons name="search" size={23} color={palette.teal}/>
        <TextInput accessibilityLabel="Buscar partidas por nome, modalidade ou local"
          placeholder="Buscar jogo, modalidade ou local" placeholderTextColor="#65746E"
          style={{flex:1, fontSize:17, color:palette.ink, minHeight:52}}
          value={query} onChangeText={setQuery} returnKeyType="search"/>
      </View>
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', gap:10}}>
        <Text style={{fontSize:16, fontWeight:'700', color:palette.ink, flex:1}}>Modalidades dos perfis</Text>
        <Pressable accessibilityRole="button"
          accessibilityLabel={`Abrir filtros${activeFilters ? `, ${activeFilters} ativos` : ''}`}
          onPress={() => setFiltersOpen(true)}
          style={{minHeight:48, minWidth:48, flexDirection:'row', alignItems:'center', gap:7,
            paddingHorizontal:14, borderWidth:1, borderColor:palette.line, borderRadius:14, backgroundColor:'#FFFFFF'}}>
          <Ionicons name="options-outline" size={21} color={palette.teal}/>
          <Text style={{fontSize:16, fontWeight:'700', color:palette.ink}}>Filtros{activeFilters ? ` (${activeFilters})` : ''}</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        accessibilityLabel="Filtros rápidos de modalidades dos perfis"
        contentContainerStyle={{gap:8, paddingVertical:3}}>
        {['Todos', ...profileModalities].map(chip)}
      </ScrollView>
      {profileModalities.length === 0 && <Text style={styles.muted}>
        Nenhuma modalidade cadastrada nos perfis disponíveis. Você pode explorar todas ou usar os filtros.
      </Text>}
      <View style={styles.row}>
        <Text style={styles.muted}>{connected ? `${visible.length} ${visible.length === 1 ? 'partida disponível' : 'partidas disponíveis'}` : 'Busca indisponível'}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Atualizar partidas"
          onPress={() => void refresh()}
          style={{minHeight:48, minWidth:48, justifyContent:'center', alignItems:'center'}}>
          <Ionicons name="refresh" size={24} color={palette.teal}/>
        </Pressable>
      </View>
      {!hydrated ? <Loading/> : connected ? <NearbyDiscovery matches={visible} exploreMode/> :
        <View style={styles.card}><Text style={styles.text}>Conecte-se para descobrir novas partidas. Suas partidas salvas continuam na página inicial.</Text></View>}
      <Action label="Criar meu convite" onPress={() => router.push('/create-match')} disabled={!connected}/>
    </ScrollView>

    <Modal visible={filtersOpen} transparent animationType="slide" onRequestClose={() => setFiltersOpen(false)} accessibilityViewIsModal>
      <View style={{flex:1, justifyContent:'flex-end', backgroundColor:'rgba(0,0,0,0.45)'}}>
        <View style={{backgroundColor:'#F7F8F5', borderTopLeftRadius:24, borderTopRightRadius:24,
          paddingHorizontal:18, paddingTop:18, paddingBottom:22, maxHeight:'88%', gap:14}}>
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <Text accessibilityRole="header" style={{fontSize:24, fontWeight:'800', color:palette.ink}}>Filtros</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Fechar filtros" onPress={() => setFiltersOpen(false)}
              style={{minWidth:48, minHeight:48, alignItems:'center', justifyContent:'center'}}>
              <Ionicons name="close" size={27} color={palette.ink}/>
            </Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{gap:16, paddingBottom:10}}>
            <AccessibleDropdown label="Categoria" value={category} options={['Todas', ...Object.keys(MODALITY_CATEGORIES)]}
              onChange={value => {setCategory(value as CategoryFilter); setModality('Todas');}}/>
            <AccessibleDropdown label="Modalidade" value={modality} options={options} onChange={setModality}/>
            <Pressable accessibilityRole="button" accessibilityLabel="Limpar filtros de categoria e modalidade"
              onPress={() => {setCategory('Todas'); setModality('Todas'); setQuickModality('Todos');}}
              style={{minHeight:48, justifyContent:'center', alignItems:'center'}}>
              <Text style={{fontSize:16, color:palette.teal, fontWeight:'700'}}>Limpar filtros</Text>
            </Pressable>
          </ScrollView>
          <Action label="Mostrar partidas" onPress={() => setFiltersOpen(false)}/>
        </View>
      </View>
    </Modal>
  </SafeAreaView>;
}
