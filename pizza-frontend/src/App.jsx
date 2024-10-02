import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import OrderHistory from './pages/OrderHistory';
import About from './pages/About';
import Register from './pages/Register';
import Login from './pages/Login';
import Footer from './components/Footer';
import OrderPage from './pages/OrderPage';
import AdminDashboard from './pages/Dasboard';
import Orders from './pages/Admin/Orders';
import Order from './pages/Order';
import Roles from './pages/Admin/roles/Roles';
import Permissions from './pages/Admin/permission/Permissions';
import Pizza from './pages/Admin/pizzas/pizza';
import Restaurant from './pages/Admin/restaurant/restaurant';
import Toppings from './pages/Admin/toppings/topping';
import Navbar from './components/Navbar';

function App() {
  const location = useLocation();
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    
    setRole(storedRole);

    if (storedRole === 'super_admin' && !location.pathname.startsWith('/admin')) {
      navigate('/admin');
    }
  }, [location.pathname, navigate]);

  const showNavbarAndFooter = location.pathname !== '/register' && location.pathname !== '/login';

  return (
    <>
      {showNavbarAndFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Customer routes without authorization checks */}
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="order" element={<Order />} />

        {/* Common routes for all users */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/orders" element={<OrderPage />} />

        {/* Admin Dashboard route without authorization checks */}
        {role === 'super_admin' && (
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="orders" element={<Orders />} />
            <Route path="roles" element={<Roles />} />
            <Route path="permissions" element={<Permissions />} />
            <Route path="pizza" element={<Pizza />} />
            <Route path="restaurant" element={<Restaurant />} />
            <Route path="topping" element={<Toppings />} />
          </Route>
        )}
      </Routes>
      {showNavbarAndFooter && <Footer />}
    </>
  );
}

export default App;