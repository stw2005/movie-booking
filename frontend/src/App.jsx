import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AdminLayout from './components/AdminLayout';
import AdminBookings from './pages/admin/AdminBookings';
import AdminMovies from './pages/admin/AdminMovies';
import AdminManageMovies from './pages/admin/AdminManageMovies';
import AdminMovieForm from './pages/admin/AdminMovieForm';
import { AuthProvider, AuthContext } from './AuthProvider';
import { useContext } from 'react';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          {/* Admin Routes */}
          <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="bookings" replace />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="movies" element={<AdminMovies />} />
            <Route path="manage" element={<AdminManageMovies />} />
            <Route path="movie/new" element={<AdminMovieForm />} />
            <Route path="movie/edit/:id" element={<AdminMovieForm />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
