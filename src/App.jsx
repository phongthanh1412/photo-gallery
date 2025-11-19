import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PhotoList from './components/PhotoList';
import PhotoDetail from './components/PhotoDetail';
import './App.css';

/**
 * Main App component
 * Sets up routing for the photo gallery application
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to /photos */}
        <Route path="/" element={<Navigate to="/photos" replace />} />
        
        {/* Photo list page */}
        <Route path="/photos" element={<PhotoList />} />
        
        {/* Photo detail page */}
        <Route path="/photos/:id" element={<PhotoDetail />} />
        
        {/* 404 - Not Found */}
        <Route path="*" element={<Navigate to="/photos" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
