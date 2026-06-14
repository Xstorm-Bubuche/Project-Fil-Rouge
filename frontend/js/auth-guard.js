(function () {
  const token = localStorage.getItem('access_token');

  document.addEventListener('DOMContentLoaded', () => {
    const badge = document.querySelector('.badge');
    const avatar = document.querySelector('.avatar');
    const navLinks = document.querySelector('.nav-links');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role || 'client';
        if (badge) badge.textContent = role;
        if (avatar) avatar.textContent = '✓';

        // Bloque l'accès au dashboard pour les clients
        if (role === 'client' && window.location.pathname.includes('dashboard')) {
          window.location.href = '/index.html';
          return;
        }

        // Bouton Dashboard uniquement pour agent/admin
        if (role !== 'client' && navLinks && !navLinks.querySelector('[data-dashboard]')) {
          const dashBtn = document.createElement('button');
          dashBtn.className = 'nav-btn';
          dashBtn.setAttribute('data-dashboard', '1');
          dashBtn.setAttribute('onclick', "goTo('dashboard')");
          dashBtn.textContent = 'Dashboard';
          const loginBtn = [...navLinks.querySelectorAll('.nav-btn')].find(b => b.getAttribute('onclick')?.includes('login'));
          if (loginBtn) navLinks.insertBefore(dashBtn, loginBtn);
          else navLinks.appendChild(dashBtn);
        }
      } catch (e) {}

      // Remplace Connexion par Déconnexion
      document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.getAttribute('onclick')?.includes('login')) {
          btn.textContent = 'Déconnexion';
          btn.onclick = () => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login.html';
          };
        }
      });
    }
  });

  // Fetch authentifié
  window.authFetch = (url, options = {}) => {
    const t = localStorage.getItem('access_token');
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(t ? { 'Authorization': `Bearer ${t}` } : {})
      }
    });
  };
})();