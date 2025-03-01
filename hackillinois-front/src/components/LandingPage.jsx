import { FaGraduationCap } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Button from './Button';

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
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col items-center justify-center text-center pt-16">
        <div className="max-w-4xl flex flex-col gap-8 items-center mt-16">
          <h1 className="text-7xl font-extrabold text-white">
            Find Scholarships. Secure Your Future.
          </h1>
          <p className="text-2xl text-gray-300">
            <TypewriterText text="AI-powered scholarship matching tailored just for you." delay={50} />
          </p>
          <Button 
            variant="primary" 
            size="large" 
            className="mt-4 text-xl font-semibold shadow-xl px-100"
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 border-t border-gray-700 w-full">
        <p>&copy; 2025 Scholar. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
