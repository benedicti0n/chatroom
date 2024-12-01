import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Room from './components/Room'

const App = () => {
  return (
    <div className='h-min-screen w-full flex justify-center items-center'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/:roomId" element={<Room />} />
      </Routes>
    </div>
  )
}

export default App