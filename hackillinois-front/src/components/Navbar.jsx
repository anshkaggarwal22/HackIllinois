import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar bg-gray-950 shadow-md px-8 py-4 fixed top-0 z-50">
      <div className="navbar-start">
        <Link to="/" className="text-2xl font-bold text-white">Scholar</Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal space-x-8 px-1">
          <li>
            <Link to="/about" className="text-gray-300 hover:text-purple-400 px-2 py-1">
              About
            </Link>
          </li>
          <li>
            <Link to="/how-it-works" className="text-gray-300 hover:text-purple-400 px-2 py-1">
              How It Works
            </Link>
          </li>
          <li>
            <Link to="/scholarships" className="text-gray-300 hover:text-purple-400 px-2 py-1">
              Scholarships
            </Link>
          </li>
        </ul>
      </div>
      
      <div className="navbar-end gap-4">
        <Link to="/login" className="btn btn-ghost">
          Login
        </Link>
        <Link to="/signup" className="btn btn-primary">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
