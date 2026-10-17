import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '../context/AppContext';

export default function CreateMatchScreen() {
  const { addMatch } = useApp();

  const [isOnline, setIsOnline] = useState(true);
  const [game, setGame] = useState('VALORANT');
  const [selectedGameModes, setSelectedGameModes] = useState<string[]>(['Competitivo']);
  const [matchName, setMatchName] = useState('Bora fechar o squad?');
  const [date, setDate] = useState('9 out. 2026');
  const [time, setTime] = useState('21:00');
  const [platform, setPlatform] = useState('PC · servidor BR');
  const [participantsCount, setParticipantsCount] = useState(5);

  // Listas correspondentes para cada modalidade
  const onlineGames = ['VALORANT', 'League of Legends', 'Counter-Strike 2', 'EA FC'];
  const presencialSports = ['Vôlei', 'Futebol', 'Basquete', 'Beach Tennis', 'Tênis'];

  const onlinePlatforms = ['PC · servidor BR', 'Console · PS5/Xbox', 'Crossplay'];
  const presencialLocations = ['Quadras do Ibirapuera', 'Arena Esportiva SP', 'Ginásio Municipal', 'Parque Villa-Lobos'];

  // Opções de modos de jogo disponíveis para cada tipo
  const onlineModesOptions = ['Competitivo', 'Casual', 'Treino', 'Ranqueado'];
  const presencialModesOptions = ['Recreativo', 'Misto', 'Competitivo', 'Amistoso', 'Iniciante'];

  const currentModesOptions = isOnline ? onlineModesOptions : presencialModesOptions;

  const handleToggleMode = (online: boolean) => {
    setIsOnline(online);
    if (online) {
      setGame('VALORANT');
      setSelectedGameModes(['Competitivo']);
      setPlatform('PC · servidor BR');
      setMatchName('Bora fechar o squad?');
    } else {
      setGame('Vôlei');
      setSelectedGameModes(['Recreativo', 'Misto']);
      setPlatform('Quadras do Ibirapuera');
      setMatchName('Vôlei de quadra animado');
    }
  };

  const handleCycleGame = () => {
    const list = isOnline ? onlineGames : presencialSports;
    const currentIndex = list.indexOf(game);
    const nextIndex = (currentIndex + 1) % list.length;
    setGame(list[nextIndex]);
  };

  const handleCyclePlatform = () => {
    const list = isOnline ? onlinePlatforms : presencialLocations;
    const currentIndex = list.indexOf(platform);
    const nextIndex = (currentIndex + 1) % list.length;
    setPlatform(list[nextIndex]);
  };

  const handleToggleGameMode = (mode: string) => {
    if (selectedGameModes.includes(mode)) {
      // Evita desmarcar se for o único selecionado
      if (selectedGameModes.length > 1) {
        setSelectedGameModes(selectedGameModes.filter((m) => m !== mode));
      } else {
        Alert.alert('Atenção', 'Selecione pelo menos um modo de jogo.');
      }
    } else {
      setSelectedGameModes([...selectedGameModes, mode]);
    }
  };

  const handleCreateMatch = () => {
    if (!matchName.trim()) {
      Alert.alert('Erro', 'Por favor, informe o nome da partida.');
      return;
    }

    const modesString = selectedGameModes.join(' · ');

    addMatch({
      title: matchName,
      category: `${game} · ${modesString}`,
      type: isOnline ? 'Online' : 'Presencial',
      date: `Hoje, ${date} · ${time}`,
      locationOrPlatform: platform,
      vacancies: participantsCount - 1,
      totalSpots: participantsCount,
      participants: ['Lucas (Criador)'],
    });

    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* Barra Superior / Navegação */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Criar partida</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.subtitle}>Você organiza. A galera entra. Bora jogar!</Text>

        {/* Seletor de Tipo (Online / Presencial) */}
        <View style={styles.typeSelectorRow}>
          <TouchableOpacity
            style={[styles.typeOption, isOnline && styles.typeOptionActive]}
            onPress={() => handleToggleMode(true)}
          >
            <Ionicons
              name="game-controller-outline"
              size={18}
              color={isOnline ? '#F04E23' : '#6B7280'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.typeOptionText, isOnline && styles.typeOptionTextActive]}>
              Online
            </Text>
            {isOnline && <Ionicons name="checkmark" size={14} color="#F04E23" style={{ marginLeft: 6 }} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeOption, !isOnline && styles.typeOptionActive]}
            onPress={() => handleToggleMode(false)}
          >
            <MaterialCommunityIcons
              name="volleyball"
              size={18}
              color={!isOnline ? '#F04E23' : '#6B7280'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.typeOptionText, !isOnline && styles.typeOptionTextActive]}>
              Presencial
            </Text>
            {!isOnline && <Ionicons name="checkmark" size={14} color="#F04E23" style={{ marginLeft: 6 }} />}
          </TouchableOpacity>
        </View>

        {/* Jogo ou Esporte */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>{isOnline ? 'Jogo' : 'Esporte'}</Text>
          <TouchableOpacity style={styles.dropdownInput} onPress={handleCycleGame}>
            <Text style={styles.dropdownValue}>{game}</Text>
            <FontAwesome name="refresh" size={10} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Múltiplos Modos de Jogo (Seleção com Chips) */}
        <Text style={styles.inputLabel}>Modos de jogo (selecione um ou mais)</Text>
        <View style={styles.modesContainer}>
          {currentModesOptions.map((mode) => {
            const isSelected = selectedGameModes.includes(mode);
            return (
              <TouchableOpacity
                key={mode}
                style={[styles.modeChip, isSelected && styles.modeChipActive]}
                onPress={() => handleToggleGameMode(mode)}
              >
                <Text style={[styles.modeChipText, isSelected && styles.modeChipTextActive]}>
                  {mode}
                </Text>
                {isSelected && <Ionicons name="checkmark" size={12} color="#F04E23" style={{ marginLeft: 4 }} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Nome da Partida */}
        <Text style={styles.inputLabel}>Nome da partida</Text>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInputField}
            value={matchName}
            onChangeText={setMatchName}
            placeholderTextColor="#A0A0A0"
          />
        </View>

        {/* Data e Horário */}
        <View style={styles.rowInputs}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.inputLabel}>Data</Text>
            <TouchableOpacity style={styles.dropdownInput}>
              <Ionicons name="calendar-outline" size={14} color="#6B7280" style={{ marginRight: 6 }} />
              <Text style={styles.dropdownValue}>{date}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.inputLabel}>Horário</Text>
            <TouchableOpacity style={styles.dropdownInput}>
              <Ionicons name="time-outline" size={14} color="#6B7280" style={{ marginRight: 6 }} />
              <Text style={styles.dropdownValue}>{time}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Plataforma ou Localização */}
        <Text style={styles.inputLabel}>{isOnline ? 'Plataforma' : 'Localização'}</Text>
        <TouchableOpacity style={styles.dropdownInput} onPress={handleCyclePlatform}>
          <Ionicons
            name={isOnline ? 'desktop-outline' : 'location-outline'}
            size={14}
            color="#6B7280"
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.dropdownValue, { flex: 1 }]}>{platform}</Text>
          <FontAwesome name="refresh" size={10} color="#6B7280" />
        </TouchableOpacity>

        {/* Participantes no seu time */}
        <Text style={styles.inputLabel}>Participantes no seu time</Text>
        <View style={styles.counterBox}>
          <View style={styles.counterLeft}>
            <Ionicons name="people-outline" size={16} color="#6B7280" style={{ marginRight: 8 }} />
            <Text style={styles.counterSubText}>Incluindo você · grupo de {participantsCount}</Text>
          </View>
          <View style={styles.counterControls}>
            <TouchableOpacity
              style={styles.counterBtn}
              onPress={() => setParticipantsCount(Math.max(2, participantsCount - 1))}
            >
              <Feather name="minus" size={14} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.counterNumber}>{participantsCount}</Text>
            <TouchableOpacity
              style={[styles.counterBtn, styles.counterBtnPlus]}
              onPress={() => setParticipantsCount(participantsCount + 1)}
            >
              <Feather name="plus" size={14} color="#F04E23" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quem pode participar? */}
        <Text style={styles.inputLabel}>Quem pode participar?</Text>
        <TouchableOpacity style={styles.privacyBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Ionicons name="globe-outline" size={16} color="#6B7280" style={{ marginRight: 8 }} />
            <View>
              <Text style={styles.privacyTitle}>Pública</Text>
              <Text style={styles.privacySub}>Aparece em Explorar. Qualquer pessoa entra.</Text>
            </View>
          </View>
          <FontAwesome name="chevron-down" size={10} color="#6B7280" />
        </TouchableOpacity>

        {/* Convidar amigos */}
        <View style={styles.inviteHeaderRow}>
          <Text style={styles.inputLabel}>Convidar amigos</Text>
          <Text style={styles.selectedCountText}>3 selecionados</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.friendsScroll}>
          {['Rafa', 'Bia', 'Pedro'].map((friend, index) => (
            <View key={index} style={styles.friendChip}>
              <View style={styles.friendMiniAvatar}>
                <FontAwesome name="user" size={12} color="#555" />
              </View>
              <Text style={styles.friendChipName}>{friend}</Text>
              <Ionicons name="checkmark" size={14} color="#F04E23" style={{ marginLeft: 6 }} />
            </View>
          ))}
        </ScrollView>
        <Text style={styles.helperInviteText}>Os convites serão enviados ao criar a partida.</Text>

        {/* Botão Criar Partida Principal */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreateMatch}>
          <Ionicons name="calendar-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.createButtonText}>Criar partida</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  iconButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  navTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  subtitle: { fontSize: 12, color: '#888', marginBottom: 16 },
  typeSelectorRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  typeOption: { flex: 0.48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 12, borderRadius: 14 },
  typeOptionActive: { backgroundColor: '#FFF0ED', borderColor: '#F04E23' },
  typeOptionText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  typeOptionTextActive: { color: '#F04E23' },
  rowInputs: { flexDirection: 'row', marginBottom: 12 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#374151', marginBottom: 6 },
  dropdownInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, height: 46, marginBottom: 12 },
  dropdownValue: { fontSize: 13, fontWeight: '600', color: '#1A1A1A' },
  modesContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  modeChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, marginRight: 8, marginBottom: 8 },
  modeChipActive: { backgroundColor: '#FFF0ED', borderColor: '#F04E23' },
  modeChipText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  modeChipTextActive: { color: '#F04E23', fontWeight: 'bold' },
  textInputContainer: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, height: 46, justifyContent: 'center', marginBottom: 12 },
  textInputField: { fontSize: 13, fontWeight: '600', color: '#1A1A1A' },
  counterBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, height: 50, marginBottom: 12 },
  counterLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  counterSubText: { fontSize: 12, color: '#6B7280' },
  counterControls: { flexDirection: 'row', alignItems: 'center' },
  counterBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  counterBtnPlus: { backgroundColor: '#FFF0ED' },
  counterNumber: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A', marginHorizontal: 12 },
  privacyBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, marginBottom: 16 },
  privacyTitle: { fontSize: 13, fontWeight: 'bold', color: '#1A1A1A' },
  privacySub: { fontSize: 11, color: '#888', marginTop: 1 },
  inviteHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 },
  selectedCountText: { fontSize: 11, color: '#888' },
  friendsScroll: { flexDirection: 'row', marginBottom: 6 },
  friendChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, marginRight: 8 },
  friendMiniAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginRight: 6 },
  friendChipName: { fontSize: 12, fontWeight: 'bold', color: '#1A1A1A' },
  helperInviteText: { fontSize: 10, color: '#888', marginBottom: 20 },
  createButton: { backgroundColor: '#F04E23', flexDirection: 'row', height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#F04E23', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  createButtonText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
});