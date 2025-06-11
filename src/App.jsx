import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import Layout from './Layout';
import { routes, routeArray } from './config/routes';
import NotFoundPage from '@/components/pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<routes.shop.component />} />
              {routeArray.map((route) => (
                <Route
                  key={route.id}
                  path={route.path}
element={<route.component />}
                />
              ))}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </AnimatePresence>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
          toastClassName="shadow-lg"
          bodyClassName="text-sm"
          progressClassName="bg-primary"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;