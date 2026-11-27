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
 *   letra       objeto { creditos: { letra, musica }, secoes: [ { id, tipo, rotulo, repetir, linhas: [ { texto, apoio, vocalize } ] } ] }
 *               tipo: "verso" | "coro" | "ponte" | "final"; repetir: número (selo ×N) ou null;
 *               apoio: voz de apoio exibida abaixo da linha (ou null); vocalize: true para "Uh, uh, uh".
 *               Sem letra (null), o link "Ler a letra" não aparece.
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
    letra: {
      "creditos": {
        "letra": "Simone Reis",
        "musica": "Simone Reis"
      },
      "secoes": [
        {
          "id": "verso-1",
          "tipo": "verso",
          "rotulo": "Verso 1",
          "repetir": null,
          "linhas": [
            {
              "texto": "Quantas vezes eu pude falar, mas não falei,",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Guardei pra mim tua palavra e não compartilhei",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Deixei vazio um coração que procurava Deus",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Me arrependo de não ser a tua voz, Senhor",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "De dar ao mundo a única esperança contra a dor",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Hoje quero ser bem diferente do que fui",
              "apoio": null,
              "vocalize": false
            }
          ]
        },
        {
          "id": "coro",
          "tipo": "coro",
          "rotulo": "Coro",
          "repetir": null,
          "linhas": [
            {
              "texto": "Eu vou falar do teu amor",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Não vou calar a minha voz",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Nunca mais guardar pra mim a luz que deve iluminar o mundo",
              "apoio": null,
              "vocalize": false
            }
          ]
        },
        {
          "id": "verso-2",
          "tipo": "verso",
          "rotulo": "Verso 2",
          "repetir": null,
          "linhas": [
            {
              "texto": "A minha pequenina luz eu vou deixar brilhar,",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Meu testemunho vivo hoje vou compartilhar",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Que eu desapareça e todos possam ver Deus em mim",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "O coração fechado então se abrirá pra Deus",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "E aqueles que te rejeitaram agora serão Teus",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "O teu Espírito irá à frente abrindo mais corações",
              "apoio": null,
              "vocalize": false
            }
          ]
        },
        {
          "id": "ponte",
          "tipo": "ponte",
          "rotulo": "Ponte",
          "repetir": null,
          "linhas": [
            {
              "texto": "Eu vou falar, eu vou falar, eu vou falar,",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Eu vou falar, eu vou falar, eu vou falar",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Do teu amor.",
              "apoio": "De tudo que tens feito por mim, ó Deus",
              "vocalize": false
            },
            {
              "texto": "Eu vou falar, eu vou falar, eu vou falar,",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Eu vou falar, eu vou falar, eu vou falar",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Do teu amor.",
              "apoio": "O sacrifício lá na cruz, o sangue que verteu Jesus",
              "vocalize": false
            }
          ]
        },
        {
          "id": "final",
          "tipo": "final",
          "rotulo": "Final",
          "repetir": null,
          "linhas": [
            {
              "texto": "Hoje serei diferente do que um dia fui",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Minha vida eu te dou em teu louvor",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Vem, me use, Pai, me use para o teu louvor.",
              "apoio": null,
              "vocalize": false
            }
          ]
        }
      ]
    },
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
    letra: {
      "creditos": {
        "letra": "Gerson Reis",
        "musica": "Gerson Reis"
      },
      "secoes": [
        {
          "id": "verso-1",
          "tipo": "verso",
          "rotulo": "Verso 1",
          "repetir": null,
          "linhas": [
            {
              "texto": "Enquanto eu estiver focado em defender opiniões",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "E esquecer que Cristo é chave para a salvação",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Eu vou me esquivar, buscar achar em mim explicações",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Pra minha falta de amor e incompreensão.",
              "apoio": null,
              "vocalize": false
            }
          ]
        },
        {
          "id": "verso-2",
          "tipo": "verso",
          "rotulo": "Verso 2",
          "repetir": null,
          "linhas": [
            {
              "texto": "Enquanto meu orgulho me impedir de ver que ter razão",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Não é mais importante que ser o evangelho",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "E cada vez que eu falar que eu não dê força à escuridão",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Me recusando a tentar ser juiz, quando eu deveria ser irmão.",
              "apoio": null,
              "vocalize": false
            }
          ]
        },
        {
          "id": "coro",
          "tipo": "coro",
          "rotulo": "Coro",
          "repetir": null,
          "linhas": [
            {
              "texto": "Uh, uh, uh",
              "apoio": null,
              "vocalize": true
            },
            {
              "texto": "A cruz não precisa mais se reerguer",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Se Cristo venceu o pecado de uma vez",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Uh, uh, uh",
              "apoio": null,
              "vocalize": true
            },
            {
              "texto": "Mas sua vitória não faz de mim",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Melhor que o filho que esqueceu quando caiu",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Julgar por justiça não cabe a mim",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "De Deus é a voz que diz:",
              "apoio": "De Deus é…",
              "vocalize": false
            },
            {
              "texto": "Sou Eu que escrevo o fim.",
              "apoio": null,
              "vocalize": false
            }
          ]
        },
        {
          "id": "verso-3",
          "tipo": "verso",
          "rotulo": "Verso 3",
          "repetir": null,
          "linhas": [
            {
              "texto": "Enquanto o Cristo conhecido for o das acusações",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Que vive esperando a chance de alguém tropeçar",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "E apontar a culpa sem lembrar que há outra razão",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Que fez o céu descer em forma de homem de aflições.",
              "apoio": null,
              "vocalize": false
            }
          ]
        },
        {
          "id": "verso-4",
          "tipo": "verso",
          "rotulo": "Verso 4",
          "repetir": null,
          "linhas": [
            {
              "texto": "Uh, uh, uh",
              "apoio": null,
              "vocalize": true
            },
            {
              "texto": "De nada vai adiantar discursos vagos",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Uh, uh, uh",
              "apoio": null,
              "vocalize": true
            },
            {
              "texto": "Sem amor, ou teorias desenhadas em papel de dor",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Uh, uh, uh",
              "apoio": null,
              "vocalize": true
            },
            {
              "texto": "Bem mais marcadas de feridas estão vidas por aí",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Que necessitam conhecer o mesmo Deus",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Que a Si mesmo se deu só por amor.",
              "apoio": null,
              "vocalize": false
            }
          ]
        },
        {
          "id": "coro-2",
          "tipo": "coro",
          "rotulo": "Coro",
          "repetir": null,
          "linhas": [
            {
              "texto": "A cruz não precisa mais se reerguer",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Se Cristo venceu o pecado de uma vez,",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Mas sua vitória não faz de mim",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Melhor que o filho que esqueceu quando caiu",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Julgar por justiça não cabe a mim,",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "De Deus é a voz que diz:",
              "apoio": null,
              "vocalize": false
            }
          ]
        },
        {
          "id": "ponte",
          "tipo": "ponte",
          "rotulo": "Ponte",
          "repetir": 2,
          "linhas": [
            {
              "texto": "Sob o sangue estou, justificado sou,",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Passei da morte para a vida com meu Redentor",
              "apoio": null,
              "vocalize": false
            }
          ]
        },
        {
          "id": "coro-final",
          "tipo": "coro",
          "rotulo": "Coro final",
          "repetir": null,
          "linhas": [
            {
              "texto": "A cruz não precisa mais se reerguer",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Se Cristo venceu o pecado de uma vez",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Mas sua vitória não faz de mim",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Melhor que o filho que esqueceu quando caiu",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Julgar por justiça não cabe a mim",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "De Deus é a voz que diz:",
              "apoio": null,
              "vocalize": false
            },
            {
              "texto": "Sou Eu que escrevo o fim.",
              "apoio": null,
              "vocalize": false
            }
          ]
        }
      ]
    },
    emBreve: false,
    preSaveUrl: ''
  }
];
