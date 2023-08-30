import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../components/Home'
import NotFound from '../components/NotFound'
import Dashboard from '../components/admin/Dashboard'
import Actors from '../components/admin/Actors'
import Movies from '../components/admin/Movies'

export default function AdminNavigator() {
  return (
    <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/movies" element={<Movies/>}/>
        <Route path="/actors" element={<Actors/>}/>
        <Route path="*" element={<NotFound/>}/>
    </Routes>
  )
}
