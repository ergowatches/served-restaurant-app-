// src/data/menuData.js

// First, export allergen types
export const allergenTypes = [
  { id: 'gluten', name: { en: 'Gluten', es: 'Gluten', nl: 'Gluten' } },
  { id: 'dairy', name: { en: 'Dairy', es: 'Lácteos', nl: 'Zuivel' } },
  { id: 'nuts', name: { en: 'Nuts', es: 'Frutos Secos', nl: 'Noten' } },
  { id: 'shellfish', name: { en: 'Shellfish', es: 'Mariscos', nl: 'Schaaldieren' } },
  { id: 'eggs', name: { en: 'Eggs', es: 'Huevos', nl: 'Eieren' } },
  { id: 'soy', name: { en: 'Soy', es: 'Soja', nl: 'Soja' } }
]

// Then export menu categories
export const menuCategories = [
  {
    id: 'appetizers',
    name: {
      en: "Appetizers",
      es: "Entrantes",
      nl: "Voorgerechten"
    },
    items: [
      {
        id: 1,
        name: {
          en: "Truffle Fries",
          es: "Papas Fritas con Trufa",
          nl: "Truffel Friet"
        },
        price: 8.99,
        description: {
          en: "Hand-cut fries with truffle oil and parmesan",
          es: "Papas fritas cortadas a mano con aceite de trufa y parmesano",
          nl: "Handgesneden friet met truffelolie en parmezaanse kaas"
        },
        allergens: ['gluten', 'dairy']
      },
      {
        id: 2,
        name: {
          en: "Burrata",
          es: "Burrata",
          nl: "Burrata"
        },
        price: 12.99,
        description: {
          en: "Fresh burrata with heirloom tomatoes and basil",
          es: "Burrata fresca con tomates heredados y albahaca",
          nl: "Verse burrata met erfgoed tomaten en basilicum"
        },
        allergens: ['dairy']
      },
      {
        id: 3,
        name: {
          en: "Tuna Tartare",
          es: "Tartar de Atún",
          nl: "Tonijn Tartaar"
        },
        price: 16.99,
        description: {
          en: "Fresh tuna with avocado and wasabi aioli",
          es: "Atún fresco con aguacate y aioli de wasabi",
          nl: "Verse tonijn met avocado en wasabi aioli"
        },
        allergens: ['eggs', 'soy']
      }
    ]
  },
  {
    id: 'mains',
    name: {
      en: "Main Course",
      es: "Platos Principales",
      nl: "Hoofdgerechten"
    },
    items: [
      {
        id: 4,
        name: {
          en: "Wagyu Burger",
          es: "Hamburguesa Wagyu",
          nl: "Wagyu Burger"
        },
        price: 24.99,
        description: {
          en: "Premium wagyu beef with caramelized onions",
          es: "Carne wagyu premium con cebollas caramelizadas",
          nl: "Premium wagyu rundvlees met gekarameliseerde uien"
        },
        allergens: ['gluten', 'dairy', 'eggs']
      },
      {
        id: 5,
        name: {
          en: "Lobster Pasta",
          es: "Pasta con Langosta",
          nl: "Kreeft Pasta"
        },
        price: 32.99,
        description: {
          en: "Fresh lobster with handmade linguine",
          es: "Langosta fresca con linguine hecho a mano",
          nl: "Verse kreeft met huisgemaakte linguine"
        },
        allergens: ['gluten', 'dairy', 'shellfish', 'eggs']
      }
    ]
  },
  {
    id: 'drinks',
    name: {
      en: "Drinks",
      es: "Bebidas",
      nl: "Dranken"
    },
    items: [
      {
        id: 6,
        name: {
          en: "Craft Beer",
          es: "Cerveza Artesanal",
          nl: "Speciaal Bier"
        },
        price: 7.99,
        description: {
          en: "Selection of local craft beers",
          es: "Selección de cervezas artesanales locales",
          nl: "Selectie van lokale speciaalbieren"
        },
        allergens: ['gluten']
      },
      {
        id: 7,
        name: {
          en: "House Wine",
          es: "Vino de la Casa",
          nl: "Huiswijn"
        },
        price: 8.99,
        description: {
          en: "Red or white wine selection",
          es: "Selección de vino tinto o blanco",
          nl: "Selectie rode of witte wijn"
        },
        allergens: []
      }
    ]
  },
  {
    id: 'desserts',
    name: {
      en: "Desserts",
      es: "Postres",
      nl: "Desserts"
    },
    items: [
      {
        id: 8,
        name: {
          en: "Chocolate Cake",
          es: "Pastel de Chocolate",
          nl: "Chocoladetaart"
        },
        price: 8.99,
        description: {
          en: "Rich chocolate cake with vanilla ice cream",
          es: "Pastel de chocolate con helado de vainilla",
          nl: "Rijke chocoladetaart met vanille-ijs"
        },
        allergens: ['gluten', 'dairy', 'eggs']
      },
      {
        id: 9,
        name: {
          en: "Crème Brûlée",
          es: "Crema Catalana",
          nl: "Crème Brûlée"
        },
        price: 7.99,
        description: {
          en: "Classic French vanilla custard",
          es: "Crema catalana clásica",
          nl: "Klassieke Franse vanillevla"
        },
        allergens: ['dairy', 'eggs']
      }
    ]
  }
]