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

  // 1 imagem principal (credibilidade). Se você tiver a sua, use: "assets/img/hero.jpg"
  heroImageUrl: "https://images.unsplash.com/photo-1515825838458-f2fffe3f6cd8?q=80&w=1600&auto=format&fit=crop",

  // Contador agressivo por visitante
  offerMinutes: 15,

  // Prova social (nomes)
  buyers: [
    "Laura","Camila","Fernanda","Juliana","Mariana","Patrícia","Renata","Bruna",
    "Karina","Aline","Vanessa","Gabriela","Rafaela","Letícia","Cláudia","Priscila"
  ],

  // Intervalos do toast (ms)
  toastStartDelay: 4500,
  toastIntervalMin: 9000,
  toastIntervalMax: 18000
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

  const heroImg = $("#heroImg");
  heroImg.src = CONFIG.heroImageUrl;

  $("#bonusLine").textContent = CONFIG.bonusLine;
  $("#year").textContent = new Date().getFullYear();
}

// =========================
// Countdown (per visitor)
// =========================
function initCountdown(){
  const timer1 = $("#timer");
  const timer2 = $("#timer2");
  const endKey = "offer_end_ts_v2";

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
    timer1.textContent = text;
    timer2.textContent = text;

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
// Social proof toast
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
    }, randInt(CONFIG.toastIntervalMin, CONFIG.toastIntervalMax));
  }, CONFIG.toastStartDelay);
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
  initToast();
  initShine();
});
