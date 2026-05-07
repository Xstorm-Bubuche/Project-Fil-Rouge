// Dashboard Page - Espace agent
class DashboardPage {
  constructor() {
    this.properties = fakedb.properties;
    this.stats = {
      activeProperties: this.properties.filter(p => p.status === 'ACTIF').length,
      salesCompleted: 7,
      monthlyRevenue: 42000,
      averageTime: 8.3
    };
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
    const kpiRow = document.querySelector('.kpi-row');
    if (kpiRow) {
      kpiRow.innerHTML = this.renderKPIs();
    }

    // Ajouter le tableau des biens
    const tableWidget = document.querySelector('.table-widget');
    if (tableWidget) {
      tableWidget.innerHTML = this.renderPropertyTable();
    }
  }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('dashboard.html')) {
    const dashboardPage = new DashboardPage();
    dashboardPage.init();
  }
});
