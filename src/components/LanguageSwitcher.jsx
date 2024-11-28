// src/components/LanguageSwitcher.jsx
export default function LanguageSwitcher({ currentLanguage, onLanguageChange }) {
  return (
    <select
      value={currentLanguage}
      onChange={(e) => onLanguageChange(e.target.value)}
      className="bg-white/20 rounded-lg px-2 py-1 text-white text-sm"
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="nl">Nederlands</option>
    </select>
  )
}