import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", email, password);
    navigate("/"); // Redirect to homepage after login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950 text-white relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-6 bg-transparent text-purple-400 hover:text-purple-600 font-semibold text-4xl"
      >
        &larr;
      </button>
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold text-center mb-10">Login</h2>
        <form onSubmit={handleLogin} className="space-y-8">
          <div className="mb-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-purple-600"
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-purple-600"
              required
            />
          </div>
          <div className="mt-4 mb-6">
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-400 py-3 rounded-lg font-semibold border-2 border-purple-600 hover:border-purple-700"
            >
              Login
            </button>
          </div>
        </form>
        <p className="text-gray-400 text-center mt-10 px-8">
          Don't have an account? <a href="/signup" className="text-purple-400 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

