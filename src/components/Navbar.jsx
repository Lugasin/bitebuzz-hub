import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { Badge } from 'antd';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { totalItems, openCart } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo">
          BiteBuzz
        </Link>

        <div className="nav-links">
          <Link to="/menu">Menu</Link>
          <Link to="/restaurants">Restaurants</Link>
          <Link to="/about">About</Link>
        </div>

        <div className="nav-actions">
          <Badge count={totalItems} showZero={false}>
            <Button
              type="text"
              icon={<ShoppingBag />}
              onClick={openCart}
            />
          </Badge>

          {currentUser ? (
            <div className="user-actions">
              <span>Welcome, {currentUser.displayName}</span>
              <Button onClick={logout}>Logout</Button>
            </div>
          ) : (
            <div className="auth-actions">
              <Link to="/login">
                <Button type="text">Login</Button>
              </Link>
              <Link to="/register">
                <Button type="primary">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .navbar {
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .navbar-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #1890ff;
          text-decoration: none;
        }
        .nav-links {
          display: flex;
          gap: 24px;
        }
        .nav-links a {
          color: #333;
          text-decoration: none;
          font-weight: 500;
        }
        .nav-links a:hover {
          color: #1890ff;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .user-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .auth-actions {
          display: flex;
          gap: 8px;
        }
      `}</style>
    </nav>
  );
};

export default Navbar; 