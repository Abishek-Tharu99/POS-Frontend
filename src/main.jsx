import { createRoot } from 'react-dom/client'
import MyRoute from './MyRoute.jsx'
import './assets/bootstrap.min.css'
import './assets/style.css'

createRoot(document.getElementById('root')).render(
  <>
    <MyRoute />
  </>,
)
