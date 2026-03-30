import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { fallbackRoutes, childLayoutRoute, adultLayoutRoute, publicRoutes, baseProtectedRoutes } from './config/routes';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {baseProtectedRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        <Route element={adultLayoutRoute.element}>
          {adultLayoutRoute.children.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        <Route element={childLayoutRoute.element}>
          {childLayoutRoute.children.map((route) => (
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
