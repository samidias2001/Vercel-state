// ==========================================
// Gestion du consentement des cookies
// Cabinet Dr Ziane Khodja
// Version 3.0 — RGPD conforme + Tracking complet
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
    gtag("config", GA_ID, {
        // Active la mesure améliorée (scroll, clics sortants, téléchargements)
        send_page_view: true
    });

    // ← Lancer le tracking une fois GA chargé
    initTracking();
}

// ── Fonction utilitaire : envoyer un événement GA4 ──────────────────────────

function trackEvent(eventName, params = {}) {
    if (typeof window.gtag === "function") {
        window.gtag("event", eventName, params);
    }
}

// ── Initialisation de tous les événements trackés ───────────────────────────

function initTracking() {

    // ────────────────────────────────────────────────
    // 1. BOUTON "APPELER" (tel: links)
    // ────────────────────────────────────────────────
    document.querySelectorAll('a[href^="tel:"]').forEach(el => {
        el.addEventListener("click", () => {
            trackEvent("click_appeler", {
                event_category: "Contact",
                event_label: el.href.replace("tel:", ""),
                value: 1
            });
        });
    });

    // ────────────────────────────────────────────────
    // 2. BOUTON "RÉSERVER / PRENDRE RDV"
    //    (adapté aux boutons avec ces textes ou classes)
    // ────────────────────────────────────────────────
    document.querySelectorAll(
        'a[href*="doctolib"], a[href*="rdv"], button, a'
    ).forEach(el => {
        const text = el.textContent.trim().toLowerCase();
        const isReservation =
            text.includes("réserver") ||
            text.includes("prendre rdv") ||
            text.includes("rendez-vous") ||
            text.includes("appointment") ||
            el.classList.contains("btn-rdv") ||
            el.classList.contains("btn-reservation") ||
            (el.href && el.href.includes("doctolib"));

        if (isReservation) {
            el.addEventListener("click", () => {
                trackEvent("click_reserver", {
                    event_category: "Conversion",
                    event_label: el.href || el.textContent.trim(),
                    value: 5
                });
            });
        }
    });

    // ────────────────────────────────────────────────
    // 3. BOUTON "ITINÉRAIRE / DIRECTION"
    //    (Google Maps links ou boutons avec ce texte)
    // ────────────────────────────────────────────────
    document.querySelectorAll(
        'a[href*="maps.google"], a[href*="goo.gl/maps"], a[href*="maps.app"], a'
    ).forEach(el => {
        const text = el.textContent.trim().toLowerCase();
        const isItineraire =
            text.includes("itinéraire") ||
            text.includes("direction") ||
            text.includes("y aller") ||
            text.includes("voir sur la carte") ||
            (el.href && (
                el.href.includes("maps.google") ||
                el.href.includes("goo.gl/maps") ||
                el.href.includes("maps.app.goo")
            ));

        if (isItineraire) {
            el.addEventListener("click", () => {
                trackEvent("click_itineraire", {
                    event_category: "Navigation",
                    event_label: el.href || "Carte",
                    value: 1
                });
            });
        }
    });

    // ────────────────────────────────────────────────
    // 4. BOUTON / LIEN "EMAIL"
    // ────────────────────────────────────────────────
    document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
        el.addEventListener("click", () => {
            trackEvent("click_email", {
                event_category: "Contact",
                event_label: el.href.replace("mailto:", ""),
                value: 1
            });
        });
    });

    // ────────────────────────────────────────────────
    // 5. BOUTON "WHATSAPP" (si présent)
    // ────────────────────────────────────────────────
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(el => {
        el.addEventListener("click", () => {
            trackEvent("click_whatsapp", {
                event_category: "Contact",
                event_label: "WhatsApp",
                value: 1
            });
        });
    });

    // ────────────────────────────────────────────────
    // 6. FORMULAIRE DE CONTACT (si présent)
    // ────────────────────────────────────────────────
    document.querySelectorAll("form").forEach(form => {
        form.addEventListener("submit", () => {
            trackEvent("form_submit", {
                event_category: "Contact",
                event_label: form.id || form.className || "Formulaire",
                value: 3
            });
        });
    });

    // ────────────────────────────────────────────────
    // 7. SCROLL DEPTH (25%, 50%, 75%, 100%)
    // ────────────────────────────────────────────────
    const scrollMilestones = { 25: false, 50: false, 75: false, 100: false };
    window.addEventListener("scroll", () => {
        const scrolled = Math.round(
            (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );
        [25, 50, 75, 100].forEach(milestone => {
            if (scrolled >= milestone && !scrollMilestones[milestone]) {
                scrollMilestones[milestone] = true;
                trackEvent("scroll_depth", {
                    event_category: "Engagement",
                    event_label: milestone + "%",
                    value: milestone
                });
            }
        });
    }, { passive: true });

    // ────────────────────────────────────────────────
    // 8. TEMPS PASSÉ SUR LA PAGE (30s, 60s, 120s)
    // ────────────────────────────────────────────────
    [30, 60, 120].forEach(seconds => {
        setTimeout(() => {
            trackEvent("time_on_page", {
                event_category: "Engagement",
                event_label: seconds + "s",
                value: seconds
            });
        }, seconds * 1000);
    });

    // ────────────────────────────────────────────────
    // 9. CLIC SUR LES PHOTOS / GALERIE (si présente)
    // ────────────────────────────────────────────────
    document.querySelectorAll(".gallery img, .photos img, [data-gallery] img").forEach(img => {
        img.addEventListener("click", () => {
            trackEvent("click_photo", {
                event_category: "Engagement",
                event_label: img.alt || img.src,
            });
        });
    });

    // ────────────────────────────────────────────────
    // 10. CLIC SUR "FACEBOOK / INSTAGRAM / RÉSEAUX"
    // ────────────────────────────────────────────────
    document.querySelectorAll(
        'a[href*="facebook.com"], a[href*="instagram.com"], a[href*="linkedin.com"]'
    ).forEach(el => {
        el.addEventListener("click", () => {
            const network = el.href.includes("facebook") ? "Facebook"
                         : el.href.includes("instagram") ? "Instagram"
                         : "LinkedIn";
            trackEvent("click_reseau_social", {
                event_category: "Réseaux sociaux",
                event_label: network
            });
        });
    });

}

// ── Bannière de consentement ────────────────────────────────────────────────

function createBanner() {
    if (getConsent()) return;

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
        loadAnalytics();
    };

    document.getElementById("cookie-refuse").onclick = () => {
        setConsent("refused");
        document.getElementById("cookie-banner").remove();
    };
}

// ── Initialisation ──────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
    loadAnalytics(); // si consentement déjà donné lors d'une visite précédente
    createBanner();  // sinon, afficher la bannière
});