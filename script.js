/* =========================================================
  SCRIPT DO PORTFÓLIO (JavaScript puro)
  Cada bloco abaixo cuida de uma funcionalidade.
   ========================================================= */

// Descobre se a pessoa pediu "menos movimento" no sistema
const preferePoucoMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. TEMA CLARO / ESCURO ---------- */
const htmlRaiz = document.documentElement;
const botaoTema = document.getElementById("botao-tema");
const iconeTema = document.getElementById("icone-tema");

function aplicarTema(tema) {
  // O CSS troca as cores quando existe data-tema="escuro" no <html>
  if (tema === "escuro") {
    htmlRaiz.setAttribute("data-tema", "escuro");
    iconeTema.className = "bi bi-sun-fill";
  } else {
    htmlRaiz.removeAttribute("data-tema");
    iconeTema.className = "bi bi-moon-stars-fill";
  }
}

function alternarTema() {
  const novoTema = htmlRaiz.getAttribute("data-tema") === "escuro" ? "claro" : "escuro";
  aplicarTema(novoTema);
  try { localStorage.setItem("tema", novoTema); } catch (erro) { /* sem armazenamento: tudo bem */ }
}

// Ao abrir a página: usa o tema salvo; se não houver, usa o tema do sistema
let temaSalvo = null;
try { temaSalvo = localStorage.getItem("tema"); } catch (erro) { /* ignora */ }
const sistemaEscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
aplicarTema(temaSalvo || (sistemaEscuro ? "escuro" : "claro"));

botaoTema.addEventListener("click", alternarTema);

/* ---------- 2. MENU HAMBÚRGUER (mobile) ---------- */
const botaoMenu = document.getElementById("botao-menu");
const iconeMenu = document.getElementById("icone-menu");
const menu = document.getElementById("menu");

function definirMenu(aberto) {
  menu.classList.toggle("menu--aberto", aberto);
  botaoMenu.setAttribute("aria-expanded", String(aberto));
  botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  iconeMenu.className = aberto ? "bi bi-x-lg" : "bi bi-list";
}

botaoMenu.addEventListener("click", function () {
  definirMenu(!menu.classList.contains("menu--aberto"));
});

// Fecha o menu ao clicar em um link ou ao apertar Esc
menu.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () { definirMenu(false); });
});
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") definirMenu(false);
});

/* ---------- 3. EFEITO MÁQUINA DE ESCREVER ---------- */
const textoDigitado = document.getElementById("texto-digitado");
const frases = [
  "Estudante de Desenvolvimento Full Stack",
  "Focado em Front-end hoje, Full Stack amanhã",
  "Baterista e percussionista"
];
let indiceFrase = 0;
let indiceLetra = 0;
let apagando = false;

function digitar() {
  const fraseAtual = frases[indiceFrase];
  indiceLetra += apagando ? -1 : 1;
  textoDigitado.textContent = fraseAtual.substring(0, indiceLetra);

  let atraso = apagando ? 35 : 75;
  if (!apagando && indiceLetra === fraseAtual.length) {
    apagando = true;
    atraso = 1800; // pausa com a frase completa
  } else if (apagando && indiceLetra === 0) {
    apagando = false;
    indiceFrase = (indiceFrase + 1) % frases.length;
    atraso = 400;
  }
  setTimeout(digitar, atraso);
}

if (preferePoucoMovimento) {
  textoDigitado.textContent = frases[0]; // sem animação
} else {
  digitar();
}

/* ---------- 4. ANIMAÇÃO DE ENTRADA AO ROLAR ---------- */
const elementosRevelar = document.querySelectorAll(".revelar");

if ("IntersectionObserver" in window) {
  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
        observador.unobserve(entrada.target); // anima só uma vez
      }
    });
  }, { threshold: 0.15 });
  elementosRevelar.forEach(function (elemento) { observador.observe(elemento); });
} else {
  elementosRevelar.forEach(function (elemento) { elemento.classList.add("visivel"); });
}

/* ---------- 5. ROADMAP DA FORMAÇÃO ---------- */
const roadmap = document.getElementById("roadmap");
const etapas = roadmap.querySelectorAll(".etapa");
const barraProgresso = document.getElementById("progresso-barra");
const caixaProgresso = document.getElementById("progresso");
const rotuloProgresso = document.getElementById("progresso-rotulo");

// Texto de cada status. Para atualizar a trilha, mude só o data-status no HTML.
const textosStatus = {
  "concluido": "✓ Concluído",
  "em-andamento": "● Em andamento",
  "futuro": "Em breve"
};
// Quanto cada status "vale" no progresso geral
const pesosStatus = { "concluido": 1, "em-andamento": 0.5, "futuro": 0 };

function atualizarRoadmap() {
  let soma = 0;
  etapas.forEach(function (etapa) {
    const status = etapa.dataset.status;
    etapa.querySelector(".selo-status").textContent = textosStatus[status];
    soma += pesosStatus[status];
  });
  return Math.round((soma / etapas.length) * 100);
}

const porcentagem = atualizarRoadmap(); // textos aparecem mesmo antes da animação

function animarRoadmap() {
  roadmap.classList.add("roadmap--ativo");
  roadmap.style.setProperty("--preenchimento", porcentagem);
  barraProgresso.style.width = porcentagem + "%";
  caixaProgresso.setAttribute("aria-valuenow", porcentagem);
  rotuloProgresso.textContent = "Progresso da trilha: " + porcentagem + "%";
}

// Dispara quando o card de formação aparece na tela
const cartaoFormacao = document.getElementById("cartao-formacao");
if ("IntersectionObserver" in window) {
  const observadorRoadmap = new IntersectionObserver(function (entradas) {
    if (entradas[0].isIntersecting) {
      animarRoadmap();
      observadorRoadmap.disconnect();
    }
  }, { threshold: 0.3 });
  observadorRoadmap.observe(cartaoFormacao);
} else {
  animarRoadmap();
}

/* ---------- 6. BOTÃO VOLTAR AO TOPO ---------- */
const botaoTopo = document.getElementById("voltar-topo");

window.addEventListener("scroll", function () {
  botaoTopo.classList.toggle("voltar-topo--visivel", window.scrollY > 400);
}, { passive: true });

botaoTopo.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: preferePoucoMovimento ? "auto" : "smooth" });
});

/* ---------- 7. ANO NO RODAPÉ ---------- */
document.getElementById("ano-atual").textContent = new Date().getFullYear();
