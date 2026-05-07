// Property Detail Page - Fiche détail d'un bien
class PropertyDetailPage {
  constructor(propertyId) {
    this.property = fakedb.properties.find(p => p.id === parseInt(propertyId));
  }

  renderSpecs() {
    if (!this.property) return '';
    return `
      <div class="spec-item">
        <label>Surface</label>
        <strong>${this.property.surface} m²</strong>
      </div>
      <div class="spec-item">
        <label>Pièces</label>
        <strong>${this.property.rooms}</strong>
      </div>
      <div class="spec-item">
        <label>Salles de bain</label>
        <strong>${this.property.bathrooms}</strong>
      </div>
      <div class="spec-item">
        <label>Type</label>
        <strong>${this.property.type}</strong>
      </div>
      <div class="spec-item">
        <label>Statut</label>
        <strong>${this.property.status}</strong>
      </div>
      <div class="spec-item">
        <label>Agence</label>
        <strong>${this.property.agencyCity}</strong>
      </div>
    `;
  }

  renderAISection() {
    return `
      <div class="ai-section" style="margin-top:0;">
        <div class="ai-header"><div class="ai-dot"></div><span class="ai-title">Valorisation automatique</span></div>
        <div class="ai-insights">
          <div class="ai-insight"><div class="ai-insight-label">Estimation marché</div><div class="ai-insight-value">375 000 – 395 000 €</div><div class="ai-insight-sub">Modèle gradient boosting</div></div>
          <div class="ai-insight"><div class="ai-insight-label">Délai de vente estimé</div><div class="ai-insight-value">6 – 10 semaines</div><div class="ai-insight-sub trend-up">Marché favorable</div></div>
          <div class="ai-insight"><div class="ai-insight-label">Score attractivité</div><div class="ai-insight-value">87 / 100</div><div class="ai-insight-sub trend-up">Top 15% du secteur</div></div>
        </div>
      </div>
    `;
  }

  init() {
    if (!this.property) {
      document.body.innerHTML = '<div class="section"><p>Bien non trouvé</p></div>';
      return;
    }

    // Remplir les données du bien
    document.getElementById('detail-title').textContent = this.property.title;
    document.getElementById('detail-loc').textContent = `📍 ${this.property.location}`;
    document.getElementById('detail-price').textContent = 
      this.property.listingType === 'VENTE' 
        ? `${this.property.price.toLocaleString()} €` 
        : `${this.property.price}€/mois`;
    document.getElementById('detail-desc').textContent = this.property.description;
    document.getElementById('detail-specs').innerHTML = this.renderSpecs();
    
    // Ajouter la section AI
    const detailMain = document.querySelector('.detail-main');
    if (detailMain) {
      detailMain.innerHTML += this.renderAISection();
    }
  }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('bien.html')) {
    const propertyId = sessionStorage.getItem('propertyId') || 1;
    const detailPage = new PropertyDetailPage(propertyId);
    detailPage.init();
  }
});
