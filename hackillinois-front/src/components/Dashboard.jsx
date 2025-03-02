// Dashboard.jsx
import { useState, useEffect } from "react";
import Navbar from "./Navbar";

const Dashboard = () => {
  const [scholarships, setScholarships] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Fetch user profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch("http://localhost:3001/profile", {
      headers: {
        Authorization: token
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then(userData => {
        setUser(userData);
      })
      .catch(err => {
        console.error("Error fetching user profile:", err);
      });
  }, []);

  // Fetch scholarships - either personalized or default based on auth state
  useEffect(() => {
    setLoading(true);
    
    const token = localStorage.getItem('token');
    const endpoint = token ? "/api/scholarships" : "/api/default-scholarships";
    
    fetch(`http://localhost:3001${endpoint}`, {
      headers: token ? { Authorization: token } : {}
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch scholarships');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data.overlapping)) {
          setScholarships(data.overlapping);
        } else {
          console.error("Invalid scholarship data structure:", data);
          setError("Invalid scholarship data received");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching scholarships:", err);
        setError(err.message || "Failed to fetch scholarships");
        setLoading(false);
      });
  }, [isAuthenticated]);

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch = scholarship.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === "all") return matchesSearch;
    // Additional filter logic based on filterStatus could be added here
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 lg:mb-0">Scholarship Dashboard</h1>
          
          {user && (
            <div className="bg-gray-800 p-4 rounded-lg text-white">
              <h2 className="font-semibold text-lg mb-2">Your Profile</h2>
              <p>Welcome, {user.firstName || 'User'} {user.lastName || ''}!</p>
              <p className="text-sm text-gray-400 mt-1">
                We're finding scholarships that match your profile
              </p>
            </div>
          )}
          
          {!isAuthenticated && (
            <div className="bg-gray-800 p-4 rounded-lg border border-yellow-600 text-white">
              <h2 className="font-semibold text-lg mb-2">Not Personalized</h2>
              <p className="text-sm text-yellow-400">
                Log in to see scholarships matched to your profile
              </p>
            </div>
          )}
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search scholarships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 bg-gray-800 text-white rounded-lg border-2 border-gray-700 focus:outline-none focus:border-purple-600"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-3 bg-gray-800 text-white rounded-lg border-2 border-gray-700 focus:outline-none focus:border-purple-600"
          >
            <option value="all">All Scholarships</option>
            <option value="pending">Pending</option>
            <option value="applied">Applied</option>
            <option value="deadline-soon">Deadline Soon</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-gray-600 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="text-white mt-4">Loading scholarships...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
            <p className="font-semibold">Error: {error}</p>
            <p className="mt-2">Please try refreshing the page or contact support if the problem persists.</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredScholarships.length === 0 && (
          <div className="bg-gray-800 p-8 rounded-lg text-center">
            <h3 className="text-xl text-white mb-2">No scholarships found</h3>
            <p className="text-gray-400">
              {searchTerm 
                ? `No results match "${searchTerm}". Try a different search term.` 
                : "We couldn't find any scholarships matching your criteria."}
            </p>
          </div>
        )}

        {/* Scholarships Grid */}
        {!loading && !error && filteredScholarships.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((scholarship) => (
              <div
                key={scholarship.number || scholarship.title}
                className="bg-gray-800 rounded-lg p-6 shadow-lg border-2 border-gray-700 hover:border-purple-600 transition-all"
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  {scholarship.title}
                </h3>
                <div className="text-gray-300 space-y-2">
                  <p><span className="text-purple-400">Amount:</span> {scholarship.award_amount || "Not specified"}</p>
                  <p><span className="text-purple-400">Deadline:</span> {scholarship.due_date || "Not specified"}</p>
                  <p><span className="text-purple-400">GPA Requirement:</span> {scholarship.gpa || "None"}</p>
                  <p><span className="text-purple-400">University:</span> {scholarship.university || "Any"}</p>
                  {scholarship.eligibility && (
                    <p><span className="text-purple-400">Eligibility:</span> {scholarship.eligibility}</p>
                  )}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => window.open(scholarship.apply_link, "_blank")}
                    className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 text-white transition-colors"
                    disabled={!scholarship.apply_link || scholarship.apply_link === "N/A"}
                  >
                    Apply Now
                  </button>
                  <button className="text-purple-400 hover:text-purple-300">
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
