import { MessageSquare, X } from 'lucide-react';
import { ChatComponent } from './ChatComponent';

interface FloatingChatProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function FloatingChat({ isOpen, onToggle }: FloatingChatProps) {

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4">
          <ChatComponent />
        </div>
      )}
    </>
  );
}