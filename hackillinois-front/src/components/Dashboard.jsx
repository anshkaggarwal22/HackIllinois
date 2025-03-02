// Dashboard.jsx
import { useState, useEffect } from "react";
import Navbar from "./Navbar";

const Dashboard = () => {
  const [scholarships, setScholarships] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/scholarships")
      .then((res) => res.json())
      .then((data) => {
        setScholarships(data.overlapping);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching scholarships:", err);
        setError("Failed to fetch scholarships");
        setLoading(false);
      });
  }, []);

  const filteredScholarships = scholarships.filter((scholarship) =>
    scholarship.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-white">Loading scholarships...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Scholarship Dashboard</h1>
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
        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((scholarship) => (
            <div
              key={scholarship.number}
              className="bg-gray-800 rounded-lg p-6 shadow-lg border-2 border-gray-700 hover:border-purple-600 transition-all"
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                {scholarship.title}
              </h3>
              <div className="text-gray-300 space-y-2">
                <p>Amount: {scholarship.award_amount}</p>
                <p>Deadline: {scholarship.due_date}</p>
                <p>GPA Requirement: {scholarship.gpa}</p>
                <p>University: {scholarship.university}</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => window.open(scholarship.apply_link, "_blank")}
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
