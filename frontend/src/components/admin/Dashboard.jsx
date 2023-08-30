import React, { Children } from 'react'
import { Link, NavLink } from 'react-router-dom';
import {AiOutlineHome} from 'react-icons/ai';

export default function Dashboard() {
  return (
    <nav className='w-48 min-h-screen bg-secondary border-r border-gray-300'>
      <ul className='pl-5'>
        <li>
          <Link to="/">
            <img src="./logo.png" alt="logo" className='h-14 p-2'/>
          </Link>
        </li>

        <li>
          <NavItem to='/'>
            <AiOutlineHome/>
            <span>Home</span>
          </NavItem>
        </li>
        <li>
          <NavItem to='/movies'>Movies</NavItem>
        </li>
        <li>
          <NavItem to='/actors'>actors</NavItem>
        </li>
      </ul>
    </nav>
  );
}

const NavItem = ({children,to})=>{
  return (
    <NavLink className={({isActive})=> isActive ? 'text-white' : 'text-gray-400' + 'flex items-center text-lg space-x-2 p-2 hover:opacity-80' } 
    to={to}
    >
      {children}
    </NavLink>
  )
}
