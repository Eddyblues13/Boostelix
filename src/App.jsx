import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Footer from './components/Footer';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
      </Routes>
    </Router>
  )
}

export default App;