import React, {useState, useEffect, useRef} from 'react'
import "./Leagues.css"
import { useNavigate, Link } from "react-router-dom";

function Leagues(){

  // const backend_url = "https://api.playf1fantasy.com"
  // const backend_url = "f1-fantasy-backend.us-east-2.elasticbeanstalk.com"
  const [leagueName, setLeagueName] = useState("")
  const [leagueCode, setLeagueCode] = useState("")
  const [leaguesList, setLeaguesList] = useState([])
  const [userSignedIn, setUserSignedIn] = useState(false)
  let navigate = useNavigate();

  useEffect(() => {
    
    getUsersLeagues()
    
  },[])

  
  const createLeaguePopup = () =>{
    document.getElementById("joinLeague").style.display = "none";
    document.getElementById("createLeague").style.display = "block";
    document.getElementById("formBG").style.display = "block";
  }

  const joinLeaguePopup = () =>{
    document.getElementById("createLeague").style.display = "none";
    document.getElementById("joinLeague").style.display = "block";
    document.getElementById("formBG").style.display = "block";
  }

  const closePopup = () =>{
    document.getElementById("createLeague").style.display = "none";
    document.getElementById("joinLeague").style.display = "none";
    document.getElementById("formBG").style.display = "none";
  }

  async function createLeague() {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/createLeague", {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({leagueName:leagueName, leaguePass:leagueCode, token: localStorage.getItem('token')}) // body data type must match "Content-Type" header
    })
    getUsersLeagues()
  }

  async function joinLeague() {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/joinLeague", {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({leaguePass:leagueCode, token: localStorage.getItem('token')}) // body data type must match "Content-Type" header
    })
    getUsersLeagues()
  }

  async function getUsersLeagues() {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/getUsersLeagues", {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
      // 'Access-Control-Allow-Origin': 'http://localhost:5000/'
    },
    body: JSON.stringify({token:localStorage.getItem('token')}) // body data type must match "Content-Type" header
  })
  .then(response => response.json())
  .then(data => {
    if (data["leaguesList"] != null){
      setLeaguesList(data["leaguesList"])
      setUserSignedIn(true)
    }
  })
  }

  // const leaveLeague = e =>{
  //   console.log(e.target.value)
  // }

  async function leaveLeague(e) {
    
    e.stopPropagation()
    console.log(e.target.value)
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/leaveLeague", {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({leagueID:e.target.value, token:localStorage.getItem('token')})
  })
  // .then(response => response.json())
  // .then(data => setLeaguesList(data["leaguesList"]))
  
  getUsersLeagues()
  }

  const leagueLink = (leagueID) => {
    navigate(`/Leagues/${leagueID["leagueID"]}`);
  }

  const handleCreateLeague = async e => {
    e.preventDefault();
    createLeague();
    closePopup();
    navigate('/Leagues');  
  }

  const handleJoinLeague = async e => {
    e.preventDefault();
    joinLeague();
    closePopup();
    navigate('/Leagues');  
  }

  return(
    <div>

      <div className="leagues-header">
        <p className="title white">My Leagues</p>
        <button onClick={()=>joinLeaguePopup()} id="join-league-btn">Join with Code ></button>
        <button onClick={()=>createLeaguePopup()} id="create-league-btn">Create a League ></button>
      </div>

      <div className="center-flex">
        <div className="leagues-container">
        {(userSignedIn == false) ? (<h3 className='white'>You must sign in first</h3>):(<h3></h3>)}
        {
          leaguesList.map(function(key, index) {
            return(
              <div onClick={()=>leagueLink(key)} className="league-card">
                <div><h3>{key["leagueName"]}</h3></div>
                <button onClick={e => leaveLeague(e, "value")} value={key["leagueID"]}>Leave League</button>
              </div>
            )
          })
        }
        </div>
      </div>
      


      <div className="popup-container">
        <div onClick={()=>closePopup()} className="form-background" id="formBG">

        </div>
        <div className="form-popup" id="createLeague">
          <form onSubmit={handleCreateLeague} className="form-container">
            <h1>Create a League</h1>

            <label><b>League Name</b></label>
            <input onInput={e => setLeagueName(e.target.value)} type="text" placeholder='Enter "League Name"'required></input>

            <label><b>League Code</b></label>
            <input onInput={e => setLeagueCode(e.target.value)} type="text" placeholder='Enter "League Code"' required></input>

            <button type="submit" className="btn">Login</button>
            <button onClick={()=>closePopup()} type="button" className="btn cancel">Close</button>
          </form>
        </div>

        <div className="form-popup" id="joinLeague">
          <form onSubmit={handleJoinLeague} className="form-container">
            <h1>Join League</h1>

            <label><b>League Code</b></label>
            <input onInput={e => setLeagueCode(e.target.value)} type="text" placeholder='Enter "League Code"'required></input>

            <button type="submit" className="btn">Login</button>
            <button onClick={()=>closePopup()} type="button" className="btn cancel">Close</button>
          </form>
        </div>
      </div>




     
      
    </div>

    

  )
}

export default Leagues