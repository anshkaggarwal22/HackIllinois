// Tracker.jsx
import { useState, useEffect } from "react";
import Navbar from "./Navbar";

const Tracker = () => {
  const [savedScholarships, setSavedScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const fetchSavedScholarships = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/savedScholarships", {
        headers: { Authorization: token }
      });
      const data = await res.json();
      if (res.ok) {
        setSavedScholarships(data.savedScholarships);
      } else {
        setError(data.error || "Error fetching saved scholarships");
      }
    } catch (err) {
      setError("Error fetching saved scholarships");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedScholarships();
  }, [token]);

  const pendingCount = savedScholarships.filter((s) => !s.isSuccessful).length;
  const successfulCount = savedScholarships.filter((s) => s.isSuccessful).length;
  const totalAward = savedScholarships
    .filter((s) => s.isSuccessful)
    .reduce((sum, sch) => {
      const amount = parseFloat(sch.award_amount.toString().replace(/[^0-9.]/g, ""));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

  const toggleSuccess = async (id, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:3001/api/savedScholarships/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({ isSuccessful: !currentStatus })
      });
      const data = await res.json();
      if (res.ok) {
        setSavedScholarships((prev) =>
          prev.map((s) => (s._id === id ? data.savedScholarship : s))
        );
      } else {
        alert(data.error || "Error updating scholarship");
      }
    } catch (err) {
      alert("Error updating scholarship");
    }
  };

  const removeScholarship = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/api/savedScholarships/${id}`, {
        method: "DELETE",
        headers: { Authorization: token }
      });
      const data = await res.json();
      if (res.ok) {
        setSavedScholarships((prev) => prev.filter((s) => s._id !== id));
      } else {
        alert(data.error || "Error deleting scholarship");
      }
    } catch (err) {
      alert("Error deleting scholarship");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-white text-xl">Loading saved scholarships...</p>
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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Application Tracker</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold">Pending</h2>
            <p className="text-4xl font-bold">{pendingCount}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold">Successful</h2>
            <p className="text-4xl font-bold">{successfulCount}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold">Total Awarded</h2>
            <p className="text-4xl font-bold">${totalAward.toFixed(2)}</p>
          </div>
        </div>
        {savedScholarships.length === 0 ? (
          <p className="text-gray-400">
            No saved applications yet. Head over to the Dashboard to save some!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedScholarships.map((sch) => (
              <div
                key={sch._id}
                className="bg-gray-800 rounded-lg p-6 shadow-lg border-2 border-gray-700 hover:border-purple-600 transition-all"
              >
                <h3 className="text-xl font-semibold mb-2">{sch.title}</h3>
                <div className="text-gray-300 space-y-2">
                  <p>Amount: {sch.award_amount}</p>
                  <p>Deadline: {sch.due_date}</p>
                  <p>University: {sch.university}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={sch.isSuccessful}
                      onChange={() => toggleSuccess(sch._id, sch.isSuccessful)}
                      className="h-5 w-5"
                    />
                    <span>{sch.isSuccessful ? "Successful" : "Pending"}</span>
                  </div>
                  <button
                    onClick={() => removeScholarship(sch._id)}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-white text-sm"
                  >
                    Remove
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

export default Tracker;
