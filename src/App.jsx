import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import HomePage from './pages/home/HomePage';
import SignUpPage from './pages/home/SignUpPage';
import ServicesPage from './pages/home/ServicesPage';
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
import Dashboard from './pages/admin/Dashboard';
import ManageApiProviders from './pages/admin/ManageApiProviders';
import ManageUsers from './pages/admin/ManageUsers';
import AdminUserView from "./pages/admin/AdminUserView";
import AdminUserEdit from "./pages/admin/AdminUserEdit";
import AddSubtractBalance from "./pages/admin/AddSubtractBalance";
import ManageUserOrders from "./pages/admin/ManageUserOrders";
import ManageUserTransactions from "./pages/admin/ManageUserTransactions";
import ManageTransactions from "./pages/admin/ManageTransactions";
import SendMailAll from "./pages/admin/SendMailAll";
import SendEmailForm from './pages/admin/SendEmailForm';
import API from './pages/dashboard/Api';
import Tutorials from './pages/dashboard/Tutorials';
import Account from './pages/dashboard/Account';
import TransactionCallback from './pages/dashboard/TransactionCallback';


import AddServicesPage from './pages/admin/AddServicesPage';
import ShowServices from './pages/admin/ShowServices';
import AdminTickets from './pages/admin/Tickets';
import ShowOrders from "./pages/admin/ShowOrders";
import AdminSettings from './pages/admin/AdminSettings';





const Layout = ({ children }) => {
  const location = useLocation();
  const showLayout = ["/", "/signup", "/services"].includes(location.pathname);

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
           <Route path="/services" element={<ServicesPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/payment/callback" element={<TransactionCallback />} />
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
            <Route path="api" element={<API />} />
            <Route path="tutorials" element={<Tutorials />} />
            <Route path="account" element={<Account />} />
           
            

          </Route> 
          <Route path="/admin" element={
            <AdminRoutes>
              <AdminLayout />
            </AdminRoutes>
          }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add-services" element={<AddServicesPage />} />
            <Route path="show-services" element={<ShowServices />} />
            <Route path="orders" element={<ShowOrders />} />
            <Route path="api-providers" element={<ManageApiProviders />} />
            <Route path="transactions" element={<ManageTransactions />} />
            <Route path="manage-users" element={<ManageUsers />} />
<<<<<<< HEAD
            <Route path="tickets" element={<AdminTickets />} />
=======
            <Route path="settings" element={<AdminSettings />} />
>>>>>>> a55809f1fb071e806124fa7a4565eef55303697a
            <Route path="users/:id/View" element={<AdminUserView />} />
            <Route path="users/:id/Edit" element={<AdminUserEdit />} />
            <Route path="users/:id/balance" element={<AddSubtractBalance />} />
            <Route path="users/:id/orders" element={<ManageUserOrders />} />
            <Route path="users/:id/transactions" element={<ManageUserTransactions />} />
            <Route path="users/:id/send-email" element={<SendEmailForm />} />
            <Route path="send-mail" element={<SendMailAll />} />
             
          </Route>
        
        </Routes>
      </Layout>
    </Router>
  );
};


export default App;