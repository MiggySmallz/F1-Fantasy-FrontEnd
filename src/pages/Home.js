import React, {useState, useEffect, useRef} from 'react'
import "./Home.css"
import { useNavigate } from "react-router-dom";

function Home(){

  const backend_url = "http://localhost:5000"
  // const backend_url = "http://f1fantasyflask-3.eba-ugqpypxw.us-east-2.elasticbeanstalk.com"
  const [leagueName, setLeagueName] = useState("")
  const [leaguePass, setLeaguePass] = useState("")
  const [leaguesList, setLeaguesList] = useState([])
  let navigate = useNavigate();

  useEffect(() => {
    
    getUsersLeagues()
    
  },[])

  
  const createLeaguePopup = () =>{
    document.getElementById("myForm").style.display = "block";
    document.getElementById("formBG").style.display = "block";
  }

  const closePopup = () =>{
    document.getElementById("myForm").style.display = "none";
    document.getElementById("formBG").style.display = "none";
  }

  async function createLeague() {
    const response = await fetch(backend_url + "/createLeague", {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({leagueName:leagueName, leaguePass:leaguePass, token: localStorage.getItem('token')}) // body data type must match "Content-Type" header
    })
    getUsersLeagues()
  }

  async function getUsersLeagues() {
    const response = await fetch(backend_url + "/getUsersLeagues", {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
      // 'Access-Control-Allow-Origin': 'http://localhost:5000/'
    },
    body: JSON.stringify({token:localStorage.getItem('token')}) // body data type must match "Content-Type" header
  })
  .then(response => response.json())
  .then(data => setLeaguesList(data["leaguesList"]))
  }

  // const leaveLeague = e =>{
  //   console.log(e.target.value)
  // }

  async function leaveLeague(e) {
    const response = await fetch(backend_url + "/leaveLeague", {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({league:e.target.value, token:localStorage.getItem('token')})
  })
  // .then(response => response.json())
  // .then(data => setLeaguesList(data["leaguesList"]))
  getUsersLeagues()
  }

  const handleSubmit = async e => {
    e.preventDefault();
    createLeague();
    closePopup();
    navigate('/Home');  
  }

  return(
    <div>

      <div className="homepage-header">
        <p className="title">My Leagues</p>
        <button id="join-league-btn">Join with Code ></button>
        <button onClick={()=>createLeaguePopup()} id="create-league-btn">Create a League ></button>
      </div>

      <div className="leagues-container">
      {
            leaguesList.map(function(key, index) {
              return(
                <div className="league-card">
                  <h3>{key["leagueName"]}</h3>
                  <button onClick={e => leaveLeague(e, "value")} value={key["leagueID"]}>Leave League</button>
                </div>

              )
            })
          }

        {/* <div className="league-card">

        </div>
        <div className="league-card">

        </div>
        <div className="league-card">

        </div>
        <div className="league-card">

        </div>
        <div className="league-card">

        </div>
        <div className="league-card">

        </div> */}
      </div>

      <div className="popup-container">
        <div onClick={()=>closePopup()} className="form-background" id="formBG">

        </div>
        <div className="form-popup" id="myForm">
          <form onSubmit={handleSubmit} class="form-container">
            <h1>Create a League</h1>

            <label><b>League Name</b></label>
            <input onInput={e => setLeagueName(e.target.value)} type="text" placeholder='Enter "League Name"'required></input>

            <label><b>Password</b></label>
            <input onInput={e => setLeaguePass(e.target.value)} type="text" placeholder="Enter Password" required></input>

            <button type="submit" class="btn">Login</button>
            <button type="button" class="btn cancel">Close</button>
          </form>
        </div>
      </div>

      
      
      
    </div>

    

  )
}

export default Home