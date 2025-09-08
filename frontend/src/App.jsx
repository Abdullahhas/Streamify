import { useState } from 'react'
import { Routes , Route } from 'react-router'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotificationsPage from './pages/NotificationsPage'
import CallPage from './pages/CallPage'
import ChatPage from './pages/ChatPage'
import OnBoardingPage from './pages/OnBoardingPage'
import toast, { Toaster } from 'react-hot-toast'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path='/' element={<HomePage/>} />
      <Route path='/signup' element={<SignupPage/>} />
      <Route path='/login' element={<LoginPage/>} />
      <Route path='/notification' element={<NotificationsPage/>} />
      <Route path='/call' element={<CallPage/>} />
      <Route path='/chat' element={<ChatPage/>} />
      <Route path='/onboarding' element={<OnBoardingPage/>} />
    </Routes>

    <Toaster/>
    </>
  )
}

export default App
