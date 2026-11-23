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
 *               Cada ícone de plataforma só aparece quando o campo é uma URL http(s) válida; use null para ocultar.
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
    links: {
      spotify: 'https://open.spotify.com/track/3HHK51ifdDZfyP1UpQcaoO',
      appleMusic: 'https://music.apple.com/br/album/eu-vou-falar-single/1847772340',
      deezer: 'https://www.deezer.com/br/album/842128042',
      youtubeMusic: 'https://music.youtube.com/playlist?list=OLAK5uy_mzLrFnNcwo8IoDDeXYOXbZeX7kUR8AkI8',
      amazonMusic: null
    },
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
    links: {
      spotify: 'https://open.spotify.com/album/7mAmTaNkQtLDSC3PSMRIVQ',
      appleMusic: 'https://music.apple.com/us/album/evangelho-single/1861951965',
      deezer: 'https://www.deezer.com/album/878823062',
      youtubeMusic: 'https://music.youtube.com/playlist?list=OLAK5uy_kA9C--MRQQ6XOz7iwGImkxpvBDgwgcfN0',
      amazonMusic: 'https://music.amazon.com/albums/B0G7Q2CX2N'
    },
    letra: '[LETRA]',
    emBreve: false,
    preSaveUrl: ''
  }
];
