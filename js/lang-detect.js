// Détection automatique de la langue système au premier chargement
function detectAndSetLang() {
  // Ne fait rien si l'utilisateur a déjà choisi une langue manuellement
  if (localStorage.getItem('zk_lang_choice')) return;

  const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
  if (browserLang.startsWith('ar')) {
    document.body.classList.remove('lang-fr');
    document.body.classList.add('lang-ar');
    document.documentElement.setAttribute('lang', 'ar');
    document.documentElement.setAttribute('dir', 'rtl');
    if (typeof updateSliderPosition === 'function') {
      updateSliderPosition();
    }
  }
}
detectAndSetLang();
