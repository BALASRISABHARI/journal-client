import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Analytics from './pages/Analytics';
import GrowthGarden from './pages/GrowthGarden';
import Achievements from './pages/Achievements';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {user && <Navbar />}
      <div className={user ? "container mx-auto px-4 py-6" : ""}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />

          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          <Route path="/history" element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          } />

          <Route path="/analytics" element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          } />

          <Route path="/garden" element={
            <PrivateRoute>
              <GrowthGarden />
            </PrivateRoute>
          } />

          <Route path="/achievements" element={
            <PrivateRoute>
              <Achievements />
            </PrivateRoute>
          } />

        </Routes>
      </div>
    </div>
  );
}

export default App;
