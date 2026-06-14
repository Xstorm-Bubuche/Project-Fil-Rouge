class DashboardPage {
  constructor() {
    this.properties = [];
    this.currentView = 'overview';
  }

  // ── VUE GÉNÉRALE ──────────────────────────────────────────────
  renderOverview() {
    this.currentView = 'overview';
    const total = this.properties.length;
    const totalValue = this.properties.reduce((s, p) => s + (p.price || 0), 0);

    document.querySelector('.kpi-row').innerHTML = `
      <div class="kpi-card">
        <div class="kpi-label">Biens actifs</div>
        <div class="kpi-value">${total}</div>
        <div class="kpi-delta up">↑ +3 ce mois</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Valeur totale</div>
        <div class="kpi-value">${(totalValue / 1000000).toFixed(1)}M€</div>
        <div class="kpi-delta up">↑ +18%</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">CA mensuel</div>
        <div class="kpi-value">42K€</div>
        <div class="kpi-delta up">↑ +18%</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Délai moyen</div>
        <div class="kpi-value">8.3 sem</div>
        <div class="kpi-delta down">↓ −0.5 sem</div>
      </div>
    `;

    document.querySelector('.dash-content').querySelector('.table-widget').innerHTML = this.renderTable();
  }

  renderTable() {
    if (!this.properties.length) return '<p style="color:var(--muted);padding:1rem">Aucune annonce.</p>';
    return `
      <table class="data-table">
        <thead>
          <tr>
            <th>Bien</th><th>Type</th><th>Prix</th><th>Ville</th><th>Statut</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.properties.map(p => `
            <tr>
              <td>${p.title}</td>
              <td>${p.property_type || '–'}</td>
              <td style="color:var(--gold)">${p.price ? p.price.toLocaleString('fr-FR') + ' €' : '–'}</td>
              <td>${p.address?.city || '–'}</td>
              <td><span class="status-badge status-active">${p.status || 'active'}</span></td>
              <td>
                <button onclick='dashPage.deleteProperty(${JSON.stringify(p.id)}, ${JSON.stringify(p.title || '')})'
                  style="background:rgba(180,60,60,0.2);border:1px solid rgba(180,60,60,0.4);color:#e07070;padding:0.2rem 0.6rem;border-radius:4px;cursor:pointer;font-size:0.75rem;">
                  🗑 Supprimer
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // ── CRÉER UNE ANNONCE ─────────────────────────────────────────
  showCreateForm() {
    this.setActiveNav('create');
    document.querySelector('.dash-content').innerHTML = `
      <h2 style="font-family:'Playfair Display',serif;color:var(--gold);margin-bottom:1.5rem">Nouvelle annonce</h2>
      <div style="max-width:600px;background:var(--dark2);border:1px solid #2A2A2A;border-radius:8px;padding:1.5rem">
        <div id="create-result"></div>

        <label style="display:block;color:var(--muted);font-size:0.85rem;margin-bottom:0.25rem">Titre *</label>
        <input id="c-title" type="text" placeholder="Appartement 3 pièces - Paris" style="width:100%;background:var(--dark3);border:1px solid #3A3020;color:var(--text);padding:0.75rem;border-radius:4px;margin-bottom:1rem;font-family:'DM Sans'">

        <label style="display:block;color:var(--muted);font-size:0.85rem;margin-bottom:0.25rem">Description</label>
        <textarea id="c-desc" placeholder="Description du bien..." rows="3" style="width:100%;background:var(--dark3);border:1px solid #3A3020;color:var(--text);padding:0.75rem;border-radius:4px;margin-bottom:1rem;font-family:'DM Sans'"></textarea>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
          <div>
            <label style="display:block;color:var(--muted);font-size:0.85rem;margin-bottom:0.25rem">Type de bien *</label>
            <select id="c-type" style="width:100%;background:var(--dark3);border:1px solid #3A3020;color:var(--text);padding:0.75rem;border-radius:4px;font-family:'DM Sans'">
              <option value="apartment">Appartement</option>
              <option value="house">Maison</option>
              <option value="office">Bureau</option>
              <option value="commercial">Commerce</option>
              <option value="land">Terrain</option>
            </select>
          </div>
          <div>
            <label style="display:block;color:var(--muted);font-size:0.85rem;margin-bottom:0.25rem">Type d'annonce *</label>
            <select id="c-listing" style="width:100%;background:var(--dark3);border:1px solid #3A3020;color:var(--text);padding:0.75rem;border-radius:4px;font-family:'DM Sans'">
              <option value="sale">Vente</option>
              <option value="rental">Location</option>
            </select>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem">
          <div>
            <label style="display:block;color:var(--muted);font-size:0.85rem;margin-bottom:0.25rem">Prix (€) *</label>
            <input id="c-price" type="number" placeholder="250000" style="width:100%;background:var(--dark3);border:1px solid #3A3020;color:var(--text);padding:0.75rem;border-radius:4px;font-family:'DM Sans'">
          </div>
          <div>
            <label style="display:block;color:var(--muted);font-size:0.85rem;margin-bottom:0.25rem">Surface (m²) *</label>
            <input id="c-surface" type="number" placeholder="65" style="width:100%;background:var(--dark3);border:1px solid #3A3020;color:var(--text);padding:0.75rem;border-radius:4px;font-family:'DM Sans'">
          </div>
          <div>
            <label style="display:block;color:var(--muted);font-size:0.85rem;margin-bottom:0.25rem">Pièces</label>
            <input id="c-rooms" type="number" placeholder="3" style="width:100%;background:var(--dark3);border:1px solid #3A3020;color:var(--text);padding:0.75rem;border-radius:4px;font-family:'DM Sans'">
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
          <div>
            <label style="display:block;color:var(--muted);font-size:0.85rem;margin-bottom:0.25rem">Ville *</label>
            <input id="c-city" type="text" placeholder="Marseille" style="width:100%;background:var(--dark3);border:1px solid #3A3020;color:var(--text);padding:0.75rem;border-radius:4px;font-family:'DM Sans'">
          </div>
          <div>
            <label style="display:block;color:var(--muted);font-size:0.85rem;margin-bottom:0.25rem">Code postal *</label>
            <input id="c-postal" type="text" placeholder="13000" style="width:100%;background:var(--dark3);border:1px solid #3A3020;color:var(--text);padding:0.75rem;border-radius:4px;font-family:'DM Sans'">
          </div>
        </div>

        <button onclick="dashPage.submitCreate()"
          style="background:var(--gold);color:var(--dark);border:none;padding:0.75rem 2rem;border-radius:4px;font-family:'DM Sans';font-weight:500;cursor:pointer;font-size:0.95rem">
          ✚ Créer l'annonce
        </button>
      </div>
    `;
  }

  async submitCreate() {
    const title = document.getElementById('c-title').value.trim();
    const city = document.getElementById('c-city').value.trim();
    const postal = document.getElementById('c-postal').value.trim();
    const price = parseFloat(document.getElementById('c-price').value);
    const surface = parseFloat(document.getElementById('c-surface').value);
    const result = document.getElementById('create-result');

    if (!title || !city || !postal || !price || !surface) {
      result.innerHTML = '<p style="color:#e07070;margin-bottom:1rem">⚠ Remplis tous les champs obligatoires.</p>';
      return;
    }

    const body = {
      title,
      description: document.getElementById('c-desc').value,
      property_type: document.getElementById('c-type').value,
      listing_type: document.getElementById('c-listing').value,
      address: { street: '', city, postal_code: postal, department: '', region: '' },
      surface_m2: surface,
      rooms: parseInt(document.getElementById('c-rooms').value) || 1,
      price,
    };

    result.innerHTML = '<p style="color:var(--muted);margin-bottom:1rem">Création en cours...</p>';

    try {
      const res = await window.authFetch('/api/v1/properties/', { method: 'POST', body: JSON.stringify(body) });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        result.innerHTML = `<p style="color:#e07070;margin-bottom:1rem">Erreur: ${err.detail || res.statusText}</p>`;
        return;
      }
      result.innerHTML = '<p style="color:#6DBD84;margin-bottom:1rem">✓ Annonce créée avec succès !</p>';
      // Vide les champs
      ['c-title','c-desc','c-city','c-postal','c-price','c-surface','c-rooms'].forEach(id => {
        document.getElementById(id).value = '';
      });
      // Recharge la liste
      await this.loadProperties();
    } catch (e) {
      result.innerHTML = '<p style="color:#e07070;margin-bottom:1rem">Erreur réseau.</p>';
    }
  }

  // ── SUPPRIMER ─────────────────────────────────────────────────
  async deleteProperty(id, title) {
    if (!confirm(`Supprimer "${title}" ?`)) return;
    try {
      const res = await window.authFetch(`/api/v1/properties/${id}`, { method: 'DELETE' });
      if (res.ok || res.status === 204) {
        this.properties = this.properties.filter(p => p.id !== id);
        if (this.currentView === 'list') this.showList();
        else this.renderOverview();
      } else {
        alert('Erreur lors de la suppression.');
      }
    } catch (e) {
      alert('Erreur réseau.');
    }
  }

  // ── NAVIGATION SIDEBAR ────────────────────────────────────────
  setActiveNav(key) {
    document.querySelectorAll('.dash-nav-item').forEach(el => el.classList.remove('active'));
    const items = document.querySelectorAll('.dash-nav-item');
    const map = { overview: 0, create: 1, list: 2 };
    if (items[map[key]]) items[map[key]].classList.add('active');
  }

  showList() {
    this.currentView = 'list';
    this.setActiveNav('list');
    document.querySelector('.dash-content').innerHTML = `
      <h2 style="font-family:'Playfair Display',serif;color:var(--gold);margin-bottom:1.5rem">Mes annonces</h2>
      <div class="table-widget">${this.renderTable()}</div>
    `;
  }

  // ── CHARGEMENT ────────────────────────────────────────────────
  async loadProperties() {
    try {
      const res = await window.authFetch('/api/v1/properties/');
      const data = await res.json();
      this.properties = Array.isArray(data.items) ? data.items : [];
    } catch (e) {
      this.properties = [];
    }
  }

  async init() {
    // Vérifie la connexion
    if (!localStorage.getItem('access_token')) {
      window.location.href = '/login.html';
      return;
    }

    // Reconstruit le contenu de base si on arrive depuis la vue HTML statique
    document.querySelector('.dash-content').innerHTML = `
      <div class="kpi-row"></div>
      <div class="ai-section">
        <div class="ai-header"><div class="ai-dot"></div><span class="ai-title">Prévisions & Recommandations IA</span></div>
        <div class="ai-insights">
          <div class="ai-insight"><div class="ai-insight-label">Biens à repositionner</div><div class="ai-insight-value">3 annonces</div><div class="ai-insight-sub">Surpassent le marché de +8%</div></div>
          <div class="ai-insight"><div class="ai-insight-label">Leads chauds</div><div class="ai-insight-value">5 prospects</div><div class="ai-insight-sub trend-up">Probabilité achat > 70%</div></div>
          <div class="ai-insight"><div class="ai-insight-label">Meilleure zone</div><div class="ai-insight-value">Marseille Sud</div><div class="ai-insight-sub trend-up">Demande +34% YoY</div></div>
        </div>
      </div>
      <div class="dash-grid3">
        <div class="widget"><div class="widget-title">Mes biens récents</div><div class="table-widget"></div></div>
        <div class="widget">
          <div class="widget-title">Répartition par type</div>
          <div class="pie-visual"></div>
          <div class="pie-legend">
            <div class="pie-row"><div class="pie-dot" style="background:var(--gold)"></div><div class="pie-name">Appartements</div><div class="pie-pct">38%</div></div>
            <div class="pie-row"><div class="pie-dot" style="background:var(--accent)"></div><div class="pie-name">Maisons</div><div class="pie-pct">24%</div></div>
            <div class="pie-row"><div class="pie-dot" style="background:#4A6090"></div><div class="pie-name">Bureaux</div><div class="pie-pct">17%</div></div>
            <div class="pie-row"><div class="pie-dot" style="background:var(--dark3)"></div><div class="pie-name">Autres</div><div class="pie-pct">21%</div></div>
          </div>
        </div>
      </div>
    `;

    // Bind sidebar
    const items = document.querySelectorAll('.dash-nav-item');
    if (items[0]) items[0].onclick = () => { this.setActiveNav('overview'); this.init(); };
    if (items[1]) items[1].onclick = () => this.showCreateForm();
    if (items[2]) items[2].onclick = () => this.showList();

    await this.loadProperties();
    this.renderOverview();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.dashPage = new DashboardPage();
  window.dashPage.init();
});