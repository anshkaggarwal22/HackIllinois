import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Dashboard = () => {
  const [scholarships, setScholarships] = useState([]);
  const [savedScholarships, setSavedScholarships] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Please log in to view scholarships.");
      return;
    }

    const fetchScholarships = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3001/api/scholarships", {
          headers: { Authorization: token },
        });
        const data = await res.json();

        // If user profile is incomplete, redirect them to the profile page
        if (data.incompleteProfile) {
          navigate("/profile");
          return;
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

    const fetchSavedScholarships = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/savedScholarships", {
          headers: { Authorization: token },
        });
        const data = await res.json();
        if (res.ok) {
          setSavedScholarships(data.savedScholarships);
        }
      } catch (err) {
        console.error("Error fetching saved scholarships:", err);
      }
    };

    fetchScholarships();
    fetchSavedScholarships();
  }, [token, navigate]);

  const handleSaveScholarship = async (scholarship) => {
    if (
      savedScholarships.find(
        (s) => s.apply_link === scholarship.apply_link && s.title === scholarship.title
      )
    ) {
      alert("Scholarship already saved!");
      return;
    }
    try {
      const res = await fetch("http://localhost:3001/api/savedScholarships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          title: scholarship.title,
          award_amount: scholarship.award_amount,
          due_date: scholarship.due_date,
          university: scholarship.university,
          apply_link: scholarship.apply_link,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSavedScholarships((prev) => [...prev, data.savedScholarship]);
        alert("Scholarship saved to tracker!");
      } else {
        alert(data.error || "Failed to save scholarship");
      }
    } catch (err) {
      alert("Failed to save scholarship");
    }
  };

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
          {filteredScholarships.map((sch, idx) => {
            const isSaved = savedScholarships.find(
              (s) => s.apply_link === sch.apply_link && s.title === sch.title
            );
            return (
              <div
                key={`${sch.title}-${idx}`}
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
                  {isSaved ? (
                    <button
                      disabled
                      className="bg-gray-600 px-4 py-2 rounded-lg text-white cursor-not-allowed"
                    >
                      Saved
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSaveScholarship(sch)}
                      className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 text-white"
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
