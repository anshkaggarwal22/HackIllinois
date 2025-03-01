import React from 'react';
import { Link } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import Navbar from './Navbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col items-center justify-center text-center pt-16">
        <div className="max-w-4xl mx-auto px-4 flex flex-col gap-8 items-center mt-16">
          <h1 className="text-7xl font-extrabold">
            Find Scholarships. Secure Your Future.
          </h1>
          <div className="text-2xl text-gray-300">
            <Typewriter
              options={{
                strings: [
                  'Personalized scholarship matching',
                  'AI-powered recommendations',
                  'Automated deadline tracking',
                  'Streamlined application process'
                ],
                autoStart: true,
                loop: true,
                delay: 50,
              }}
            />
          </div>
          <Link 
            to="/signup" 
            className="btn btn-primary mt-4 text-xl font-semibold shadow-xl px-8"
          >
            Get Started
          </Link>
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
