// =========================
// CONFIG (edite aqui)
// =========================
const CONFIG = {
  checkoutUrl: "https://SEU-LINK-DE-CHECKOUT-AQUI.com",
  produtoNome: "Manual Completo de Remédios Naturais para Auxílio no Bem-Estar Diário",
  brandName: "Manual Natural",
  precoDe: "R$ 57,00",
  precoPor: "R$ 27,00",
  bonusLine: "🔥 Bônus: tabela rápida + checklist de segurança",

  // FOTO DO EBOOK (uma única imagem que passe credibilidade)
  // Se você tiver sua imagem, recomendo: "assets/img/ebook.jpg"
  ebookImageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1600&auto=format&fit=crop",

  // Contador agressivo por visitante
  offerMinutes: 15,

  // Pessoas vendo agora (range)
  viewersMin: 18,
  viewersMax: 67,
  viewersUpdateEveryMs: 9000, // atualiza a cada 9s (leve e realista)

  // Prova social (mensagem de venda) a cada 5 minutos
  buyers: ["Laura","Camila","Fernanda","Juliana","Mariana","Patrícia","Renata","Bruna","Karina","Aline","Vanessa","Gabriela"],
  toastEveryMs: 5 * 60 * 1000, // 5 minutos
  toastStartDelayMs: 20 * 1000 // primeira mensagem após 20s
};

// =========================
// Helpers
// =========================
const $ = (sel) => document.querySelector(sel);
const pad = (n) => String(n).padStart(2, "0");
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// =========================
// Apply config to DOM
// =========================
function applyConfig(){
  $("#produtoNome").textContent = CONFIG.produtoNome;
  $("#brandName").textContent = CONFIG.brandName;

  $("#precoDe").textContent = "De " + CONFIG.precoDe;
  $("#precoPor").textContent = CONFIG.precoPor;
  $("#stickyPrice").textContent = CONFIG.precoPor;

  $("#btnCheckout").href = CONFIG.checkoutUrl;

  const ebookImg = $("#ebookImg");
  ebookImg.src = CONFIG.ebookImageUrl;

  $("#bonusLine").textContent = CONFIG.bonusLine;
  $("#year").textContent = new Date().getFullYear();
}

// =========================
// Countdown (per visitor)
// - atualiza 3 lugares: timer, timer2 e dealTimer
// =========================
function initCountdown(){
  const t1 = $("#timer");
  const t2 = $("#timer2");
  const t3 = $("#dealTimer");

  const endKey = "offer_end_ts_v3";
  let endTs = Number(localStorage.getItem(endKey));
  if (!endTs || endTs < Date.now()) {
    endTs = Date.now() + CONFIG.offerMinutes * 60 * 1000;
    localStorage.setItem(endKey, String(endTs));
  }

  function tick(){
    const diff = Math.max(0, endTs - Date.now());
    const m = Math.floor(diff / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const text = `00:${pad(m)}:${pad(s)}`;

    t1.textContent = text;
    t2.textContent = text;
    t3.textContent = text;

    if (diff === 0) {
      ["#btnCheckout", "#btnHero", "#btnSticky"].forEach(id => {
        const el = $(id);
        if (el) el.textContent = "Garantir acesso (últimas vagas)";
      });
    }
  }

  tick();
  setInterval(tick, 1000);
}

// =========================
// Reveal on scroll
// =========================
function initReveal(){
  const els = Array.from(document.querySelectorAll(".reveal"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) en.target.classList.add("show");
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
}

// =========================
// Viewers now (2 lugares)
// =========================
function initViewers(){
  const v1 = $("#viewersNow");
  const v2 = $("#viewersNow2");

  // seed por visitante (mantém estável e realista)
  const seedKey = "viewers_seed_v1";
  let base = Number(localStorage.getItem(seedKey));
  if (!base || base < CONFIG.viewersMin || base > CONFIG.viewersMax) {
    base = randInt(CONFIG.viewersMin, CONFIG.viewersMax);
    localStorage.setItem(seedKey, String(base));
  }

  function render(n){
    v1.textContent = String(n);
    v2.textContent = String(n);
  }

  render(base);

  // varia levemente com o tempo (±0..3)
  setInterval(() => {
    const delta = randInt(-2, 3);
    let next = base + delta;
    next = Math.max(CONFIG.viewersMin, Math.min(CONFIG.viewersMax, next));
    base = next;
    localStorage.setItem(seedKey, String(base));
    render(base);
  }, CONFIG.viewersUpdateEveryMs);
}

// =========================
// Social proof toast (a cada 5 minutos)
// =========================
function initToast(){
  const toast = $("#toast");
  const title = $("#toastTitle");
  const avatar = $("#toastAvatar");

  function showToast(){
    const name = CONFIG.buyers[Math.floor(Math.random() * CONFIG.buyers.length)];
    title.textContent = `${name} acabou de comprar`;
    avatar.textContent = name[0].toUpperCase();

    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 4200);
  }

  setTimeout(() => {
    showToast();
    setInterval(() => {
      if (document.visibilityState === "visible") showToast();
    }, CONFIG.toastEveryMs);
  }, CONFIG.toastStartDelayMs);
}

// =========================
// Premium light follow mouse
// =========================
function initShine(){
  const shine = document.querySelector(".shine");
  window.addEventListener("mousemove", (e) => {
    const x = Math.round((e.clientX / window.innerWidth) * 100);
    const y = Math.round((e.clientY / window.innerHeight) * 100);
    shine.style.setProperty("--x", x + "%");
    shine.style.setProperty("--y", y + "%");
  }, { passive:true });
}

// =========================
// Boot
// =========================
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initCountdown();
  initReveal();
  initViewers();
  initToast();
  initShine();
});
