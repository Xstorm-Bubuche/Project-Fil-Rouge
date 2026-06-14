class AnnoncesPage {
  constructor() {
    this.allProperties = [];
    this.filteredProperties = [];
    this.currentFilter = { type: '', listingType: '' };
  }

  renderPropertyCard(p) {
    const isVente = p.listing_type === 'VENTE' || p.listing_type === 'sale' || p.listing_type === 'SALE';
    const typeTag = isVente ? 'tag-sale' : 'tag-rent';
    const typeLabel = isVente ? 'Vente' : 'Location';
    const price = p.price ? p.price.toLocaleString('fr-FR') + ' €' + (isVente ? '' : '/mois') : 'Prix NC';
    const city = p.address?.city || '';
    const surface = p.surface_m2 || '–';
    const rooms = p.rooms || '–';

    return `
      <div class="card" onclick="sessionStorage.setItem('propertyId','${p.id}'); goTo('bien')">
        <div class="card-img">
          <div class="card-tag ${typeTag}">${typeLabel}</div>
          <button class="card-fav">♡</button>
          <div class="card-img-placeholder">🏠</div>
        </div>
        <div class="card-body">
          <div class="card-price">${price}</div>
          <div class="card-title">${p.title}</div>
          <div class="card-loc">📍 ${city}</div>
          <div class="card-stats">
            <div class="card-stat"><strong>${surface}</strong> m²</div>
            <div class="card-stat"><strong>${rooms}</strong> pièces</div>
          </div>
        </div>
      </div>
    `;
  }

  filterProperties() {
    const typeVal = document.getElementById('filter-type')?.value || '';
    const listingVal = document.getElementById('filter-listing')?.value || '';

    this.filteredProperties = this.allProperties.filter(p => {
      const pType = (p.property_type || '').toUpperCase();
      const pListing = (p.listing_type || '').toUpperCase();
      if (typeVal && pType !== typeVal) return false;
      if (listingVal && pListing !== listingVal) return false;
      return true;
    });
    this.render();
  }

  applySort(sortType) {
    switch (sortType) {
      case 'price-asc': this.filteredProperties.sort((a, b) => a.price - b.price); break;
      case 'price-desc': this.filteredProperties.sort((a, b) => b.price - a.price); break;
      case 'surface': this.filteredProperties.sort((a, b) => (b.surface_m2||0) - (a.surface_m2||0)); break;
      default: this.filteredProperties.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    this.render();
  }

  render() {
    const grid = document.getElementById('listings');
    const count = document.getElementById('count-tag');
    if (grid) grid.innerHTML = this.filteredProperties.length
      ? this.filteredProperties.map(p => this.renderPropertyCard(p)).join('')
      : '<p style="color:var(--muted); padding:2rem">Aucun bien trouvé.</p>';
    if (count) count.textContent = `${this.filteredProperties.length} biens disponibles`;
  }

  init() {
    fetch('/api/v1/properties/')
      .then(r => r.json())
      .then(data => {
        this.allProperties = Array.isArray(data.items) ? data.items : [];
        this.filteredProperties = [...this.allProperties];
        this.render();
      })
      .catch(() => {
        const grid = document.getElementById('listings');
        if (grid) grid.innerHTML = '<p style="color:var(--muted)">Impossible de charger les annonces.</p>';
      });

    document.getElementById('filter-type')?.addEventListener('change', () => this.filterProperties());
    document.getElementById('filter-listing')?.addEventListener('change', () => this.filterProperties());
    document.querySelector('.sort-select')?.addEventListener('change', e => this.applySort(e.target.value));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.annoncesPage = new AnnoncesPage();
  window.annoncesPage.init();
});

window.sortProps = (v) => window.annoncesPage?.applySort(v);