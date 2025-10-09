import { Brain, Network, Eye, MessageSquare, BarChart, Code } from 'lucide-react';

const categories = [
  {
    icon: Brain,
    title: 'Introduction to AI',
    description: 'Learn the basics of artificial intelligence and its applications',
    courses: 12,
    level: 'Beginner',
  },
  {
    icon: Network,
    title: 'Machine Learning',
    description: 'Master algorithms that learn from data and make predictions',
    courses: 18,
    level: 'Intermediate',
  },
  {
    icon: Eye,
    title: 'Computer Vision',
    description: 'Teach computers to interpret and understand visual information',
    courses: 10,
    level: 'Advanced',
  },
  {
    icon: MessageSquare,
    title: 'Natural Language Processing',
    description: 'Process and analyze human language with AI',
    courses: 15,
    level: 'Intermediate',
  },
  {
    icon: BarChart,
    title: 'Data Science',
    description: 'Extract insights and knowledge from structured data',
    courses: 20,
    level: 'Beginner',
  },
  {
    icon: Code,
    title: 'Deep Learning',
    description: 'Build and train neural networks for complex tasks',
    courses: 14,
    level: 'Advanced',
  },
];

export function LearningCategories() {
  return (
    <div className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Explore Learning Paths</h2>
          <p className="text-lg text-slate-600">
            Choose from a variety of AI topics to begin your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                className="group bg-white rounded-2xl p-7 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-slate-100 hover:scale-105 hover:border-blue-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl group-hover:scale-110 transition-transform shadow-sm">
                    <Icon className="w-6 h-6 text-blue-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {category.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">{category.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{category.courses} courses</span>
                      <span
                        className={`px-2 py-1 rounded-full font-medium ${
                          category.level === 'Beginner'
                            ? 'bg-green-100 text-green-700'
                            : category.level === 'Intermediate'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {category.level}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
