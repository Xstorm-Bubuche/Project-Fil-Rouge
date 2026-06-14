// Dashboard Page - Espace agent
class DashboardPage {
  constructor() {
    this.properties = [];
    this.stats = {
      activeProperties: 0,
      salesCompleted: 0,
      monthlyRevenue: 0,
      averageTime: 0
    };
    this.API_BASE = (window.location.hostname === 'localhost' && window.location.port === '8080')
      ? 'http://localhost:8000'
      : '';
  }

  renderKPIs() {
    return `
      <div class="kpi-card">
        <div class="kpi-label">Biens actifs</div>
        <div class="kpi-value">${this.stats.activeProperties}</div>
        <div class="kpi-delta up">↑ +3 ce mois</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Ventes réalisées</div>
        <div class="kpi-value">${this.stats.salesCompleted}</div>
        <div class="kpi-delta up">↑ +2 vs dernier mois</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">CA mensuel</div>
        <div class="kpi-value">${(this.stats.monthlyRevenue / 1000).toFixed(0)}K€</div>
        <div class="kpi-delta up">↑ +18%</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Délai moyen</div>
        <div class="kpi-value">${this.stats.averageTime} sem</div>
        <div class="kpi-delta down">↓ −0.5 sem</div>
      </div>
    `;
  }

  renderPropertyTable() {
    return `
      <table class="data-table">
        <thead>
          <tr>
            <th>Bien</th>
            <th>Type</th>
            <th>Prix</th>
            <th>Localisation</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          ${this.properties.slice(0, 5).map(p => `
            <tr>
              <td>${p.title}</td>
              <td>${p.type}</td>
              <td>${p.listingType === 'VENTE' ? p.price.toLocaleString() + ' €' : p.price + '€/mois'}</td>
              <td>${p.location}</td>
              <td><span class="status-badge status-${p.status.toLowerCase()}">${p.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  init() {
    // charger les biens (ex: nécessaires pour le dashboard)
    fetch(this.API_BASE + '/api/v1/properties?per_page=50')
      .then(res => res.json())
      .then(data => {
        this.properties = Array.isArray(data.items) ? data.items : [];
        // status mapping: backend uses enums like 'available' -> map to uppercase for display
        this.stats.activeProperties = this.properties.filter(p => p.status === 'available').length;
        // garde des valeurs factices pour les autres KPIs
        this.stats.salesCompleted = 7;
        this.stats.monthlyRevenue = 42000;
        this.stats.averageTime = 8.3;

        const kpiRow = document.querySelector('.kpi-row');
        if (kpiRow) {
          kpiRow.innerHTML = this.renderKPIs();
        }

        const tableWidget = document.querySelector('.table-widget');
        if (tableWidget) {
          tableWidget.innerHTML = this.renderPropertyTable();
        }
      })
      .catch(err => {
        console.error('Erreur récupération propriétés', err);
        const kpiRow = document.querySelector('.kpi-row');
        if (kpiRow) kpiRow.innerHTML = '<p>Impossible de charger les indicateurs pour le moment.</p>';
        const tableWidget = document.querySelector('.table-widget');
        if (tableWidget) tableWidget.innerHTML = '<p>Impossible de charger les biens pour le moment.</p>';
      });
  }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('dashboard.html')) {
    const dashboardPage = new DashboardPage();
    dashboardPage.init();
  }
});
