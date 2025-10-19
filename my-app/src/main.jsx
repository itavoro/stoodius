import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Welcome from './Welcome.jsx'
import Continue from './Continue.jsx'
import Dashboard from './Dashboard.jsx'
import Rooms from './Rooms.jsx'
import Room from './Room.jsx'

function Home() {
  return (
    <>
      <Welcome />
      <Continue />
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
