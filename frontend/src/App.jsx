import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Upload from './pages/Upload';
import Login from './pages/Login';
import Register from './pages/Register';
import Channel from './pages/Channel';
import Subscriptions from './pages/Subscriptions';
import NotFound from './pages/NotFound';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div className="fade-in" key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/watch/:id" element={<Watch />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/channel/:id" element={<Channel />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar toggleSidebar={toggleSidebar} />
          <div className="main-layout">
            <Sidebar open={sidebarOpen} close={() => setSidebarOpen(false)} />
            <main className="content" onClick={() => sidebarOpen && setSidebarOpen(false)}>
              <AnimatedRoutes />
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
