// src/contexts/LanguageContext.jsx
import { createContext, useContext, useState } from 'react'

const translations = {
  en: {
    header: {
      welcome: "SERVED",
      table: "Table"
    },
    categories: {
      all: "All",
      appetizers: "Appetizers",
      mains: "Main Course",
      drinks: "Drinks",
      desserts: "Desserts"
    },
    cart: {
      empty: "Your cart is empty",
      total: "Total",
      viewCart: "View Cart",
      placeOrder: "Place Order",
      remove: "Remove",
      close: "Close"
    },
    add: "Add"
  },
  es: {
    header: {
      welcome: "SERVED",
      table: "Mesa"
    },
    categories: {
      all: "Todo",
      appetizers: "Entrantes",
      mains: "Platos Principales",
      drinks: "Bebidas",
      desserts: "Postres"
    },
    cart: {
      empty: "Tu carrito está vacío",
      total: "Total",
      viewCart: "Ver Carrito",
      placeOrder: "Realizar Pedido",
      remove: "Eliminar",
      close: "Cerrar"
    },
    add: "Añadir"
  },
  nl: {
    header: {
      welcome: "SERVED",
      table: "Tafel"
    },
    categories: {
      all: "Alles",
      appetizers: "Voorgerechten",
      mains: "Hoofdgerechten",
      drinks: "Dranken",
      desserts: "Desserts"
    },
    cart: {
      empty: "Je winkelwagen is leeg",
      total: "Totaal",
      viewCart: "Bekijk Winkelwagen",
      placeOrder: "Bestelling Plaatsen",
      remove: "Verwijderen",
      close: "Sluiten"
    },
    add: "Toevoegen"
  }
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}