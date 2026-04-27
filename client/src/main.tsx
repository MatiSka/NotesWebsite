import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import SignUp from './components/pages/SignUp'
import "./App.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>

        <BrowserRouter>
            <Routes>
                <Route path='/'         element={<SignUp/>}/>
                <Route path='/home'     element={<Home/>}/>
                <Route path='/login'    element={<Login/>}/>
                <Route path='/signup'   element={<SignUp/>}/>
            </Routes>
        </BrowserRouter>

  </StrictMode>,
)
