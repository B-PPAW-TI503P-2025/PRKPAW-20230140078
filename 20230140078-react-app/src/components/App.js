import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import PresensiPage from './components/PresensiPage';
import ReportPage from './components/ReportPage';
import Navbar from './components/Navbar';

function App() {
  // Layout khusus untuk halaman yang butuh Navbar (Dashboard, Presensi, Report)
  const ProtectedLayout = ({ children }) => (
    <>
      <Navbar />
      <div className="pt-20 container mx-auto p-4">
          {children}
      </div>
    </>
  );

  return (
    <Router>
       <Routes>
          {/* Halaman Publik (Tanpa Navbar) */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Halaman Dalam (Pakai Navbar) */}
          {/* Perhatikan cara pembungkusannya di bawah ini: */}
          <Route path="/dashboard" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
          <Route path="/presensi" element={<ProtectedLayout><PresensiPage /></ProtectedLayout>} />
          <Route path="/reports" element={<ProtectedLayout><ReportPage /></ProtectedLayout>} />
       </Routes>
    </Router>
  );
}

export default App;