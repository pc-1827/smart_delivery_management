import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
      <nav className="navbar">
        <div className="navbar-links">
          <Link to="/">Dashboard</Link>
          <Link to="/partners">Partners</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/assignments">Assignments</Link>
        </div>
      </nav>
    );
  };

export default Navbar;