import { useState } from "react";
import Navbar from "./Navbar";

const Profile = () => {
  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    university: "",
    major: "",
    gpa: "",
    race: "",
    gender: "",
    location: "",
    householdIncome: "",
  });

  // Files State
  const [files, setFiles] = useState({
    resume: null,
    transcript: null
  });

  // Email Notification Preference
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Mock application stats
  const applicationStats = {
    total: 15,
    pending: 8,
    accepted: 4,
    rejected: 3,
    totalAmount: 12000
  };

  const handleInfoChange = (e) => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (e, type) => {
    setFiles({
      ...files,
      [type]: e.target.files[0]
    });
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Profile & Settings</h1>

        {/* Application Statistics Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Application Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="text-purple-400 text-4xl font-bold mb-2">{applicationStats.total}</div>
              <div className="text-gray-300">Total Applications</div>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="text-green-400 text-4xl font-bold mb-2">{applicationStats.accepted}</div>
              <div className="text-gray-300">Accepted</div>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="text-purple-400 text-4xl font-bold mb-2">${applicationStats.totalAmount}</div>
              <div className="text-gray-300">Total Amount Awarded</div>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={personalInfo.firstName}
              onChange={handleInfoChange}
              className="p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-purple-600"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={personalInfo.lastName}
              onChange={handleInfoChange}
              className="p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-purple-600"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={personalInfo.email}
              onChange={handleInfoChange}
              className="p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-purple-600"
            />
            <select
              name="race"
              value={personalInfo.race}
              onChange={handleInfoChange}
              className="p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-purple-600"
            >
              <option value="">Select Race/Ethnicity</option>
              <option value="asian">Asian</option>
              <option value="black">Black/African American</option>
              <option value="hispanic">Hispanic/Latino</option>
              <option value="white">White</option>
              <option value="other">Other</option>
            </select>
            <select
              name="gender"
              value={personalInfo.gender}
              onChange={handleInfoChange}
              className="p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-purple-600"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not">Prefer not to say</option>
            </select>
            <select
              name="householdIncome"
              value={personalInfo.householdIncome}
              onChange={handleInfoChange}
              className="p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-purple-600"
            >
              <option value="">Select Household Income</option>
              <option value="0-30000">$0 - $50,000</option>
              <option value="30001-60000">$50,001 - $100,000</option>
              <option value="60001-90000">$100,001 - $150,000</option>
              <option value="90001+">$150,000+</option>
            </select>
          </div>

          {/* Document Upload Section */}
          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">Resume</label>
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, 'resume')}
                  className="block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Transcript</label>
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, 'transcript')}
                  className="block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                />
              </div>
            </div>
          </div>

          {/* Email Notification Preference */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Notification Preferences</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
                className="w-4 h-4 text-purple-600 border-gray-600 rounded focus:ring-purple-500"
              />
              <label className="ml-2 text-gray-300">
                Receive email notifications about new scholarships and updates
              </label>
            </div>
          </div>

          <button className="mt-8 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 