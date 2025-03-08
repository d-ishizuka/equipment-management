import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import CategoryList from './components/CategoryList'
import LocationList from './components/LocationList'
import Navigation from './components/Navigation'

function App() {
  return (
    <BrowserRouter>
      <div className='app-container'>
        <Navigation />
        <div className='content-container'>
          <Routes>
            <Route path='/' element={<Navigate to='/categories' />} />
            <Route path='/categories' element={<CategoryList />} />
            <Route path='/locations' element={<LocationList />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App