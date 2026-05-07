// Annonces Page - Liste des biens avec filtres
class AnnoncesPage {
  constructor() {
    this.allProperties = fakedb.properties;
    this.filteredProperties = [...this.allProperties];
    this.currentFilter = {
      type: '',
      listingType: '',
      priceMin: 0,
      priceMax: 1000000,
      surface: ''
    };
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
          <button class="card-fav">♡</button>
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

  filterProperties() {
    this.filteredProperties = this.allProperties.filter(prop => {
      if (this.currentFilter.type && prop.type !== this.currentFilter.type) return false;
      if (this.currentFilter.listingType && prop.listingType !== this.currentFilter.listingType) return false;
      if (prop.price < this.currentFilter.priceMin || prop.price > this.currentFilter.priceMax) return false;
      return true;
    });
    this.render();
  }

  applySort(sortType) {
    switch (sortType) {
      case 'recent':
        this.filteredProperties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-asc':
        this.filteredProperties.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredProperties.sort((a, b) => b.price - a.price);
        break;
      case 'surface':
        this.filteredProperties.sort((a, b) => b.surface - a.surface);
        break;
    }
    this.render();
  }

  render() {
    const listingsContainer = document.getElementById('listings');
    if (listingsContainer) {
      listingsContainer.innerHTML = this.filteredProperties.map(p => this.renderPropertyCard(p)).join('');
    }

    const countTag = document.getElementById('count-tag');
    if (countTag) {
      countTag.textContent = `${this.filteredProperties.length} biens disponibles`;
    }
  }

  init() {
    // Restaurer le filtre sélectionné depuis la page d'accueil
    const cachedType = sessionStorage.getItem('homeFilterType');
    if (cachedType) {
      this.currentFilter.type = cachedType;
      const typeFilter = document.querySelector('select[name="type"]');
      if (typeFilter) {
        typeFilter.value = cachedType;
      }
    }

    // Ajouter les event listeners
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => this.applySort(e.target.value));
    }

    // Ajouter les event listeners pour les filtres
    const typeFilter = document.querySelector('select[name="type"]');
    const listingTypeFilter = document.querySelector('select[name="listingType"]');

    if (typeFilter) {
      typeFilter.addEventListener('change', (e) => {
        this.currentFilter.type = e.target.value;
        this.filterProperties();
      });
    }

    if (listingTypeFilter) {
      listingTypeFilter.addEventListener('change', (e) => {
        this.currentFilter.listingType = e.target.value;
        this.filterProperties();
      });
    }

    this.filterProperties();
  }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('annonces.html')) {
    const annoncesPage = new AnnoncesPage();
    window.annoncesPage = annoncesPage; // Rendre accessible globalement
    annoncesPage.init();
  }
});

// Fonctions globales pour les filtres
window.filterProps = () => {
  if (window.annoncesPage) {
    window.annoncesPage.filterProperties();
  }
};

window.sortProps = (sortType) => {
  if (window.annoncesPage) {
    window.annoncesPage.applySort(sortType);
  }
};
