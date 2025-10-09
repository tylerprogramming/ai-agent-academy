import { Clock, Users, Star } from 'lucide-react';

const courses = [
  {
    title: 'Neural Networks Fundamentals',
    instructor: 'Dr. Sarah Chen',
    duration: '8 weeks',
    students: '45,230',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Learn the core concepts of neural networks and build your first AI model',
  },
  {
    title: 'Machine Learning A-Z',
    instructor: 'Prof. Michael Rodriguez',
    duration: '12 weeks',
    students: '89,450',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Complete guide to machine learning algorithms and real-world applications',
  },
  {
    title: 'AI Ethics and Governance',
    instructor: 'Dr. Emily Watson',
    duration: '6 weeks',
    students: '23,890',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/8438979/pexels-photo-8438979.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Understand the ethical implications and responsible use of AI systems',
  },
  {
    title: 'Deep Learning with PyTorch',
    instructor: 'James Kim',
    duration: '10 weeks',
    students: '56,120',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Master deep learning frameworks and build advanced AI applications',
  },
];

export function FeaturedCourses() {
  return (
    <div className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Featured Courses</h2>
          <p className="text-lg text-slate-600">
            Start with our most popular AI courses taught by industry experts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course) => (
            <div
              key={course.title}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-slate-100 hover:scale-[1.02]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-600 mb-4">{course.description}</p>
                <p className="text-sm text-slate-700 mb-4">by {course.instructor}</p>

                <div className="flex items-center justify-between text-sm text-slate-600 pt-4 border-t border-slate-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-slate-900">{course.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
