/*
 * Discografia do Ministério Nova Página.
 * Para publicar um novo lançamento, adicione um item a este array — a seção inteira é gerada a partir dele.
 *
 * Campos:
 *   id          identificador único (sem espaços)
 *   titulo      nome da faixa / EP / álbum
 *   tipo        "Single" | "EP" | "Álbum"
 *   ano         ano de lançamento (texto)
 *   data        data de lançamento no formato AAAA-MM-DD (ordena a lista; o mais recente vira o destaque)
 *   capa        caminho da imagem da capa (quadrada)
 *   spotifyId   ID da faixa no Spotify (o trecho depois de /track/ no link) ou null.
 *               Sem ID, o card de prévia não aparece no destaque.
 *   spotifyTipo "track" ou "album" (usado no player de prévia)
 *   links       { spotify, appleMusic, deezer, youtubeMusic, amazonMusic }
 *   letra       texto da letra (use \n para quebras de linha)
 *   emBreve     true para um lançamento futuro (vira o card "Em breve" com pré-save)
 *   preSaveUrl  link de pré-save (apenas para emBreve: true)
 *
 * Valores entre colchetes, como "[LINK]", são placeholders e aparecem como "link pendente" no site.
 */
window.NP_ARTISTA = {
  nome: 'Ministério Nova Página',
  spotify: '[LINK DO ARTISTA SPOTIFY]',
  links: {
    appleMusic: '[LINK]',
    deezer: '[LINK]',
    youtubeMusic: '[LINK]',
    amazonMusic: '[LINK]'
  }
};

window.NP_RELEASES = [
  {
    id: 'eu-vou-falar',
    titulo: 'Eu Vou Falar',
    tipo: 'Single',
    ano: '2025',
    data: '2025-10-27',
    capa: 'assets/foto-grupo-sobre.png',
    spotifyId: '3HHK51ifdDZfyP1UpQcaoO',
    spotifyTipo: 'track',
    links: { spotify: 'https://open.spotify.com/track/3HHK51ifdDZfyP1UpQcaoO', appleMusic: '[LINK]', deezer: '[LINK]', youtubeMusic: '[LINK]', amazonMusic: '[LINK]' },
    letra: '[LETRA]',
    emBreve: false,
    preSaveUrl: ''
  },
  {
    id: 'evangelho',
    titulo: 'Evangelho',
    tipo: 'Single',
    ano: '2025',
    data: '2025-12-17',
    capa: 'assets/capa-evangelho.png',
    spotifyId: null,
    spotifyTipo: 'track',
    links: { spotify: '[LINK]', appleMusic: '[LINK]', deezer: '[LINK]', youtubeMusic: '[LINK]', amazonMusic: '[LINK]' },
    letra: '[LETRA]',
    emBreve: false,
    preSaveUrl: ''
  }
];
