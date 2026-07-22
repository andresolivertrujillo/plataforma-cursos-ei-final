import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Catalog from './pages/Catalog';
import CourseDetail from './pages/CourseDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import MyEnrollments from './pages/MyEnrollments';
import AccessDenied from './pages/AccessDenied';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/curso/:id" element={<CourseDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/acceso-denegado"
              element={
                <ProtectedRoute>
                  <AccessDenied />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mis-inscripciones"
              element={
                <ProtectedRoute requiredRole="student">
                  <MyEnrollments />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
