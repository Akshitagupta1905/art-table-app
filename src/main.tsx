import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { PrimeReactProvider } from 'primereact/api'
import 'primereact/resources/themes/lara-dark-indigo/theme.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </React.StrictMode>,
)
