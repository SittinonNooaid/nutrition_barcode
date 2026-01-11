import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NutritionApp from './NutritionApp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NutritionApp />
    </>
  )
}

export default App
