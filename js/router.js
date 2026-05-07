// Router - Gestion de la navigation entre pages
class Router {
  constructor() {
    this.routes = {
      'home': '/index.html',
      'annonces': '/annonces.html',
      'bien': '/bien.html',
      'contact': '/contact.html',
      'login': '/login.html',
      'dashboard': '/dashboard.html'
    };
    this.currentPage = 'home';
  }

  navigate(page) {
    if (!this.routes[page]) {
      console.warn(`Page ${page} non trouvée`);
      return;
    }

    this.currentPage = page;
    window.location.href = this.routes[page];
  }

  getCurrentPage() {
    const path = window.location.pathname;
    for (const [page, route] of Object.entries(this.routes)) {
      if (path.includes(route) || (page === 'home' && path.endsWith('/'))) {
        return page;
      }
    }
    return 'home';
  }

  init() {
    // Active le bouton nav correspondant à la page actuelle
    const currentPage = this.getCurrentPage();
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('onclick')?.includes(currentPage)) {
        btn.classList.add('active');
      }
    });
  }
}

// Instance globale du routeur
window.router = new Router();

// Fonctions de navigation
function goTo(page) {
  window.router.navigate(page);
}
window.goTo = (page) => {
  router.navigate(page);
};

window.goHome = () => {
  router.navigate('home');
};

// Initialisation du routeur au chargement
document.addEventListener('DOMContentLoaded', () => {
  if (window.router) {
    window.router.init();
  }
});
