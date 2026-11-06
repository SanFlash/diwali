import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
export default function Shell({sound,setSound}:{sound:boolean;setSound:(v:boolean)=>void}){
  return <><Navbar sound={sound} setSound={setSound}/><main><Outlet/></main><Footer/></>
}
