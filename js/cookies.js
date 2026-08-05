// ==========================================
// Gestion du consentement des cookies
// Cabinet Dr Ziane Khodja
// Version 1.0
// ==========================================

const COOKIE_NAME = "drzk_cookie_consent";

function getConsent() {
    return localStorage.getItem(COOKIE_NAME);
}

function setConsent(value) {
    localStorage.setItem(COOKIE_NAME, value);
}

function createBanner() {

    if (getConsent()) return;

    const banner = document.createElement("div");

    banner.id = "cookie-banner";

    banner.innerHTML = `
        <div style="
            position:fixed;
            bottom:0;
            left:0;
            right:0;
            background:#1f2937;
            color:white;
            padding:20px;
            z-index:99999;
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:20px;
            flex-wrap:wrap;
            box-shadow:0 -5px 20px rgba(0,0,0,.25);
        ">

            <div style="flex:1;">
                🍪 Ce site utilise des cookies afin d'améliorer votre expérience et mesurer l'audience du site.
            </div>

            <div>

                <button id="cookie-refuse"
                style="padding:10px 18px;margin-right:10px;cursor:pointer;">
                Refuser
                </button>

                <button id="cookie-accept"
                style="padding:10px 18px;background:#0d6efd;color:white;border:none;border-radius:6px;cursor:pointer;">
                Accepter
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(banner);

    document.getElementById("cookie-accept").onclick = () => {

        setConsent("accepted");

        location.reload();

    };

    document.getElementById("cookie-refuse").onclick = () => {

        setConsent("refused");

        location.reload();

    };

}

document.addEventListener("DOMContentLoaded", createBanner);