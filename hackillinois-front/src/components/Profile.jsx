// Profile.jsx
import { useState, useEffect } from "react";
import Navbar from "./Navbar";

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    state: "",
    university: "",
    major: "",
    gpa: "",
    religion: "",
    hobbies: "",
    race: "",
    gender: ""
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false
  });

  // Fetch existing profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://localhost:3001/profile', {
          headers: { Authorization: token }
        });
        const data = await res.json();
        if (res.ok) {
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            state: data.state || "",
            university: data.university || "",
            major: data.major || "",
            gpa: data.gpa || "",
            religion: data.religion || "",
            hobbies: data.hobbies || "",
            race: data.race || "",
            gender: data.gender || ""
          });
        } else {
          setStatus({ loading: false, error: data.error, success: false });
        }
      } catch (error) {
        setStatus({ loading: false, error: 'Error fetching profile', success: false });
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });
    try {
      const res = await fetch('http://localhost:3001/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      setStatus({ loading: false, error: null, success: true });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: false });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Profile Information</h1>

        {status.error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
            {status.error}
          </div>
        )}
        {status.success && (
          <div className="bg-green-500 text-white p-4 rounded-lg mb-6">
            Profile updated successfully!
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-purple-600"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-purple-600"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                className="p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-purple-600"
              />
              <input
                type="text"
                name="university"
                placeholder="University"
                value={formData.university}
                onChange={handleChange}
                className="p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-purple-600"
              />
              <input
                type="text"
                name="major"
                placeholder="Major"
                value={formData.major}
                onChange={handleChange}
                className="p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-purple-600"
              />
              <input
                type="text"
                name="gpa"
                placeholder="GPA"
                value={formData.gpa}
                onChange={handleChange}
                className="p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-purple-600"
              />
              <input
                type="text"
                name="religion"
                placeholder="Religion"
                value={formData.religion}
                onChange={handleChange}
                className="p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-purple-600"
              />
              <input
                type="text"
                name="hobbies"
                placeholder="Hobbies (comma separated)"
                value={formData.hobbies}
                onChange={handleChange}
                className="p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-purple-600"
              />
              <select
                name="race"
                value={formData.race}
                onChange={handleChange}
                className="p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-purple-600"
              >
                <option value="">Select Race</option>
                <option value="asian">Asian</option>
                <option value="black">Black/African American</option>
                <option value="hispanic">Hispanic/Latino</option>
                <option value="white">White</option>
                <option value="other">Other</option>
              </select>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-purple-600"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className={`mt-8 w-full bg-purple-600 text-white py-3 rounded-lg font-semibold ${
                status.loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
              }`}
            >
              {status.loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
