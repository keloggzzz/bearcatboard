import './App.css'
import Login from "./Components/Login";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import {useState, createContext} from "react";

export const DataContext=createContext("");


export default function App() {
  var login=0; 
   if(sessionStorage.getItem("logged") != null){
     login=sessionStorage.getItem("logged")
   }
   const [logStatus,setLogStatus]=useState(login);

  return (
    <DataContext.Provider value={{logStatus:logStatus}}>
      <div>
       <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Login/>}/>
          <Route path="/Login" element={<Login/>}/>
        </Routes>
      </BrowserRouter>
    </div>
    </DataContext.Provider>
  )
}