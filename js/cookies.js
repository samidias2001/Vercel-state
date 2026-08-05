// ==========================================
// Gestion du consentement des cookies
// Cabinet Dr Ziane Khodja
// Version 2.0 — RGPD conforme
// ==========================================

const COOKIE_NAME = "drzk_cookie_consent";
const GA_ID = "G-S65YXQMJTX";

// ── Lecture / écriture du consentement ──────────────────────────────────────

function getConsent() {
    return localStorage.getItem(COOKIE_NAME);
}

function setConsent(value) {
    localStorage.setItem(COOKIE_NAME, value);
}

// ── Chargement conditionnel de Google Analytics ─────────────────────────────

function loadAnalytics() {
    if (getConsent() !== "accepted") return;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_ID);
}

// ── Bannière de consentement ────────────────────────────────────────────────

function createBanner() {
    if (getConsent()) return; // déjà répondu → pas de bannière

    const banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.innerHTML = `
        <div style="
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #1f2937;
            color: white;
            padding: 18px 24px;
            z-index: 99999;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            flex-wrap: wrap;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
            font-family: sans-serif;
            font-size: 14px;
            line-height: 1.5;
        ">
            <div style="flex: 1; min-width: 220px;">
                🍪 Ce site utilise des cookies pour mesurer l'audience et améliorer votre expérience.
                <a href="/politique-confidentialite.html"
                   style="color:#93c5fd; margin-left:6px; text-decoration:underline;">
                   En savoir plus
                </a>
            </div>

            <div style="display:flex; gap:10px; flex-shrink:0;">
                <button id="cookie-refuse" style="
                    padding: 9px 18px;
                    cursor: pointer;
                    background: transparent;
                    color: white;
                    border: 1px solid #6b7280;
                    border-radius: 6px;
                    font-size: 14px;
                ">Refuser</button>

                <button id="cookie-accept" style="
                    padding: 9px 18px;
                    cursor: pointer;
                    background: #0d6efd;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 600;
                ">Accepter</button>
            </div>
        </div>
    `;

    document.body.appendChild(banner);

    document.getElementById("cookie-accept").onclick = () => {
        setConsent("accepted");
        document.getElementById("cookie-banner").remove();
        loadAnalytics(); // ← GA se charge seulement ici
    };

    document.getElementById("cookie-refuse").onclick = () => {
        setConsent("refused");
        document.getElementById("cookie-banner").remove();
        // GA ne se charge pas
    };
}

// ── Initialisation ──────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
    loadAnalytics(); // si consentement déjà donné lors d'une visite précédente
    createBanner();  // sinon, afficher la bannière
});