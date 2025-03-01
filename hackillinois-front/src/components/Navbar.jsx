import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar bg-white shadow-sm px-4 fixed top-0 z-50">
      <div className="navbar-start">
        <Link to="/" className="text-2xl font-bold text-green-600">GradFund</Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/scholarships" className="text-gray-700 hover:text-green-600">Scholarships</Link></li>
          <li><Link to="/how-it-works" className="text-gray-700 hover:text-green-600">How It Works</Link></li>
          <li><Link to="/about" className="text-gray-700 hover:text-green-600">About</Link></li>
        </ul>
      </div>
      
      <div className="navbar-end gap-2">
        <Link to="/login" className="btn btn-ghost text-gray-700 hover:text-green-600">Login</Link>
        <Link to="/signup" className="btn btn-primary bg-green-600 hover:bg-green-700 border-none">Sign Up</Link>
      </div>
    </div>
  );
};

export default Navbar; 