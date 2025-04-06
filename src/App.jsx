import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './store';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TelecallerPage from './pages/TelecallerPage';
import TelecallersList from './pages/TelecallersList';
import Layout from './components/Layout';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <PrivateRoute>
                  <Navigate to="/dashboard" replace />
                </PrivateRoute>
              }
            />
            <Route
              path="dashboard"
              element={
                <PrivateRoute roles={['admin']}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="telecallers"
              element={
                <PrivateRoute roles={['admin']}>
                  <TelecallersList />
                </PrivateRoute>
              }
            />
            <Route
              path="leads"
              element={
                <PrivateRoute roles={['telecaller']}>
                  <TelecallerPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
