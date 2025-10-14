import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Sidebar from './components/Sidebar'
import './index.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='flex h-screen outfit'>
      <Sidebar />
      <div class="text-3xl font-bold underline flex-1">
        Hello world!
      </div>
      </div>
    </>
  )
}

export default App
