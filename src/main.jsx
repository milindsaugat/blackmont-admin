import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import AdminApp from './AdminApp'
import { AuthProvider } from './hooks/useAuth'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AdminApp />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
