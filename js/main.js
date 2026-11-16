/* Portfólio — Paulo Henrique */
(function () {
  "use strict";

  var PROJETOS = window.PROJETOS || [];
  var BASE = "assets/projetos/";
  var semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var temHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var ehHome = !!document.getElementById("grade");

  function el(tag, attrs, filhos) {
    var n = document.createElement(tag);
    for (var k in attrs || {}) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k === "style") n.style.cssText = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    (filhos || []).forEach(function (f) { if (f) n.appendChild(f); });
    return n;
  }
  function url(p, img, tam) { return BASE + p.slug + "/" + (tam === "thumb" ? img.thumb : img.src); }
  function todasImagens(p) {
    var l = p.imagens.slice();
    (p.secoes || []).forEach(function (s) { l = l.concat(s.imagens); });
    return l;
  }
  function capaCard(p) {
    var t = todasImagens(p);
    return t.find(function (i) { return i.papel === "capa-card"; }) ||
           t.find(function (i) { return i.papel === "capa"; }) || t[0];
  }
  function limitar(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ---------- Rolagem suave (Lenis) ---------- */
  var lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
    document.documentElement.classList.add("lenis");
  }
  function irPara(alvo, imediato) {
    var navH = document.getElementById("nav").offsetHeight;
    if (lenis) lenis.scrollTo(alvo, { offset: alvo === 0 ? 0 : -navH - 8, immediate: !!imediato, duration: 1.4 });
    else if (alvo === 0) window.scrollTo({ top: 0, behavior: imediato ? "auto" : "smooth" });
    else window.scrollTo({ top: alvo.getBoundingClientRect().top + window.scrollY - navH - 8, behavior: imediato ? "auto" : "smooth" });
  }

  /* ---------- Loop de animação: barra, símbolo, parallax ---------- */
  var nav = document.getElementById("nav");
  var simbolo = document.querySelector(".hero__simbolo");
  var trilhos = [];
  var ultimoY = -1;
  function quadro(t) {
    if (lenis) lenis.raf(t);
    var y = window.scrollY;
    if (y !== ultimoY) {
      ultimoY = y;
      // a barra escurece aos poucos nos primeiros 220px de rolagem
      var p = limitar(y / 220, 0, 1);
      p = p * p * (3 - 2 * p); // suaviza o começo e o fim
      nav.style.setProperty("--p", p.toFixed(3));
      nav.classList.toggle("is-escura", p > 0.5);
      if (simbolo && !semMovimento) simbolo.style.setProperty("--giro", (y * 0.18).toFixed(1) + "deg");
      if (!semMovimento) {
        var vh = window.innerHeight;
        trilhos.forEach(function (tr) {
          var r = tr.parentNode.getBoundingClientRect();
          if (r.bottom < -100 || r.top > vh + 100) return;
          var centro = (r.top + r.height / 2 - vh / 2) / vh; // -1..1
          tr.style.setProperty("--para", (centro * -28).toFixed(1) + "px");
        });
      }
    }
    requestAnimationFrame(quadro);
  }
  requestAnimationFrame(quadro);

  /* menu do celular */
  var btn = nav.querySelector(".nav__menu-btn");
  btn.addEventListener("click", function () {
    var aberta = nav.classList.toggle("is-aberta");
    btn.setAttribute("aria-expanded", aberta);
    btn.setAttribute("aria-label", aberta ? "Fechar menu" : "Abrir menu");
  });

  /* ---------- Links: âncoras suaves e transição entre páginas ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank" || a.hasAttribute("download")) return;
    var href = a.getAttribute("href") || "";
    if (/^(mailto:|tel:|https?:)/.test(href)) return;
    nav.classList.remove("is-aberta");
    var u = new URL(a.href, location.href);
    var mesmaPagina = u.pathname === location.pathname && u.search === location.search;
    if (mesmaPagina && u.hash) {
      e.preventDefault();
      irPara(u.hash === "#topo" ? 0 : document.querySelector(u.hash) || 0);
      history.replaceState(null, "", u.hash === "#topo" ? location.pathname + location.search : u.hash);
      return;
    }
    if (u.origin === location.origin) {
      e.preventDefault();
      document.body.classList.add("saindo");
      setTimeout(function () { location.href = a.href; }, 520);
    }
  });
  window.addEventListener("pageshow", function (e) { if (e.persisted) document.body.classList.remove("saindo"); });

  /* ---------- Aparecer ao rolar ---------- */
  var SELETOR = ".revela, .revela-texto, .revela-linha, .revela-img, .revela-foto";
  var obs = "IntersectionObserver" in window ? new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("is-visivel"); obs.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.01 }) : null;
  function observar(raiz) {
    (raiz || document).querySelectorAll(SELETOR).forEach(function (n) {
      if (n.classList.contains("is-visivel")) return;
      if (obs) obs.observe(n); else n.classList.add("is-visivel");
    });
  }

  /* ---------- Cursor "Ver projeto" ---------- */
  var cursor = document.querySelector(".cursor");
  if (cursor && temHover) {
    var cx = -200, cy = -200, mx = -200, my = -200, s = 0, alvoS = 0;
    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      alvoS = e.target.closest && e.target.closest(".card__img") ? 1 : 0;
    });
    document.addEventListener("mouseleave", function () { alvoS = 0; });
    (function seguir() {
      cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18; s += (alvoS - s) * 0.16;
      cursor.style.transform = "translate(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px) scale(" + s.toFixed(3) + ")";
      requestAnimationFrame(seguir);
    })();
  }

  /* ---------- Home: grade de projetos ---------- */
  if (ehHome) {
    var grade = document.getElementById("grade");
    PROJETOS.forEach(function (p, idx) {
      // prévias já recortadas no formato do card (js/cards.js); se faltar, usa as miniaturas
      var previas = (window.CARDS || {})[p.slug];
      var fotos;
      if (previas && previas.length) {
        fotos = previas.map(function (c) {
          return { srcset: BASE + p.slug + "/" + c["1x"] + " 720w, " + BASE + p.slug + "/" + c["2x"] + " 1440w",
                   src: BASE + p.slug + "/" + c["1x"] };
        });
      } else {
        var capa = capaCard(p);
        fotos = [capa].concat(todasImagens(p).filter(function (i) { return i.papel !== "processo" && i !== capa; })).slice(0, 1)
          .map(function (f) { return { src: url(p, f, "thumb"), contida: !!f.fundo }; });
      }

      var caixa = el("a", { class: "card__img revela-img", href: "projeto.html?p=" + p.slug, "aria-label": "Ver projeto " + p.nome });
      var trilho = el("div", { class: "card__trilho" });
      caixa.appendChild(trilho);

      var barra = el("div", { class: "card__barra", "aria-hidden": "true" });
      if (fotos.length > 1) fotos.forEach(function () { barra.appendChild(el("i")); });
      caixa.appendChild(barra);
      caixa.appendChild(el("span", { class: "card__ver", text: "Ver projeto →", "aria-hidden": "true" }));

      var imgs = fotos.map(function (f, i) {
        var im = el("img", { alt: i === 0 ? p.nome : "", decoding: "async", loading: idx < 2 ? "eager" : "lazy",
          sizes: "(max-width: 860px) 92vw, 46vw",
          class: (i === 0 ? "is-ativa" : "") + (f.contida ? " is-contida" : "") });
        if (i === 0) { if (f.srcset) im.srcset = f.srcset; im.src = f.src; }
        else { im.dataset.src = f.src; if (f.srcset) im.dataset.srcset = f.srcset; }
        trilho.appendChild(im);
        return im;
      });

      var card = el("article", { class: "card", "data-filtros": p.filtros.join("|") }, [
        caixa,
        el("div", { class: "card__info revela" }, [
          el("h3", {}, [el("a", { href: "projeto.html?p=" + p.slug, text: p.nome })]),
          el("p", { text: p.linha })
        ])
      ]);
      grade.appendChild(card);
      if (fotos.length > 1) ligarSlideshow(caixa, imgs, barra);
    });
    grade.appendChild(el("p", { class: "grade__vazio", text: "Nenhum projeto nessa área ainda.", hidden: "" }));
    ligarFiltros(grade);
  }

  // Ao passar o mouse na capa, as fotos do projeto vão passando
  function ligarSlideshow(caixa, imgs, barra) {
    var PASSO = 1100, timer = null, atual = 0, tracos = barra.children;
    barra.style.setProperty("--passo", PASSO + "ms");
    function carregar() {
      imgs.forEach(function (im) {
        if (im.dataset.srcset) { im.srcset = im.dataset.srcset; delete im.dataset.srcset; }
        if (im.dataset.src) { im.src = im.dataset.src; delete im.dataset.src; }
      });
    }
    function mostrar(i) {
      imgs[atual].classList.remove("is-ativa");
      atual = i;
      imgs[atual].classList.add("is-ativa");
      for (var k = 0; k < tracos.length; k++) tracos[k].className = k < atual ? "is-feito" : (k === atual ? "is-atual" : "");
    }
    function iniciar() {
      if (timer) return;
      carregar(); mostrar(0);
      timer = setInterval(function () {
        var prox = (atual + 1) % imgs.length;
        if (imgs[prox].complete && imgs[prox].naturalWidth) mostrar(prox);
      }, PASSO);
    }
    function parar() {
      clearInterval(timer); timer = null; mostrar(0);
      if (tracos[0]) tracos[0].className = "";
      caixa.classList.remove("is-tocando");
    }
    if (!temHover && "IntersectionObserver" in window) {
      // no celular, passa sozinho quando o card está no meio da tela
      new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) { caixa.classList.add("is-tocando"); iniciar(); } else parar();
      }, { rootMargin: "-35% 0px -35% 0px" }).observe(caixa);
    } else {
      caixa.addEventListener("mouseenter", iniciar);
      caixa.addEventListener("mousemove", iniciar); // caso o card chegue sob o mouse ao rolar
      caixa.addEventListener("mouseleave", parar);
      caixa.addEventListener("focus", iniciar);
      caixa.addEventListener("blur", parar);
    }
  }

  // Pills de área filtram os projetos (com fade)
  function ligarFiltros(grade) {
    var botoes = document.querySelectorAll("[data-filtro]");
    var vazio = grade.querySelector(".grade__vazio");
    botoes.forEach(function (b) {
      b.addEventListener("click", function () {
        var ativo = b.getAttribute("aria-pressed") === "true";
        botoes.forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
        var filtro = ativo ? null : b.dataset.filtro;
        if (filtro) b.setAttribute("aria-pressed", "true");
        grade.style.transition = "opacity .35s ease"; grade.style.opacity = "0";
        setTimeout(function () {
          var visiveis = 0;
          grade.querySelectorAll(".card").forEach(function (c) {
            var mostra = !filtro || c.dataset.filtros.split("|").indexOf(filtro) > -1;
            c.classList.toggle("is-oculto", !mostra);
            if (mostra) visiveis++;
          });
          vazio.hidden = visiveis > 0;
          grade.style.opacity = "1";
          irPara(document.getElementById("projetos"));
        }, 350);
      });
    });
  }

  /* ---------- Página do projeto ---------- */
  var alvo = document.getElementById("projeto");
  if (alvo) montarProjeto(alvo);

  function montarProjeto(alvo) {
    var slug = new URLSearchParams(location.search).get("p");
    var idx = PROJETOS.findIndex(function (p) { return p.slug === slug; });
    if (idx < 0) { location.replace("index.html#projetos"); return; }
    var p = PROJETOS[idx];
    document.title = p.nome + " — Paulo Henrique Designer";

    var heroi = p.imagens.find(function (i) { return i.papel === "intro" || i.papel === "capa"; }) || p.imagens[0];
    var galeria = p.imagens.filter(function (i) { return i.papel === "galeria"; });
    var processo = p.imagens.filter(function (i) { return i.papel === "processo"; });
    var ordemLightbox = [heroi];
    function registrar(lista) { var ini = ordemLightbox.length; ordemLightbox = ordemLightbox.concat(lista); return ini; }

    alvo.appendChild(el("header", { class: "p-topo wrap" }, [
      el("p", { class: "p-linha revela", text: p.linha }),
      el("h1", { class: "p-titulo" }, [el("span", { class: "mascara revela-texto" }, [el("span", { text: p.titulo })])]),
      el("p", { class: "p-desc revela", text: p.descricao }),
      el("div", { class: "p-tags revela" }, p.tags.map(function (t) { return el("span", { text: t }); }))
    ]));

    if (p.carrossel) {
      ordemLightbox = p.imagens.slice();
      alvo.appendChild(montarCarrossel(p.imagens));
    } else {
      var capaFig = el("figure", { class: "p-capa revela-img" + (heroi.fundo ? " fundo-" + heroi.fundo : "") }, [
        el("img", { src: url(p, heroi), alt: heroi.legenda || p.titulo, width: heroi.w, height: heroi.h })
      ]);
      capaFig.addEventListener("click", function () { abrirLightbox(0); });
      alvo.appendChild(capaFig);
    }

    /* Carrossel (Social Media): dois posts grandes + miniatura do próximo.
       Clicar na miniatura (ou na seta →) traz ela para a esquerda. Infinito. */
    function montarCarrossel(lista) {
      var n = lista.length, atual = 0;
      var palco = el("div", { class: "carrossel__palco" });
      var slides = lista.map(function (im, i) {
        var s = el("button", { class: "carrossel__slide", type: "button", "aria-label": "Post " + (i + 1) + " de " + n }, [
          el("img", { src: url(p, im), alt: "Post " + (i + 1), decoding: "async", loading: i < 4 ? "eager" : "lazy", width: im.w, height: im.h }),
          el("span", { class: "carrossel__prox-rotulo", text: "Próximo →", "aria-hidden": "true" })
        ]);
        s.addEventListener("click", function () {
          var d = desloc(i);
          if (d === porVez()) mover(porVez());     // miniatura → vira o par grande
          else if (d >= 0 && d < porVez()) abrirLightbox(i);
        });
        palco.appendChild(s);
        return s;
      });
      var ant = el("button", { class: "carrossel__seta", type: "button", "aria-label": "Posts anteriores", text: "←" });
      var prox = el("button", { class: "carrossel__seta", type: "button", "aria-label": "Próximos posts", text: "→" });
      ant.addEventListener("click", function () { mover(-porVez()); });
      prox.addEventListener("click", function () { mover(porVez()); });

      function porVez() { return window.innerWidth <= 860 ? 1 : 2; }
      function desloc(i) { // distância do slide até o atual, entre -n/2 e n/2
        var d = ((i - atual) % n + n) % n;
        return d > n / 2 ? d - n : d;
      }
      function mover(passo) { atual = ((atual + passo) % n + n) % n; posicionar(); }
      function posicionar() {
        var k = porVez(), gap = window.innerWidth <= 860 ? 12 : 24;
        var largura = palco.clientWidth;
        // k posts grandes + miniatura com 40% da largura de um grande
        var W = (largura - gap * (k + 0.4)) / (k + 0.4);
        W = Math.min(W, (window.innerHeight - 140) * 0.75); // não passa da altura da tela
        var H = W * 4 / 3, mini = 0.4;
        palco.style.height = H + "px";
        slides.forEach(function (s, i) {
          var d = desloc(i), x, esc = 1, vis = 1;
          if (d < 0) { x = d * (W + gap); vis = 0; }
          else if (d < k) { x = d * (W + gap); }
          else { x = k * (W + gap) + (d - k) * (W * mini + gap); esc = mini; vis = d === k ? 1 : 0; }
          s.style.width = W + "px"; s.style.height = H + "px";
          s.style.transform = "translate3d(" + x.toFixed(1) + "px," + (esc < 1 ? (H * (1 - esc) / 2).toFixed(1) : 0) + "px,0) scale(" + esc + ")";
          s.style.opacity = vis;
          s.classList.toggle("is-mini", d === k);
          s.tabIndex = vis ? 0 : -1;
          s.setAttribute("aria-hidden", vis ? "false" : "true");
          s.style.zIndex = d >= 0 && d <= k ? 2 : 1;
          // pré-carrega os posts visíveis e os próximos, para não aparecer vazio
          if (d >= -k && d <= 3 * k + 1) s.firstChild.loading = "eager";
        });
      }
      // calcula quando o palco já está na página e sempre que mudar de largura
      if ("ResizeObserver" in window) new ResizeObserver(function () { posicionar(); }).observe(palco);
      else { setTimeout(posicionar, 0); window.addEventListener("resize", posicionar); }

      return el("section", { class: "carrossel wrap revela", "aria-label": "Posts de social media", "aria-roledescription": "carrossel" }, [
        palco,
        el("div", { class: "carrossel__controles" }, [ant, prox])
      ]);
    }

    if (galeria.length) {
      var gal = el("section", { class: "galeria wrap", "aria-label": "Imagens do projeto" });
      montarLinhas(gal, galeria, registrar(galeria));
      alvo.appendChild(gal);
    }

    (p.secoes || []).forEach(function (s, k) {
      var sec = el("section", { class: "secao-p wrap" }, [
        el("div", { class: "secao-p__cab revela" }, [
          el("span", { class: "secao-p__num", text: String(k + 1).padStart(2, "0") }),
          el("h2", { class: "secao-p__titulo", text: s.titulo }),
          s.descricao ? el("p", { class: "secao-p__desc", text: s.descricao }) : null
        ])
      ]);
      var g = el("div", { class: "galeria" });
      montarLinhas(g, s.imagens, registrar(s.imagens));
      sec.appendChild(g);
      alvo.appendChild(sec);
    });

    if (processo.length) {
      var sp = el("section", { class: "secao-p wrap" }, [
        el("div", { class: "secao-p__cab revela" }, [
          el("span", { class: "secao-p__num", text: "+" }),
          el("h2", { class: "secao-p__titulo", html: "Pro<em>cesso</em>" })
        ])
      ]);
      var gp = el("div", { class: "galeria" });
      montarLinhas(gp, processo, registrar(processo));
      sp.appendChild(gp);
      alvo.appendChild(sp);
    }

    var prox = PROJETOS[(idx + 1) % PROJETOS.length];
    alvo.appendChild(el("div", { class: "wrap" }, [
      el("a", { class: "proximo revela", href: "projeto.html?p=" + prox.slug }, [
        el("small", { text: "Próximo projeto" }), el("strong", { text: prox.nome })
      ])
    ]));

    // Junta as imagens em linhas da mesma altura (como no Figma)
    function montarLinhas(pai, lista, offset) {
      function desenhar(itens) {
        var div = el("div", { class: "galeria__linha" });
        var soma = itens.reduce(function (s, it) { return s + it.img.w / it.img.h; }, 0);
        var sozinhaEstreita = itens.length === 1 && soma < 1.9;
        if (sozinhaEstreita) div.style.justifyContent = "center";
        itens.forEach(function (item, k) {
          var im = item.img, ar = im.w / im.h;
          var fig = el("figure", {
            class: "galeria__item revela-img" + (im.fundo ? " fundo-" + im.fundo : "") + (im.pixel ? " pixel" : ""),
            style: "--atraso:" + (k * 0.12) + "s;--r:" + ar.toFixed(4) + ";--ar:" + im.w + "/" + im.h +
              (sozinhaEstreita ? ";flex:none;width:min(100%, calc(78vh * " + ar.toFixed(4) + "))" : "")
          }, [
            el("img", { src: url(p, im), alt: im.legenda || p.titulo, loading: "lazy", decoding: "async", width: im.w, height: im.h }),
            im.legenda ? el("figcaption", { text: im.legenda }) : null
          ]);
          fig.addEventListener("click", function () { abrirLightbox(item.i); });
          div.appendChild(fig);
        });
        pai.appendChild(div);
      }
      var linha = [], soma = 0, largas = [];
      function fechar() {
        if (linha.length) desenhar(linha);
        linha = []; soma = 0;
        while (largas.length) desenhar([largas.shift()]);
      }
      lista.forEach(function (im, k) {
        var ar = im.w / im.h, item = { img: im, i: offset + k };
        if (ar >= 1.9) {
          if (linha.length) largas.push(item); else desenhar([item]);
          return;
        }
        linha.push(item); soma += ar;
        if (soma >= 2.1 || linha.length === 3) fechar();
      });
      fechar();
    }

    /* lightbox */
    var lb = document.getElementById("lightbox");
    var lbImg = lb.querySelector("img"), lbCont = lb.querySelector(".lightbox__cont");
    var lbAtual = 0;
    function mostrarLb(i) {
      lbAtual = i;
      var im = ordemLightbox[i];
      lbImg.classList.add("is-trocando");
      var novo = new Image();
      novo.onload = function () {
        lbImg.src = novo.src;
        lbImg.alt = im.legenda || p.titulo;
        lbImg.style.imageRendering = im.pixel ? "pixelated" : "";
        lbImg.classList.remove("is-trocando");
      };
      novo.src = url(p, im);
      lbCont.textContent = (im.legenda ? im.legenda + " · " : "") + (i + 1) + " / " + ordemLightbox.length;
    }
    function abrirLightbox(i) {
      mostrarLb(i);
      lb.classList.add("is-aberto");
      if (lenis) lenis.stop(); else document.body.style.overflow = "hidden";
    }
    function fecharLightbox() {
      lb.classList.remove("is-aberto");
      if (lenis) lenis.start(); else document.body.style.overflow = "";
    }
    function mover(d) { mostrarLb((lbAtual + d + ordemLightbox.length) % ordemLightbox.length); }
    lb.querySelector(".lightbox__fechar").addEventListener("click", fecharLightbox);
    lb.querySelector(".lightbox__ant").addEventListener("click", function (e) { e.stopPropagation(); mover(-1); });
    lb.querySelector(".lightbox__prox").addEventListener("click", function (e) { e.stopPropagation(); mover(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) fecharLightbox(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-aberto")) return;
      if (e.key === "Escape") fecharLightbox();
      if (e.key === "ArrowRight") mover(1);
      if (e.key === "ArrowLeft") mover(-1);
    });
  }

  /* ---------- Entrada da página ---------- */
  observar();
  setTimeout(function () {
    document.body.classList.add("pronto");
    document.querySelectorAll(".entrada").forEach(function (n) { n.classList.add("is-visivel"); });
  }, 300);
  if (location.hash && location.hash.length > 1) {
    var destino = document.querySelector(location.hash);
    if (destino) {
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      // espera fontes e imagens para a página ter a altura final
      var pronto = Promise.all([
        document.fonts ? document.fonts.ready : Promise.resolve(),
        new Promise(function (r) { if (document.readyState === "complete") r(); else window.addEventListener("load", r); })
      ]);
      irPara(destino, true);
      pronto.then(function () { irPara(destino, true); });
    }
  }
})();
