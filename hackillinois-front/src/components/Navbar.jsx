import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem("token");
    // Redirect to login page
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <h1 
            onClick={() => navigate("/dashboard")} 
            className="text-2xl font-bold text-purple-400 cursor-pointer"
          >
            Scholar
          </h1>
          <div className="hidden md:flex space-x-6">
            <button 
              onClick={() => navigate("/dashboard")}
              className="text-gray-300 hover:text-purple-400"
            >
              Dashboard
            </button>
            <button 
              onClick={() => navigate("/profile")}
              className="text-gray-300 hover:text-purple-400"
            >
              Profile
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
