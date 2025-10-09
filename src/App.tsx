import { useEffect, useState } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { LearningCategories } from './components/LearningCategories';
import { FeaturedCourses } from './components/FeaturedCourses';
import { FloatingChat } from './components/FloatingChat';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkChatKit = () => {
      if ((window as any).chatkitLoadError) {
        setError('ChatKit library failed to load from CDN. This may be due to network restrictions or ad blockers. Please check your network connection and try again.');
        return;
      }

      if (typeof window !== 'undefined' && !(window as any).openai?.chatkit) {
        setTimeout(checkChatKit, 100);
      }
    };

    setTimeout(checkChatKit, 500);
  }, []);

  const handleExplore = () => {
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-red-200">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-slate-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero onExplore={handleExplore} />
      <div id="categories">
        <LearningCategories />
      </div>
      <FeaturedCourses />

      <FloatingChat isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
    </div>
  );
}

export default App;
