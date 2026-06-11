// Home Page - Page d'accueil
class HomePage {
  constructor() {
    this.properties = [];
  }

  renderHeroStats() {
    return `
      <div class="hero-stat"><strong>1 247</strong><small>biens actifs</small></div>
      <div class="hero-stat"><strong>12</strong><small>agences</small></div>
      <div class="hero-stat"><strong>94%</strong><small>satisfaction client</small></div>
      <div class="hero-stat"><strong>8.3</strong><small>délai moyen (sem.)</small></div>
    `;
  }

  renderPropertyCard(property) {
    const typeTag = property.listingType === 'VENTE' ? 'tag-sale' : 'tag-rent';
    const typeLabel = property.listingType === 'VENTE' ? 'Vente' : 'Location';
    const displayPrice = property.listingType === 'VENTE'
      ? `${property.price.toLocaleString()} €`
      : `${property.price}€/mois`;

    return `
      <div class="card" onclick="goTo('bien'); sessionStorage.setItem('propertyId', ${property.id})">
        <div class="card-img">
          <div class="card-tag ${typeTag}">${typeLabel}</div>
          <button class="card-fav" onclick="event.stopPropagation()">♡</button>
          <div class="card-img-placeholder">🏠</div>
        </div>
        <div class="card-body">
          <div class="card-price">${displayPrice}</div>
          <div class="card-title">${property.title}</div>
          <div class="card-loc">📍 ${property.location}</div>
          <div class="card-stats">
            <div class="card-stat"><strong>${property.surface}</strong> m²</div>
            <div class="card-stat"><strong>${property.rooms}</strong> pièces</div>
            <div class="card-stat"><strong>${property.bathrooms}</strong> SDB</div>
          </div>
        </div>
      </div>
    `;
  }

  renderAISection() {
    return `
      <div class="ai-section">
        <div class="ai-header"><div class="ai-dot"></div><span class="ai-title">Analyse IA · Tendances marché</span></div>
        <div class="ai-insights">
          <div class="ai-insight">
            <div class="ai-insight-label">Prix moyen/m² — Aix-en-Provence</div>
            <div class="ai-insight-value">4 820 €</div>
            <div class="ai-insight-sub trend-up">+3.2% sur 6 mois</div>
          </div>
          <div class="ai-insight">
            <div class="ai-insight-label">Zone la plus dynamique</div>
            <div class="ai-insight-value">Marseille 8ème</div>
            <div class="ai-insight-sub trend-up">+47 nouvelles annonces</div>
          </div>
          <div class="ai-insight">
            <div class="ai-insight-label">Prévision ventes Q3 2025</div>
            <div class="ai-insight-value">+12% estimé</div>
            <div class="ai-insight-sub trend-up">Modèle ARIMA · R²=0.91</div>
          </div>
        </div>
      </div>
    `;
  }

  init() {
    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) {
      statsContainer.innerHTML = this.renderHeroStats();
    }

    // charger les 6 dernières annonces
    fetch('/api/v1/properties?page=1&per_page=6')
      .then(res => res.json())
      .then(data => {
        this.properties = Array.isArray(data.items) ? data.items : [];
        const listingsContainer = document.getElementById('listings');
        if (listingsContainer) {
          listingsContainer.innerHTML = this.properties.map(p => this.renderPropertyCard(p)).join('');
        }
      })
      .catch(err => {
        console.error('Erreur récupération annonces', err);
        const listingsContainer = document.getElementById('listings');
        if (listingsContainer) listingsContainer.innerHTML = '<p>Impossible de charger les annonces pour le moment.</p>';
      });
  }
}

// Filtrer les chips de la page d'accueil et transmettre le filtre à la page annonces
window.filterChip = (element, type) => {
  document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
  element.classList.add('active');

  const filterType = type === 'Tous' ? '' : type.toUpperCase();
  sessionStorage.setItem('homeFilterType', filterType);
  goTo('annonces');
};

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
    const homePage = new HomePage();
    homePage.init();
  }
});
