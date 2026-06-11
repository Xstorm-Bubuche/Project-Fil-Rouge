// Fake Database - Fausse base de données pour le développement
const fakedb = {
  properties: [
    {
      id: 1,
      title: 'Appartement T4 lumineux',
      type: 'APPARTEMENT',
      listingType: 'VENTE',
      price: 380000,
      location: 'Aix-en-Provence, 13100',
      surface: 95,
      rooms: 4,
      bathrooms: 2,
      description: 'Magnifique appartement T4 entièrement rénové, situé dans un immeuble de standing au cœur du quartier Mazarin. Prestations haut de gamme, parquet en chêne, cuisine équipée sur mesure, double vitrage. Proche de toutes les commodités, transports et commerces. Copropriété bien entretenue, charges réduites.',
      agent: 'Marie Renaud',
      agencyCity: 'Aix-en-Provence',
      status: 'ACTIF',
      createdAt: '2025-05-01'
    },
    {
      id: 2,
      title: 'Maison moderne Marseille',
      type: 'MAISON',
      listingType: 'VENTE',
      price: 550000,
      location: 'Marseille, 13008',
      surface: 150,
      rooms: 5,
      bathrooms: 3,
      description: 'Superbe maison T5 avec jardin et terrasse panoramique. Parfait pour une famille, proche des écoles.',
      agent: 'Jean Dupont',
      agencyCity: 'Marseille',
      status: 'ACTIF',
      createdAt: '2025-04-28'
    },
    {
      id: 3,
      title: 'Bureau moderne centre-ville',
      type: 'BUREAU',
      listingType: 'LOCATION',
      price: 1200,
      location: 'Lyon, 69002',
      surface: 120,
      rooms: 3,
      bathrooms: 1,
      description: 'Bureau professionnel bien équipé, accès facilité, parking disponible.',
      agent: 'Sophie Martin',
      agencyCity: 'Lyon',
      status: 'ACTIF',
      createdAt: '2025-05-03'
    },
    {
      id: 4,
      title: 'Commerce face de rue',
      type: 'COMMERCE',
      listingType: 'LOCATION',
      price: 1800,
      location: 'Toulouse, 31000',
      surface: 80,
      rooms: 0,
      bathrooms: 1,
      description: 'Local commercial idéal pour boutique, forte affluence, parking client.',
      agent: 'Pierre Moreau',
      agencyCity: 'Toulouse',
      status: 'ACTIF',
      createdAt: '2025-04-25'
    },
    {
      id: 5,
      title: 'Terrain constructible Provence',
      type: 'TERRAIN',
      listingType: 'VENTE',
      price: 280000,
      location: 'Aix-en-Provence, 13090',
      surface: 5000,
      rooms: 0,
      bathrooms: 0,
      description: 'Magnifique terrain constructible de 5000 m², vue sur la montagne, viabilisé.',
      agent: 'Marie Renaud',
      agencyCity: 'Aix-en-Provence',
      status: 'ACTIF',
      createdAt: '2025-05-02'
    }
  ],
  users: [
    {
      id: 1,
      email: 'marie.renaud@yplaza.fr',
      password: 'password123',
      firstName: 'Marie',
      lastName: 'Renaud',
      role: 'AGENT',
      agencyCity: 'Aix-en-Provence'
    },
    {
      id: 2,
      email: 'admin@yplaza.fr',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'Admin',
      role: 'ADMIN',
      agencyCity: 'Aix-en-Provence'
    }
  ],
  contacts: []
};

// Export pour utilisation dans d'autres modules
window.fakedb = fakedb;
