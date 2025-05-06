import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Footer from './components/footer.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom'
import UsuarioQR from './routes/Qr.jsx'
import { AuthProvider } from './Auth/AuthProvider'
import Login from './routes/Login.jsx'
import QRScanner from './routes/Lector.jsx'
import Header from './components/Header.jsx'

const AuthLayout = () => (
    <Outlet />
);

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <Login/>
      },
      {
        path: "/qr",
        element: <UsuarioQR/>
      },
      {
        path: "/lector",
        element: <QRScanner/>
      }
    ]
  } 

])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
    <Header/>
    <RouterProvider router={router} />
    <Footer/>
    </AuthProvider>
  </React.StrictMode>,
)
