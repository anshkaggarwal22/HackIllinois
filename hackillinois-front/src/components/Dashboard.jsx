// Dashboard.jsx
import { useState, useEffect } from "react";
import Navbar from "./Navbar";

const Dashboard = () => {
  const [scholarships, setScholarships] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [incompleteProfile, setIncompleteProfile] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Please log in to view scholarships.");
      return;
    }
    const fetchScholarships = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3001/api/scholarships", {
          headers: { Authorization: token }
        });
        const data = await res.json();
        if (data.incompleteProfile) {
          setIncompleteProfile(true);
          setError(data.message);
        } else if (res.ok) {
          setScholarships(data.scholarships || []);
        } else {
          setError(data.error || "Failed to fetch scholarships");
        }
      } catch (err) {
        console.error("Error fetching scholarships:", err);
        setError("Failed to fetch scholarships");
      } finally {
        setLoading(false);
      }
    };
    fetchScholarships();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-white text-xl">Loading scholarships...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  // Filter scholarships by title
  const filteredScholarships = scholarships.filter((sch) =>
    sch.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Scholarship Dashboard</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search scholarships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 bg-gray-800 text-white rounded-lg border-2 border-gray-700 focus:outline-none focus:border-purple-600"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((sch, idx) => (
            <div
              key={`${sch.number}-${idx}`}
              className="bg-gray-800 rounded-lg p-6 shadow-lg border-2 border-gray-700 hover:border-purple-600 transition-all"
            >
              <h3 className="text-xl font-semibold text-white mb-2">{sch.title}</h3>
              <div className="text-gray-300 space-y-2">
                <p>Amount: {sch.award_amount}</p>
                <p>Deadline: {sch.due_date}</p>
                <p>GPA Requirement: {sch.gpa}</p>
                <p>University: {sch.university}</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => window.open(sch.apply_link, "_blank")}
                  className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 text-white"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
