import { FaGraduationCap, FaChartLine, FaClipboardCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';

const TypewriterText = ({ text, delay = 100 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(c => c + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  return <span>{displayText}</span>;
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 pt-16">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-extrabold text-white mb-6">
              Unlock Opportunities, Secure Your Future
            </h1>
            <p className="text-xl text-gray-300 mb-4 h-8">
              <TypewriterText text="AI-powered scholarship matching tailored just for you." />
            </p>
            <p className="text-lg text-gray-400 mb-12">
              Smart search, personalized matches, effortless applications.
            </p>
            <div className="flex gap-6 justify-center">
              <button className="btn btn-primary btn-lg bg-purple-600 hover:bg-purple-700 border-none px-8 py-3 rounded-lg shadow-lg">
                Find Scholarships
              </button>
              <button className="btn btn-outline btn-lg border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-white px-8 py-3 rounded-lg shadow-lg">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 px-6 bg-gray-900">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {[
            { icon: <FaGraduationCap className="text-5xl text-purple-400 mb-4" />, title: "Smart Profile Matching", desc: "AI scans your profile to find the best scholarships." },
            { icon: <FaChartLine className="text-5xl text-purple-400 mb-4" />, title: "Ranked for Your Success", desc: "Prioritized based on award size and effort required." },
            { icon: <FaClipboardCheck className="text-5xl text-purple-400 mb-4" />, title: "Stay on Track", desc: "Never miss a deadline with smart reminders." }
          ].map((step, index) => (
            <div key={index} className="card bg-gray-950 p-6 border-gray-800 shadow-md hover:shadow-lg transition-shadow rounded-lg">
              <div className="card-body items-center text-center">
                {step.icon}
                <h2 className="text-xl font-semibold mb-2 text-white">{step.title}</h2>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-32 px-6 bg-gray-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Find the Funding You Deserve
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join thousands of students simplifying their scholarship search with GradFund.
          </p>
          <button className="btn btn-primary bg-purple-600 hover:bg-purple-700 border-none btn-lg px-10 py-4 rounded-lg shadow-lg">
            Get Started Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-6 text-center text-gray-500 border-t border-gray-700 w-full">
        <p>&copy; 2025 GradFund. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
