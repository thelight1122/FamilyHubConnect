import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PageLoading from './components/PageLoading';
import { AuthProvider } from './context/AuthContext';
import { fallbackRoutes, mainLayoutRoute, publicRoutes, baseProtectedRoutes } from './config/routes';
import { FamilyPodProvider } from './pod';

function App() {
  return (
    <AuthProvider>
      <FamilyPodProvider>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            {publicRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}

            {baseProtectedRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}

            <Route element={mainLayoutRoute.element}>
              {mainLayoutRoute.children.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>

            {fallbackRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Suspense>
      </FamilyPodProvider>
    </AuthProvider>
  );
}

export default App;
