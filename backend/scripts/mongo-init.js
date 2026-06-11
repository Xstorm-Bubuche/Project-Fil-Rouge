db = db.getSiblingDB("yplaza");

// Indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.properties.createIndex({ status: 1, "address.city": 1, price: 1 });
db.properties.createIndex({ agency_id: 1 });
db.transactions.createIndex({ property_id: 1 });
db.transactions.createIndex({ buyer_id: 1 });

// Agences seed
db.agencies.insertMany([
  {
    name: "Y-Plaza Aix-en-Provence (Siège)",
    code: "AIX-001",
    address: { street: "12 Cours Mirabeau", city: "Aix-en-Provence", postal_code: "13100", region: "Provence-Alpes-Côte d'Azur" },
    phone: "+33 4 42 00 00 01",
    email: "siege@yplaza.fr",
    is_active: true,
    agents_count: 0,
    active_listings_count: 0,
    created_at: new Date()
  },
  {
    name: "Y-Plaza Paris 8e",
    code: "PAR-001",
    address: { street: "45 Avenue des Champs-Élysées", city: "Paris", postal_code: "75008", region: "Île-de-France" },
    phone: "+33 1 40 00 00 01",
    email: "paris@yplaza.fr",
    is_active: true,
    agents_count: 0,
    active_listings_count: 0,
    created_at: new Date()
  },
  {
    name: "Y-Plaza Lyon Part-Dieu",
    code: "LYO-001",
    address: { street: "10 Rue de la République", city: "Lyon", postal_code: "69003", region: "Auvergne-Rhône-Alpes" },
    phone: "+33 4 72 00 00 01",
    email: "lyon@yplaza.fr",
    is_active: true,
    agents_count: 0,
    active_listings_count: 0,
    created_at: new Date()
  }
]);

print("✅ Initialisation MongoDB Y-Plaza terminée");
