import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Read from './pages/Read'
import Search from './pages/Search'
import Profile from './pages/Profile'
import Write from './pages/Write'
import Login from './pages/Login'
import Register from './pages/Register'
import Editprofile from './pages/Editprofile'
import GetblogUpdate from './pages/GetblogUpdate'
import Editblog from './pages/Editblog'
import NotLoggedIn from './protectroute/NotLoggedIn'
import LoggedIn from './protectroute/LoggedIn'
import Notfound from './pages/Notfound'


function App() {

  return (
    <div>
      <BrowserRouter>
        <Nav/>
        <Routes>

          <Route element={<NotLoggedIn/>}>
              <Route path='/login' element={<Login/>}/>
              <Route path='/register' element={<Register/>}/>
          </Route>

          <Route element={<LoggedIn/>}>
              <Route path='/create-newblog' element={<Write/>}/>
              <Route path='/edit-profile/:profileId' element={<Editprofile/>}/>
              <Route path='/get-blog-update/:profileId' element={<GetblogUpdate/>}/>
              <Route path='/edit-blog/:blogId' element={<Editblog/>}/>
          </Route>

            <Route path='/' element={<Home/>}/>
            <Route path='/r-blog/:blogId' element={<Read/>}/>
            <Route path='/search' element={<Search/>}/>
            <Route path='/profile/:profileId' element={<Profile/>}/>

            <Route path='*' element={<Notfound/>}/>

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
