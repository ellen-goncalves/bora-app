import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Match {
  id: string;
  title: string;
  category: string;
  type: 'Online' | 'Presencial';
  date: string;
  locationOrPlatform: string;
  vacancies: number;
  totalSpots: number;
  participants: string[];
}

export interface Friend {
  id: string;
  name: string;
  status: string;
  isOnline: boolean;
  gameDesc: string;
  avatarUrl: string;
}

export interface UserProfile {
  name: string;
  username: string;
  location: string;
  bio: string;
  playedCount: number;
  organizedCount: number;
  scheduledCount: number;
  avatarUrl: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  read: boolean;
  type: 'invite' | 'friend_request' | 'system';
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'other';
  text: string;
  time: string;
}

interface PendingRequest {
  id: string;
  name: string;
  info: string;
  time: string;
  avatarUrl: string;
}

interface AppContextData {
  matches: Match[];
  userProfile: UserProfile;
  friends: Friend[];
  notifications: NotificationItem[];
  pendingRequests: PendingRequest[];
  acceptedInviteIds: string[];
  chatMessages: Record<string, ChatMessage[]>;
  addMatch: (newMatch: Omit<Match, 'id'>) => void;
  joinMatch: (matchId: string) => void;
  acceptFriendRequest: (requestId: string, friendName: string, avatarUrl: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  markAllNotificationsAsRead: () => void;
  confirmMatchInvite: (inviteId: string, matchId: string) => void;
  updateUserProfile: (updated: Partial<UserProfile>) => void;
  sendMessageToFriend: (friendId: string, text: string) => void;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Lucas',
    username: '@lucasjoga',
    location: 'Vila Mariana, São Paulo',
    bio: 'Do competitivo à quadra, o melhor é jogar junto.',
    playedCount: 24,
    organizedCount: 8,
    scheduledCount: 2,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
  });

  const [matches, setMatches] = useState<Match[]>([
    {
      id: '1',
      title: 'Bora fechar o squad?',
      category: 'VALORANT · Competitivo',
      type: 'Online',
      date: 'Hoje, 9 out. · 21h',
      locationOrPlatform: 'PC · servidor BR',
      vacancies: 2,
      totalSpots: 5,
      participants: ['Lucas', 'Rafa', 'Bia'],
    },
    {
      id: '2',
      title: 'Vôlei no Ibirapuera',
      category: 'Vôlei · Recreativo · Misto',
      type: 'Presencial',
      date: 'Amanhã, 10 out. · 10h às 11h',
      locationOrPlatform: 'Quadras do Ibirapuera · 1,2 km',
      vacancies: 2,
      totalSpots: 6,
      participants: ['Bia', 'Rafa', 'Pedro', 'Lu'],
    },
  ]);

  const [friends, setFriends] = useState<Friend[]>([
    {
      id: 'bia',
      name: 'Bia',
      status: 'Online agora',
      isOnline: true,
      gameDesc: 'Vôlei · Bora pra quadra?',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      id: 'rafa',
      name: 'Rafa',
      status: 'Jogando VALORANT',
      isOnline: true,
      gameDesc: 'PC · servidor BR',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      id: 'pedro',
      name: 'Pedro',
      status: 'Visto há 20 min',
      isOnline: false,
      gameDesc: 'EA FC · PS5',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', title: 'Bia te convidou pra jogar', description: 'Vôlei no Ibirapuera · amanhã, 10h às 11h. Ainda tem 2 vagas!', timeAgo: 'há 5 min', read: false, type: 'invite' },
  ]);

  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([
    {
      id: 'req_ana',
      name: 'Ana',
      info: 'Amiga da Bia · Vôlei',
      time: 'há 15 min',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    },
  ]);

  const [acceptedInviteIds, setAcceptedInviteIds] = useState<string[]>([]);

  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({
    bia: [
      { id: '1', sender: 'other', text: 'E aí Lucas! Bora pra quadra amanhã?', time: '10:30' },
      { id: '2', sender: 'me', text: 'Com certeza! Que horas mesmo?', time: '10:32' },
    ],
    rafa: [
      { id: '1', sender: 'other', text: 'Bora fechar o squad no Valo hoje 21h?', time: '18:10' },
    ],
    pedro: [
      { id: '1', sender: 'other', text: 'Fechou a partida de EA FC no fds?', time: 'Ontem' },
    ],
  });

  const addMatch = (newMatchData: Omit<Match, 'id'>) => {
    const newMatch: Match = { ...newMatchData, id: String(Date.now()) };
    setMatches((prev) => [newMatch, ...prev]);
    setUserProfile((prev) => ({ ...prev, organizedCount: prev.organizedCount + 1 }));
  };

  const joinMatch = (matchId: string) => {
    setMatches((prevMatches) =>
      prevMatches.map((m) => {
        if (m.id === matchId && m.vacancies > 0) {
          return {
            ...m,
            vacancies: m.vacancies - 1,
            participants: [...m.participants, `${userProfile.name} (Você)`],
          };
        }
        return m;
      })
    );
  };

  const acceptFriendRequest = (requestId: string, friendName: string, avatarUrl: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
    const newFriendId = friendName.toLowerCase();
    setFriends((prev) => {
      if (prev.some((f) => f.id === newFriendId)) return prev;
      return [
        ...prev,
        {
          id: newFriendId,
          name: friendName,
          status: 'Online agora',
          isOnline: true,
          gameDesc: 'Novo amigo no Bora',
          avatarUrl,
        },
      ];
    });
  };

  const rejectFriendRequest = (requestId: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const confirmMatchInvite = (inviteId: string, matchId: string) => {
    if (acceptedInviteIds.includes(inviteId)) return;
    setAcceptedInviteIds((prev) => [...prev, inviteId]);
    joinMatch(matchId);
  };

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  const sendMessageToFriend = (friendId: string, text: string) => {
    if (!text.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = { id: String(Date.now()), sender: 'me', text, time };

    setChatMessages((prev) => ({
      ...prev,
      [friendId]: [...(prev[friendId] || []), userMsg],
    }));

    setTimeout(() => {
      const iaResponses: Record<string, string[]> = {
        bia: ['Boa! Já confirmei minha presença no Vôlei!', 'Partiu! Vou levar as bolas de vôlei.'],
        rafa: ['Bora de VALORANT! Já estou logado no PC.', 'Boa jogada!'],
        pedro: ['Golaço! Bora mandar uma partida no PS5.', 'Hoje à noite estou livre!'],
      };
      const options = iaResponses[friendId] || ['Fechado! Tmj no Bora!'];
      const randomReply = options[Math.floor(Math.random() * options.length)];

      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'other',
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => ({
        ...prev,
        [friendId]: [...(prev[friendId] || []), aiMsg],
      }));
    }, 1200);
  };

  return (
    <AppContext.Provider
      value={{
        matches,
        userProfile,
        friends,
        notifications,
        pendingRequests,
        acceptedInviteIds,
        chatMessages,
        addMatch,
        joinMatch,
        acceptFriendRequest,
        rejectFriendRequest,
        markAllNotificationsAsRead,
        confirmMatchInvite,
        updateUserProfile,
        sendMessageToFriend,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);