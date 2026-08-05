// ==========================================
// Gestion du consentement des cookies
// Cabinet Dr Ziane Khodja
// Version 5.0 — GTM + RGPD + Tracking complet
// ==========================================

const COOKIE_NAME = "drzk_cookie_consent";

// ── Lecture / écriture du consentement ──────────────────────────────────────

function getConsent() {
    return localStorage.getItem(COOKIE_NAME);
}

function setConsent(value) {
    localStorage.setItem(COOKIE_NAME, value);
}

// ── Communication avec Google Tag Manager ───────────────────────────────────
// GTM est déjà chargé dans le <head>. On lui envoie des signaux via dataLayer.

function pushConsent(granted) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: granted ? "cookie_consent_accepted" : "cookie_consent_refused",
        cookie_consent: granted ? "granted" : "denied"
    });
}

// ── Fonction utilitaire d'envoi d'événement ─────────────────────────────────

function trackEvent(eventName, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: eventName }, params || {}));
}

// ── Initialisation du tracking ──────────────────────────────────────────────

function initTracking() {

    // ══════════════════════════════════════════════════
    // 1. CLIC SUR "APPELER"
    //    <a class="btn btn-pink" href="tel:+213558456019">
    // ══════════════════════════════════════════════════
    document.querySelectorAll('a[href^="tel:"]').forEach(function(el) {
        el.addEventListener("click", function() {
            trackEvent("click_appeler", {
                event_category: "Contact",
                event_label: "Téléphone +213558456019",
                value: 1
            });
        });
    });

    // ══════════════════════════════════════════════════
    // 2. CLIC SUR WHATSAPP
    //    — Bouton hero  : href="https://wa.me/213558456019"
    //    — Bouton footer: href="https://wa.me/213558456019"
    //    — Bouton flottant .floating-wa
    // ══════════════════════════════════════════════════
    document.querySelectorAll('a[href*="wa.me"]').forEach(function(el) {
        el.addEventListener("click", function() {
            var label = el.classList.contains("floating-wa")
                ? "Bouton flottant WhatsApp"
                : "Bouton WhatsApp " + (el.closest("section, footer, header") 
                    ? (el.closest("footer") ? "footer" 
                    : el.closest("header") ? "header" : "section")
                    : "page");
            trackEvent("click_whatsapp", {
                event_category: "Contact",
                event_label: label,
                value: 1
            });
        });
    });

    // ══════════════════════════════════════════════════
    // 3. CLIC SUR "LAISSER UN AVIS GOOGLE"
    //    href="https://g.page/r/CQ0Vb5qpP6pZEBM/review"
    // ══════════════════════════════════════════════════
    document.querySelectorAll('a[href*="g.page/r"]').forEach(function(el) {
        el.addEventListener("click", function() {
            trackEvent("click_avis_google", {
                event_category: "Réputation",
                event_label: "Laisser un avis Google",
                value: 2
            });
        });
    });

    // ══════════════════════════════════════════════════
    // 4. CLIC SUR FACEBOOK
    //    href="https://www.facebook.com/share/18vtggVe7d/"
    // ══════════════════════════════════════════════════
    document.querySelectorAll('a[href*="facebook.com"]').forEach(function(el) {
        el.addEventListener("click", function() {
            trackEvent("click_facebook", {
                event_category: "Réseaux sociaux",
                event_label: "Page Facebook Dr Ziane Khodja"
            });
        });
    });

    // ══════════════════════════════════════════════════
    // 5. CLIC SUR LES FICHES DE SERVICES
    //    <a href="hernie-inguinale.html" class="service-card">
    //    + circoncision, cryptorchidie, hypospadias...
    // ══════════════════════════════════════════════════
    document.querySelectorAll("a.service-card").forEach(function(el) {
        el.addEventListener("click", function() {
            var href = el.getAttribute("href") || "";
            var nom = href.replace(".html", "").replace(/-/g, " ");
            // Récupère le titre h3 s'il existe
            var titre = el.querySelector("h3");
            if (titre) nom = titre.textContent.trim();
            trackEvent("click_service", {
                event_category: "Services",
                event_label: nom,
                value: 1
            });
        });
    });

    // ══════════════════════════════════════════════════
    // 6. CLIC SUR LES ANNUAIRES MÉDICAUX
    //    med.tn / algerie-docto / 1sante / annumed...
    // ══════════════════════════════════════════════════
    document.querySelectorAll("a.annuaire-item").forEach(function(el) {
        el.addEventListener("click", function() {
            var href = el.getAttribute("href") || "";
            var domain = href.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
            trackEvent("click_annuaire", {
                event_category: "Annuaires",
                event_label: domain
            });
        });
    });

    // ══════════════════════════════════════════════════
    // 7. OUVERTURE DES QUESTIONS FAQ
    //    <button class="faq-q">
    // ══════════════════════════════════════════════════
    document.querySelectorAll(".faq-q").forEach(function(btn) {
        btn.addEventListener("click", function() {
            var frSpan = btn.querySelector("span.fr");
            var question = frSpan ? frSpan.textContent.trim() : btn.textContent.trim();
            trackEvent("faq_ouverture", {
                event_category: "Engagement FAQ",
                event_label: question
            });
        });
    });

    // ══════════════════════════════════════════════════
    // 8. NAVIGATION CARROUSEL (photos du cabinet)
    //    <button id="prev-btn"> / <button id="next-btn">
    // ══════════════════════════════════════════════════
    var prevBtn = document.getElementById("prev-btn");
    var nextBtn = document.getElementById("next-btn");
    if (prevBtn) {
        prevBtn.addEventListener("click", function() {
            trackEvent("carousel_navigation", {
                event_category: "Galerie Cabinet",
                event_label: "Photo précédente"
            });
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener("click", function() {
            trackEvent("carousel_navigation", {
                event_category: "Galerie Cabinet",
                event_label: "Photo suivante"
            });
        });
    }

    // ══════════════════════════════════════════════════
    // 9. CLICS NAVIGATION INTERNE (#sections)
    //    <nav class="nav-links"><a href="#services">...
    // ══════════════════════════════════════════════════
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(function(el) {
        el.addEventListener("click", function() {
            var frSpan = el.querySelector(".fr");
            var label = frSpan ? frSpan.textContent.trim() : el.textContent.trim();
            trackEvent("navigation_section", {
                event_category: "Navigation",
                event_label: label
            });
        });
    });

    // ══════════════════════════════════════════════════
    // 10. SCROLL DEPTH (25 / 50 / 75 / 100 %)
    // ══════════════════════════════════════════════════
    var scrollMilestones = { 25: false, 50: false, 75: false, 100: false };
    window.addEventListener("scroll", function() {
        var h = document.body.scrollHeight - window.innerHeight;
        if (h <= 0) return;
        var pct = Math.round((window.scrollY / h) * 100);
        [25, 50, 75, 100].forEach(function(m) {
            if (pct >= m && !scrollMilestones[m]) {
                scrollMilestones[m] = true;
                trackEvent("scroll_depth", {
                    event_category: "Engagement",
                    event_label: m + "%",
                    value: m
                });
            }
        });
    }, { passive: true });

    // ══════════════════════════════════════════════════
    // 11. TEMPS PASSÉ SUR LA PAGE (30s / 1min / 2min / 5min)
    // ══════════════════════════════════════════════════
    [30, 60, 120, 300].forEach(function(secs) {
        setTimeout(function() {
            trackEvent("temps_sur_page", {
                event_category: "Engagement",
                event_label: secs >= 60 ? (secs / 60) + " min" : secs + "s",
                value: secs
            });
        }, secs * 1000);
    });

}

// ── Bannière de consentement ────────────────────────────────────────────────

function createBanner() {
    if (getConsent()) return; // déjà répondu → pas de bannière

    var banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.innerHTML = '\
        <div style="\
            position: fixed;\
            bottom: 0;\
            left: 0;\
            right: 0;\
            background: #1f2937;\
            color: white;\
            padding: 18px 24px;\
            z-index: 99999;\
            display: flex;\
            justify-content: space-between;\
            align-items: center;\
            gap: 16px;\
            flex-wrap: wrap;\
            box-shadow: 0 -4px 20px rgba(0,0,0,0.3);\
            font-family: sans-serif;\
            font-size: 14px;\
            line-height: 1.5;\
        ">\
            <div style="flex: 1; min-width: 220px;">\
                🍪 Ce site utilise des cookies pour mesurer l\'audience et améliorer votre expérience.\
                <a href="/politique-confidentialite.html"\
                   style="color:#93c5fd; margin-left:6px; text-decoration:underline;">\
                   En savoir plus\
                </a>\
            </div>\
            <div style="display:flex; gap:10px; flex-shrink:0;">\
                <button id="cookie-refuse" style="\
                    padding: 9px 18px;\
                    cursor: pointer;\
                    background: transparent;\
                    color: white;\
                    border: 1px solid #6b7280;\
                    border-radius: 6px;\
                    font-size: 14px;\
                ">Refuser</button>\
                <button id="cookie-accept" style="\
                    padding: 9px 18px;\
                    cursor: pointer;\
                    background: #0d6efd;\
                    color: white;\
                    border: none;\
                    border-radius: 6px;\
                    font-size: 14px;\
                    font-weight: 600;\
                ">Accepter</button>\
            </div>\
        </div>\
    ';

    document.body.appendChild(banner);

    document.getElementById("cookie-accept").onclick = function() {
        setConsent("accepted");
        document.getElementById("cookie-banner").remove();
        pushConsent(true);   // → signal GTM : consentement accordé
        initTracking();      // → démarrer le tracking des clics
    };

    document.getElementById("cookie-refuse").onclick = function() {
        setConsent("refused");
        document.getElementById("cookie-banner").remove();
        pushConsent(false);  // → signal GTM : consentement refusé
    };
}

// ── Initialisation ──────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function() {
    if (getConsent() === "accepted") {
        pushConsent(true);   // informe GTM du consentement existant
        initTracking();      // relance le tracking des clics
    }
    createBanner();          // affiche la bannière si pas encore répondu
});