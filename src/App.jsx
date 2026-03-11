import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { fallbackRoutes, protectedLayoutRoute, publicRoutes } from './config/routes';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        <Route element={protectedLayoutRoute.element}>
          {protectedLayoutRoute.children.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        {fallbackRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </AuthProvider>
  );
}

export default App;
