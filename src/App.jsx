import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import HomePage from './pages/home/HomePage';
import SignUpPage from './pages/home/SignUpPage';
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import ProtectedRoute from './config/ProtectedRoute';
import NewOrder from './pages/dashboard/NewOrder';
import Updates from './pages/dashboard/Updates';
import AddFunds from './pages/dashboard/AddFunds';
import Support from './pages/dashboard/Support';



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
          <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<NewOrder />} />
            <Route path="updates" element={<Updates />} />
            <Route path="add-funds" element={<AddFunds />} />
            <Route path="support" element={<Support />} />
             <Route path="services" element={<Services />} />
          </Route> 
          
        </Routes>
      </Layout>
    </Router>
  );
};


export default App;