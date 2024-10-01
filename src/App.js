import {BrowserRouter, Routes, Route} from 'react-router-dom';
import React, {useState, useEffect, createContext, useContext} from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Leagues from './pages/Leagues';
import LeaguePage from './pages/LeaguePage';
import Stats from './pages/Stats';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import TeamBuilder from './pages/TeamBuilder';
import 'bootstrap/dist/css/bootstrap.min.css';


export const UserNameContext = createContext(null);

function App(){
  // const backend_url = "https://api.playf1fantasy.com"
  // const backend_url = "http://127.0.0.1:5000"
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token'));
  const [userName, setUserName] = useState();
  
  

   useEffect(() => {
   
    if (localStorage.getItem('token') != null){
      getUserName()
    }
  }, [userName])

  async function getUserName() {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/getUserName", {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({token:localStorage.getItem('token')}) // body data type must match "Content-Type" header
  })
  .then(response => response.json())
  .then(data => setUserName(data.name));
  }


  

  return (
    <UserNameContext.Provider value={userName}>
      <BrowserRouter>
        <div className="App">
          <div className="content">
          <Navbar loggedIn={userName} />
                <Routes>
                  {/* <Route exact path="/" element ={<Home />} /> */}
                  <Route exact path="/Home" element ={<Home />} />
                  <Route path ="/Leagues" element ={<Leagues />} />
                  <Route path ="/Leagues/:id" element ={<LeaguePage />} />
                  <Route path ="/Stats" element ={<Stats />} />
                  <Route path ="/SignUp" element ={<SignUp />} />
                  <Route path ="/LogIn" element ={<LogIn />} />
                  <Route path ="/TeamBuilder" element ={<TeamBuilder />} />
                </Routes>
          </div>
          
        </div>
      </BrowserRouter>
    </UserNameContext.Provider>
  )
}

export default App
