import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '1234567890';
  const message = import.meta.env.VITE_WHATSAPP_MESSAGE || 'Hello, I would like to book an appointment';

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all hover:scale-110 z-50 group"
      aria-label="Contact us on WhatsApp"
    >
      {/* <MessageCircle className="w-6 h-6" /> */}
      <img src="https://cdn-icons-png.flaticon.com/512/3670/3670051.png" alt="whatsapp" className="w-8 h-8" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
      {/* <img src="https://cdn-icons-png.flaticon.com/512/3670/3670051.png" alt="" /> */}
        Chat with us!
      </span>
    </button>
  );
}
