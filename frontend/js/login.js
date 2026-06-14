// Login handler moved out of inline HTML to a dedicated file
// Exposes `handleLogin` globally so the existing form `onsubmit` attribute still works.
window.handleLogin = async function (e) {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector('input[type="email"]').value.trim();
  const password = form.querySelector('input[type="password"]').value;

  try {
    // compute API base: if the page is served from the frontend nginx (port 8080)
    // we need to call the backend on port 8000. When the page is served by the
    // backend (port 8000) a relative path is fine.
    const API_BASE = '';

    const res = await fetch(API_BASE + '/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert('Erreur connexion: ' + (err.detail || res.statusText));
      return;
    }

    const data = await res.json();
    // store tokens
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    // redirect to dashboard
    if (window.goTo) window.goTo('dashboard');
    else window.location.href = '/dashboard.html';
  } catch (err) {
    console.error('Login fetch error', err);
    alert('Erreur réseau lors de la connexion');
  }
};

// As a fallback, attach the handler to the form if the page doesn't use onsubmit attr
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.login-form');
  if (form && !form.getAttribute('onsubmit')) {
    form.addEventListener('submit', window.handleLogin);
  }
});
