import { BookOpen, Search } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              AI Academy
            </span>
          </div>

          <div className="flex items-center space-x-8">
            <a href="#" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
              Courses
            </a>
            <a href="#" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
              Learning Paths
            </a>
            <a href="#" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
              My Learning
            </a>
            <button className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
