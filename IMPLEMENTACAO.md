# Bora — adaptação inicial às ADRs e histórias de usuário

## Entregue no código
- Expo Router: URLs `/partidas/[id]`, compartilhamento de convites, telas de busca, criação e detalhes.
- Fluxo de participação com solicitação pendente, aprovação/rejeição pelo organizador, cancelamento e confirmação de chegada.
- Equipe, histórico de partidas encerradas, visualização dos participantes e criação simplificada.
- Interface com texto explícito, botões de pelo menos 48dp, labels acessíveis e layouts roláveis.
- Cache seletivo local de partidas criadas ou com solicitação/participação do usuário: SQLite mobile, localStorage web.
- Busca geoespacial exemplificada em `backend/` com PostgreSQL/PostGIS, raio e modalidade.

## Importante: protótipo, não produção
O projeto original só tinha estado em memória e dados de exemplo. O fluxo atualizado ainda é uma demonstração **local**: criação, aprovação e inscrição não persistem em servidor nem são visíveis a outros usuários. A API incluída implementa apenas exemplos de consultas geoespaciais e não está integrada às telas. O filtro de latitude/longitude da tela é demonstrativo e não calcula distância.

## Para executar
1. Instale as dependências já declaradas no `package.json` com `npm install`.
2. Execute `npx expo install expo-sqlite` (requer internet e escolhe versão compatível com SDK Expo).
3. Execute `npx expo start` e escolha Android, iOS ou web.
4. Para backend demonstrativo, configure PostgreSQL/PostGIS, execute `backend/schema.sql`, instale `backend/requirements.txt` e rode `uvicorn main:app` dentro de `backend/`.

## Integrações necessárias antes de produção
1. Autenticação real e autorização no servidor (organizadores aprovam/check-in apenas em suas partidas). Não confiar em `demo-me`.
2. CRUD e solicitações em API, transações para evitar lotação e duplicidade, logs de presença e histórico.
3. Buscar partidas e jogadores usando `/nearby/*` com GPS sob demanda (`expo-location`), permissão contextual e alternativa por endereço/região. Nunca publicar localização exata dos jogadores.
4. Push real com `expo-notifications` e backend para tokens, entrega, consentimento e tratamento de notificações. Solicitar permissão apenas ao criar partida ou solicitar participação.
5. Foto de perfil com `expo-image-picker`, permissão apenas ao selecionar imagem.
6. Configurar domínio real, HTTPS, Universal Links, Android App Links, metadados de compartilhamento web e páginas acessíveis sem login.
7. Testar offline real: dados vinculados, app reaberto sem rede, cache não garantido se removido pelo SO; mostrar última sincronização.
8. Testes em Android 10+, iOS 16+, tablets, VoiceOver/TalkBack, fonte ampliada, conexões lentas e cronômetro de publicação < 1 minuto.
9. Para implantação web pública, remover o domínio ilustrativo `https://exemplo.invalid` e definir `EXPO_PUBLIC_WEB_URL`.

## Observações
- Os arquivos originais foram preservados onde possível. As modalidades foram unificadas em encontros presenciais: esportes, jogos de tabuleiro e jogos de cartas. Os dados demonstrativos de amizades e mensagens não são sincronizados com o backend.
- O cache SQLite foi implementado, mas requer a instalação de `expo-sqlite`; não foi possível baixar dependências no ambiente de edição.
- Sem backend integrado, o indicador online não representa disponibilidade real do servidor e o modo offline só pode ser validado após essa integração.

## Escopo de modalidades (atualização)
- Apenas encontros presenciais: esportes, jogos de tabuleiro e jogos de cartas.
- O formulário de criação e a busca têm categorias e modalidades compartilhadas em `constants/modalities.ts`.
- Removidas as rotas legadas `online-team` e `presencial-match`; todas as partidas usam `/partidas/[id]`.
- Exemplos: Vôlei, Futebol, Xadrez, Dominó, Catan, Uno, Truco e Buraco.
- Dados antigos do cache que não pertencem ao catálogo atual são descartados ao carregar.
- A API de produção também deverá validar modalidades presenciais e migrar registros antigos.
