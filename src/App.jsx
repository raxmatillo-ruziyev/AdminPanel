import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './Pages/Login/Login'
import Home from './Pages/Home/Home'
import Category from './Componenets/Category/Category'
import City from './Componenets/City/City'
import Cars from './Componenets/Cars/Cars'
import Location from './Componenets/Location/Location'
import Model from './Componenets/Model/Model'
import Brand from './Componenets/Brand/Brand'
import Dashboard from './Componenets/Dashboard/Dashboard'

function App() {


  return (
    <>
      <Routes path='/'>
        <Route index element={<Login />} />
        <Route path="home" element={<Home />}>
          <Route index element={<Dashboard/>}/>
          <Route path='category' element={<Category/>}/>
          <Route path='city' element={<City/>}/>
          <Route path='cars' element={<Cars/>}/>
          <Route path='loc' element={<Location/>}/>
          <Route path='model' element={<Model/>}/>
          <Route path='brand' element={<Brand/>}/>
          
        </Route>
      </Routes>
    </>
  )
}

export default App
