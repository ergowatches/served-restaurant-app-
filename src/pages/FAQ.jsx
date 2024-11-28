import { useNavigate } from 'react-router-dom'

export default function FAQ() {
  const navigate = useNavigate()
  
  const faqItems = [
    {
      question: "How does ordering work?",
      answer: "Scan the QR code at your table, select your items, and place your order. Our staff will bring your order to your table number."
    },
    {
      question: "Can I modify my order after placing it?",
      answer: "Please speak with our staff directly for any modifications after placing your order."
    },
    {
      question: "How does the split bill feature work?",
      answer: "On the payment page, you can split the total bill equally among multiple people. You can also choose specific items for each person."
    },
    {
      question: "Do you accommodate dietary restrictions?",
      answer: "Yes! Use our allergen filter at the top of the menu to highlight items containing specific allergens. Our staff can also help with modifications when possible."
    },
    {
      question: "Are prices inclusive of tax?",
      answer: "All prices shown include VAT/sales tax."
    },
    {
      question: "How do I apply a discount code?",
      answer: "Enter your discount code on the payment page before proceeding to payment. Valid codes will be automatically applied to your total."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and mobile payment methods."
    },
    {
      question: "Can I place a group order?",
      answer: "Yes! There's no limit to the number of items you can order. For very large groups, please speak with our staff."
    },
    {
      question: "How long does food preparation take?",
      answer: "Preparation times vary by dish. Appetizers typically take 10-15 minutes, main courses 20-25 minutes during regular hours."
    },
    {
      question: "What if I have a problem with my order?",
      answer: "Please speak with any staff member or use the call button at your table. We're here to help!"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-pink-600">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="text-white font-medium flex items-center"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-white">FAQ</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.question}
                </h3>
                <p className="text-gray-600">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}