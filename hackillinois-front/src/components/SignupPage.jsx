import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      const data = await response.json();
      console.log("Signup successful:", data);

      // Automatically log the user in by storing the token
      localStorage.setItem("token", data.token);

      // Redirect to the profile page
      navigate("/profile");
    } catch (error) {
      console.error("Error during signup:", error);
      // Optionally, display an error message to the user here
    }
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
        <h2 className="text-3xl font-bold text-center mb-10">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-8">
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
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-gray-400 text-center mt-10 px-8">
          Already have an account?{" "}
          <a href="/login" className="text-purple-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
