import React, {useState, useEffect, useRef, useContext} from 'react'
import "./LeaguePage.css"
import { useNavigate, Link, useParams } from "react-router-dom";
import { UserNameContext } from '../App';

function LeaguesPage() {

  let { id } = useParams();
  // const backend_url = "https://api.playf1fantasy.com"
  const [memberTeamsList,setMemberTeamsList] = useState({})
  const [points,setPoints] = useState({})
  const [costs,setCosts] = useState({})
  const [leagueName, setLeagueName] = useState("")
  const [currentMember, setCurrentMember] = useState("")
  const [races, setRaces] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasTeam, setHasTeam] = useState(false)
  const[usersTeams, setUsersTeams] = useState([])
  const[teamIDs, setTeamIDs] = useState([])
  const[fname, setFname] = useState("")

  const[teamChange, setTeamChange] = useState(false)

  const userName = useContext(UserNameContext);
  // console.log("USERNAME IS:" + userName)

  useEffect(() => {
    
    getLeagueInfo();
    getRaces();
    getPoints();
    getCosts();


  },[teamChange])

  function convertBudget(value)
  {
    if(value>=1000000)
    {
        value=(value/1000000)+"M"
    }
    else if(value>=1000)
    {
        value=(value/1000)+"K";
    }
    return value;
  }

  async function getRaces() {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/sendYear", {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
      // 'Access-Control-Allow-Origin': 'http://localhost:5000/'
    },
    body: JSON.stringify({year:-1}) // body data type must match "Content-Type" header
  })
    .then(response => response.json())
    .then(data => {setRaces(data["races"])});
    return response; // parses JSON response into native JavaScript objects
  }

  async function getPoints(race) {
    setIsLoading(true)
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/getPoints", {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({race:race})
  })
  .then(response => response.json())
  .then(data => setPoints(data["points"]))
  setIsLoading(false)
  }

  async function getCosts(race) {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/getCosts", {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({race:race})
  })
  .then(response => response.json())
  .then(data => setCosts(data["costs"]))
  }

  async function getLeagueInfo() {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/getLeagueInfo", {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({leagueID:id, token:localStorage.getItem('token')})
  })
  .then(response => response.json())
  .then(data => {setMemberTeamsList(data["memberTeamsList"]); setLeagueName(data["leagueName"]); setFname(data["fname"])})

  }




  // ////////////////////////////
  async function getUsersTeams() {
    unhidePopup()

    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/getUsersTeams", {
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
    if (data["teamList"] != null){
      setUsersTeams(data["teamList"])
      setTeamIDs(data["teamIDs"])
      // console.log(data["teamIDs"])
    }
    
  })
  }

  async function addTeam(teamID){

    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/addToLeague", {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({leagueID:id, token:localStorage.getItem('token'), teamID:teamID})
  })
  .then(response => response.json())
  .then(data => {changeSelected(data["fname"])})
  setTeamChange(!teamChange)
  setCurrentMember(fname)
  
  }

  async function removeTeam(){

    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/removeFromLeague", {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({leagueID:id, token:localStorage.getItem('token')})
  })
  .then(response => response.json())
  .then(data => {})
  setTeamChange(!teamChange)
  }

  function unhidePopup(){
    document.getElementById("teamsToAddList").style.display = "block";
  }

  function hidePopup(){
    document.getElementById("teamsToAddList").style.display = "none";
  }

  function changeSelected(name){
    const $select = document.querySelector('#leagueTeams');
    $select.value = name
    console.log(name)
  };


  function checkTeam(){

    return(Object.keys(memberTeamsList).includes(fname))
      
  }

  return (
    <div className="background">


      <h3 className = "leagueTitle white">League: {leagueName}</h3>
      <div className="main-view">        
        <div className = "memberNameList">
          <div className='dropDowns'>
            <div>
              <h5>Races:</h5>
              <select onChange={e => getPoints(e.target.value)} className="dropdownList">
              {races.map(key => Object.entries(key).map(([key, value]) => <option value={key} key={value}>{value}</option>))}
              </select>
            </div>
            <div>
              <h5>League Teams:</h5>
              <select onChange={e => {setCurrentMember(e.target.value)}} className="dropdownList" id="leagueTeams">
              <option disabled value="DEFAULT">Select A Member...</option>
              {console.log(Object.keys(memberTeamsList))}
              {Object.keys(memberTeamsList).map(key => <option value={key} key={key}>{key}</option>)}
              
              </select>
            </div>
            
          </div>
          {(!checkTeam())?(<button className="addTeamBtn" onClick={() => getUsersTeams()}>Add Team</button>) : (<button onClick={() => removeTeam()} className="delTeamBtn" >Remove My Team</button>)}
          
          <div className="teamsToAddList" id="teamsToAddList">
            <h3>Select a Team</h3>
            {Object.keys(usersTeams).map((key, value) => <div onClick={() => {addTeam(teamIDs[value]); hidePopup()}} className="teamsToAdd" value={key} ><b>{key}</b></div>)}
          </div>
          
        </div>

        <div className="memberTeam">

        <div className="titleCard"><div></div><b>Driver Name</b><b>Points</b><b>Cost</b><div></div></div>
        {
            
            memberTeamsList[currentMember]?.map(function(key) {        
              return(
                
                <div key={Object.values(key)} className="driverCard">
                  <img className='driverIcon' src={Object.values(key)}></img>
                  <b>{Object.keys(key)}</b>

                  
                  {(isLoading) ? (<img className="loadingSpinner" src={require('../images/spinner.gif')}/>):
                  (
                    (points[Object.keys(key)] > 0) ? (<div className='green'>{points[Object.keys(key)]}</div>):(<div className='red'>{points[Object.keys(key)]}</div>)
                  )}
                  {/* {(points[Object.keys(key)] > 0) ? (<div className='green'>{points[Object.keys(key)]}</div>):(<div className='red'>{points[Object.keys(key)]}</div>)} */}
                  <div>{convertBudget(costs[Object.keys(key)])}</div>
                </div>

              )                              
            })
          }     



        </div>

      </div>


      {/* <div className="popup-container">
      <div className="form-popup" id="formBG">
        <div className="form-container">
          <h3>Teams</h3>
          {Object.keys(usersTeams).map((key, value) => <div className="teamsToAdd" value={key}>{key}</div>)}
        </div>
      </div>
    </div>   */}


    </div>
    
  );
}

export default LeaguesPage