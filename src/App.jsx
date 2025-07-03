import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import HomePage from './pages/home/HomePage';
import SignUpPage from './pages/home/SignUpPage';
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoutes from './routes/AdminRoutes';
import NewOrder from './pages/dashboard/NewOrder';
import Updates from './pages/dashboard/Updates';
import AddFunds from './pages/dashboard/AddFunds';
import OrderHistory from './pages/dashboard/OrderHistory';
import MassOrder from './pages/dashboard/MassOrder';
import ChildPanel from './pages/dashboard/ChildPanel';
import Affiliate from './pages/dashboard/Affiliate';
import Services from './pages/dashboard/Services';
import Support from './pages/dashboard/Support';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/dashboard';

const Layout = ({ children }) => {
  const location = useLocation();
  const showLayout = ["/", "/signup"].includes(location.pathname);

  return (
    <>
      {showLayout && <Navbar />}
      {children}
      {showLayout && <Footer />}
    </>
  );
};


const App = () => {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<NewOrder />} />
            <Route path="updates" element={<Updates />} />
            <Route path="add-funds" element={<AddFunds />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="mass-order" element={<MassOrder />} />
            <Route path="child-panel" element={<ChildPanel />} />
            <Route path="affiliate" element={<Affiliate />} />
            <Route path="services" element={<Services />} />
            <Route path="support" element={<Support />} />
            <Route path="services" element={<Services />} />
          </Route> 
          <Route path="/admin" element={
            <AdminRoutes>
              <AdminLayout />
            </AdminRoutes>
          }
          >
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        
        </Routes>
      </Layout>
    </Router>
  );
};


export default App;