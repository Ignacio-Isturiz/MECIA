import { RouterProvider } from 'react-router-dom';
import router from './router';
import './index.css';

/**
 * Componente principal de la aplicación MECIA
 * Configura React Router y proporciona las rutas
 */
function App() {
  return <RouterProvider router={router} />;
}
export default App
