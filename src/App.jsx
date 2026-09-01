import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SpriteShowcase from './components/canvas/debug/SpriteShowcase';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/art" element={<SpriteShowcase />} />
      </Routes>
    </Router>
  );
}
