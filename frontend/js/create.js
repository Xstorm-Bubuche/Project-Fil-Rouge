document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('createForm');
  const result = document.getElementById('result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const body = {
      title: fd.get('title'),
      description: fd.get('description'),
      property_type: fd.get('property_type'),
      listing_type: fd.get('listing_type'),
      address: {
        street: '',
        city: fd.get('city'),
        postal_code: fd.get('postal_code'),
        department: '',
        region: '',
      },
      surface_m2: parseFloat(fd.get('surface_m2')),
      price: parseFloat(fd.get('price')),
    };

    try {
      const res = await fetch('/api/v1/properties/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(body),
    });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        result.innerHTML = '<p style="color:red">Erreur: ' + (err.detail || res.statusText) + '</p>';
        return;
      }
      const data = await res.json();
      result.innerHTML = '<p style="color:green">Annonce créée (id: ' + data.id + ')</p>';
    } catch (e) {
      console.error(e);
      result.innerHTML = '<p style="color:red">Erreur réseau</p>';
    }
  });
});