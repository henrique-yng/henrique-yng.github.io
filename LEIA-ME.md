# Site do portfólio — Paulo Henrique

Site estático (HTML, CSS e JS puros). Funciona em qualquer hospedagem: Netlify, Vercel, GitHub Pages, ou arrastando a pasta `site` para o Netlify Drop.

## Arquivos
- `index.html` — home (hero, projetos, sobre, contato)
- `projeto.html` — modelo único da página de projeto (`projeto.html?p=<slug>`)
- `css/style.css` — visual. As cores ficam no topo, em `:root`
- `js/projetos.js` — **todos os textos e imagens dos projetos**
- `js/main.js` — barra que escurece ao rolar, hover das capas, filtros, galeria e lightbox
- `assets/projetos/<slug>/full` e `/thumb` — imagens grandes e miniaturas

## Posts de Social Media
O site usa **todas** as imagens da pasta `posts social media` (inclusive subpastas). Depois de escolher os posts, rode na pasta `portifolio`:
```
python ferramentas/atualizar-posts.py
```
Ele refaz as imagens e o arquivo `js/posts.js`. A ordem é alfabética; um arquivo com "capa" no nome vira a capa.

## Imagens dos outros projetos
Vieram do PDF antigo (`portifolio-paulo-henrique.pdf`), do jeito que aparecem nele. O AtivaSUS usa `"secoes"` em `js/projetos.js` para mostrar os três eventos na mesma página.

## Tarefas comuns
- **Trocar a cor do hover:** em `css/style.css`, mude `--hover` (hoje é o verde `--verde: #95d3bf`).
- **Colocar sua foto:** salve como `assets/img/foto.jpg`. Ela aparece dentro do círculo vermelho.
- **Currículo:** salve como `assets/curriculo.pdf`. O botão "Baixar currículo" já aponta para ele.
- **Editar um texto de projeto:** em `js/projetos.js`, mude `nome` (card da home), `titulo` (página), `linha` (categoria · cliente) ou `descricao`.
- **Mudar a ordem dos projetos:** reordene os blocos em `js/projetos.js`.
- **Novo projeto:** crie `assets/projetos/<slug>/full` e `/thumb` com as imagens e copie um bloco em `js/projetos.js`. A primeira imagem com `"papel": "capa"` vira a capa; `"processo"` entra na seção Processo.
- **Filtros (pills da home):** cada projeto tem `filtros`, que usam os mesmos nomes dos botões.

## Ver no computador
Na pasta `site`, rode:
```
python -m http.server 5173
```
e abra http://localhost:5173
