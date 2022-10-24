import {BrowserRouter, Routes, Route} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Leagues from './pages/Leagues';
import LeaguesPage from './pages/LeaguePage';
import Stats from './pages/Stats';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import TeamBuilder from './pages/TeamBuilder';
import 'bootstrap/dist/css/bootstrap.min.css';

function App(){
  
  const backend_url = "http://localhost:5000"
  // const backend_url = "http://f1fantasyflask-3.eba-ugqpypxw.us-east-2.elasticbeanstalk.com"
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token'));
  const [userName, setUserName] = useState();

   useEffect(() => {
   
    if (localStorage.getItem('token') != null){
      getUserName()
    }
  }, [userName])

  async function getUserName() {
    const response = await fetch(backend_url + "/getUserName", {
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
    <BrowserRouter>
      <div className="App">
        <div className="content">
        <Navbar loggedIn={userName} />
              <Routes>
                <Route exact path="/" element ={<Home />} />
                <Route exact path="/Home" element ={<Home />} />
                <Route path ="/Leagues" element ={<Leagues />} />
                <Route path ="/Leagues/:id" element ={<LeaguesPage />} />
                <Route path ="/Stats" element ={<Stats />} />
                <Route path ="/SignUp" element ={<SignUp />} />
                <Route path ="/LogIn" element ={<LogIn />} />
                <Route path ="/TeamBuilder" element ={<TeamBuilder />} />
              </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
