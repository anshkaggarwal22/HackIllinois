import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Typewriter from 'typewriter-effect';

const LandingPage = () => {
  const aboutRef = useRef(null);
  const howItWorksRef = useRef(null);
  const scholarshipsRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-sm z-50 py-4">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center">
            <div className="w-1/4">
              <Link to="/" className="text-2xl font-bold">
                Scholar
              </Link>
            </div>
            <div className="flex justify-center gap-16 w-1/2">
              <button 
                onClick={() => scrollToSection(aboutRef)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection(howItWorksRef)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection(scholarshipsRef)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Featured Scholarships
              </button>
            </div>
            <div className="flex justify-end gap-4 w-1/4">
              <Link 
                to="/login" 
                className="btn btn-outline px-6"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="btn btn-primary px-6"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
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
                  "Tailored scholarship matching based on your resume and transcript",
                  "Personalized funding opportunities for your college journey",
                  "Discover scholarships aligned with your academic achievements",
                  "Unlock financial aid uniquely suited to your profile"
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
            Make Money Now
          </Link>
        </div>
      </div>
      
      {/* About Section */}
      <div ref={aboutRef} className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">About Scholar</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-xl text-gray-300">
                Scholar is your intelligent scholarship matching platform that helps students find and secure college funding opportunities. We understand that every student's journey is unique, which is why we've developed a sophisticated system that matches you with scholarships tailored to your academic profile.
              </p>
              <p className="text-xl text-gray-300">
                Using advanced web scraping technology powered by Selenium and Beautiful Soup, we continuously update our database with the latest scholarship opportunities from thousands of sources, ensuring you never miss out on potential funding.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold mb-4">Key Features</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span> Real-time scholarship updates
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span> College-specific matching
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span> Automated application tracking
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">✓</span> Personalized recommendations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div ref={howItWorksRef} className="py-20 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-blue-500 mb-4">1</div>
              <h3 className="text-2xl font-semibold mb-4">Upload Your Profile</h3>
              <p className="text-gray-300">Submit your academic transcripts, resume, and preferences to help us understand your unique qualifications.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-blue-500 mb-4">2</div>
              <h3 className="text-2xl font-semibold mb-4">Get Matched</h3>
              <p className="text-gray-300">Our algorithm analyzes thousands of scholarships to find the perfect matches for your profile and chosen colleges.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-blue-500 mb-4">3</div>
              <h3 className="text-2xl font-semibold mb-4">Apply with Confidence</h3>
              <p className="text-gray-300">Receive detailed information about each scholarship and track your applications in one place.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scholarships Preview Section */}
      <div ref={scholarshipsRef} className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Scholarships</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors">
              <h3 className="text-xl font-semibold mb-3">Merit-Based Scholarships</h3>
              <p className="text-gray-300 mb-4">Opportunities based on academic excellence and achievements.</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors">
              <h3 className="text-xl font-semibold mb-3">Need-Based Aid</h3>
              <p className="text-gray-300 mb-4">Financial assistance based on demonstrated financial need.</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors">
              <h3 className="text-xl font-semibold mb-3">Specialty Scholarships</h3>
              <p className="text-gray-300 mb-4">Unique opportunities for specific majors and interests.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 border-t border-gray-700 w-full">
        <p>&copy; 2025 Scholar</p>
      </footer>
    </div>
  );
};

export default LandingPage;
