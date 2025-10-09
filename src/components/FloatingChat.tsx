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
        <div className="fixed bottom-24 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="flex flex-col h-[600px]">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 shrink-0">
              <h3 className="font-semibold text-lg">AI Learning Assistant</h3>
              <p className="text-sm text-blue-100">How can I help you today?</p>
            </div>
            <div className="flex-1 min-h-0">
              <ChatComponent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}