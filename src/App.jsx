import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import HomePage from './pages/home/HomePage';
import SignUpPage from './pages/home/SignUpPage';
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from './pages/ProtectedRoute';

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
              // <ProtectedRoute>
                <Dashboard />
              // </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};


export default App;