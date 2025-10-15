import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Sidebar from './components/Sidebar'
import './index.css'
import InvoiceForm from './components/InvoiceForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='flex h-screen outfit'>
      <Sidebar />
      <div class="h-screen flex-1 overflow-y-auto p-6 bg-gray-100">
        <InvoiceForm />
      </div>
      </div>
    </>
  )
}

export default App
