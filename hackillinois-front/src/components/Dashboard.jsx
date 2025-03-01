import { useState } from "react";
import Navbar from "./Navbar";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data for scholarships
  const scholarships = [
    {
      id: 1,
      title: "STEM Excellence Scholarship",
      amount: "$5,000",
      deadline: "2024-05-15",
      relevanceScore: 95,
      status: "pending"
    },
    {
      id: 2,
      title: "Future Leaders Grant",
      amount: "$3,000",
      deadline: "2024-04-30",
      relevanceScore: 88,
      status: "pending"
    },
    {
      id: 3,
      title: "Women in Tech Scholarship",
      amount: "$4,000",
      deadline: "2024-06-01",
      relevanceScore: 92,
      status: "deadline-soon"
    }
  ];

  const filteredScholarships = scholarships.filter(scholarship => 
    scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === "all" || scholarship.status === filterStatus)
  );

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">Your Dashboard</h1>
          
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
                key={scholarship.id}
                className="bg-gray-800 rounded-lg p-6 shadow-lg border-2 border-gray-700 hover:border-purple-600 transition-all"
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  {scholarship.title}
                </h3>
                <div className="text-gray-300 space-y-2">
                  <p>Amount: {scholarship.amount}</p>
                  <p>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</p>
                  <p>Relevance Score: {scholarship.relevanceScore}%</p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-purple-400">
                    Status: {scholarship.status}
                  </span>
                  <button className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 text-white">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines Section */}
        <div className="bg-gray-800 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Upcoming Deadlines</h2>
          <div className="space-y-4">
            {scholarships
              .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
              .slice(0, 3)
              .map((scholarship) => (
                <div
                  key={scholarship.id}
                  className="flex justify-between items-center p-4 bg-gray-700 rounded-lg"
                >
                  <div>
                    <h3 className="text-white font-semibold">{scholarship.title}</h3>
                    <p className="text-gray-300">
                      Due: {new Date(scholarship.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 text-white">
                    Apply Now
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 