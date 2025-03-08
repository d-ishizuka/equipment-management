import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import CategoriesPage from './pages/CategoriesPage'
import LocationsPage from './pages/LocationsPage'
import Navigation from './components/Navigation'

function App() {
  return (
    <BrowserRouter>
      <div className='app-container'>
        <Navigation />
        <div className='content-container'>
          <Routes>
            <Route path='/' element={<Navigate to='/categories' />} />
            <Route path='/categories' element={<CategoriesPage />} />
            <Route path='/locations' element={<LocationsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App