import { createRoot } from 'react-dom/client';
import './styles.css';
import { AppResponsive } from './components/app-shell';

// Titik masuk frontend: seluruh fitur dirender melalui shell aplikasi aktif.
createRoot(document.getElementById('root')).render(<AppResponsive />);
