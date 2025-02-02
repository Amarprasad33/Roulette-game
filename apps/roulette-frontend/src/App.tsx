import { useState } from 'react';
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Index from './pages';
import { Admin } from './pages/Admin'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
