# Ministério Nova Página — site

Site do Ministério Nova Página (grupo musical gospel de jovens de Sorriso/MT), com página inicial e página "Nossa história".
HTML, CSS e JavaScript puros: não há build, framework nem `npm install`.

## Como abrir

**Windows (recomendado):** dê dois cliques em `iniciar-site.bat`. Ele sobe um servidor local e abre `http://localhost:8000` no navegador.
Precisa do Python instalado (https://www.python.org/downloads/ — marque "Add python.exe to PATH" na instalação).

**Manual (qualquer sistema):**

```
cd E:\ministerio-nova-pagina
python -m http.server 8000
```

Depois abra http://localhost:8000.

> Abrir o `index.html` com dois cliques também funciona, mas o player de prévia do Spotify e o vídeo do YouTube
> exigem que o site seja servido por `http://` (servidor local ou hospedagem) e com internet.

## Estrutura

```
index.html            página inicial (Hero, Sobre, Discografia, Vídeos, Galeria, Agenda, Contato)
nossa-historia.html   página "Nossa história"
styles.css            estilos gerais e tokens (cores, fontes, container)
discografia.css       estilos da seção Discografia
main.js               menu, animações do Hero, linha do tempo, agenda, formulário
discografia.js        seção Discografia (gerada a partir de data/releases.js) + player do Spotify
transitions.css/.js   transições: páginas empilhadas ao rolar, virada de página no menu, costura de luz
data/releases.js      DADOS dos lançamentos — edite aqui para publicar músicas novas
data/site.js          DADOS gerais: links das redes sociais (cabeçalho e menu do celular)
fonts/                fontes locais (Cormorant Garamond, Ubuntu, Ubuntu Mono — licença SIL OFL)
assets/               logos, capas e fotos
docs/capturas/        capturas de tela de referência
design/               arquivos originais do Claude Design (protótipo, conversas, imagens enviadas)
```

## Publicar um lançamento novo

Abra `data/releases.js` e copie um item do array `NP_RELEASES`. Preencha `id`, `titulo`, `tipo`, `ano`, `data` (AAAA-MM-DD),
`capa`, `spotifyId`, `links` e `letra`. O mais recente pela data vira o destaque automaticamente.
Para um lançamento futuro, use `emBreve: true` e `preSaveUrl` — ele aparece como card "Em breve".

## Transições entre seções

- **Ao rolar:** cada seção assenta na tela quando o fim dela chega ao pé da tela e a próxima sobe por cima;
  a de trás recua levemente e escurece. Subindo, o efeito se desfaz. Ajustes no topo de `transitions.js`
  (`STACK_SCALE`, `STACK_VEIL`).
- **No menu:** saltos longos usam a "virada de página" (folha escura com luz dourada e o monograma);
  seções próximas usam rolagem suave. Também entre a home e "Nossa história".
- Com "reduzir movimento" ligado no sistema, nenhuma animação é aplicada.

## Dependências externas (precisam de internet)

| Serviço | Onde | Quando carrega |
|---|---|---|
| Spotify iFrame API (`open.spotify.com/embed/iframe-api/v1`) | Discografia → "Tocar prévia" | só ao clicar |
| YouTube (`youtube-nocookie.com`) | Vídeos → clipe "Eu Vou Falar" | ao abrir a página |

Todo o resto (fontes, imagens, scripts) está neste repositório.

## Pendências de conteúdo

- `data/releases.js`: link do artista no Spotify usado no card "Seguir no Spotify" (`NP_ARTISTA.spotify`);
  `spotifyId` da faixa "Evangelho" (para a prévia); link do Amazon Music de "Eu Vou Falar"; letras das duas músicas.
- Sobre / linha do tempo: datas `[  ]` de Câmara Municipal de Sorriso, Gravação em estúdio, Plataformas digitais, Primeiro clipe e Natal Luz.
- Nossa história: 12 × nome, naipe e foto dos integrantes; foto de Davi Francisco; 7 fotos dos marcos.
- Vídeos: dois vídeos secundários. Galeria: fotos. Agenda: eventos. Contato: o formulário ainda não envia (só visual).
- Links de texto das redes no rodapé ainda apontam para `#contato`.
