import React, {useState, useEffect, useRef} from 'react'
import {ProgressBar} from "react-bootstrap"
import "./TeamBuilder.css"


function TeamBuilder(){

  // const backend_url = "https://api.playf1fantasy.com"
  // const backend_url = "f1-fantasy-backend.us-east-2.elasticbeanstalk.com"

  
  const [budget, setBudget] = useState(100000000);
  const [constructors, setConstructors] = useState([]);
  const [constructorsNoChange, setConstructorsNoChange] = useState([]);
  const [constructorBtn, setConstructorBtn] = useState("btnOff")
  const [drivers, setDrivers] = useState([])
  const [driversNoChange, setDriversNoChange] = useState([])
  const [driverBtn, setDriverBtn] = useState("btnOn")
  const [hasConstructor, setHasConstructor] = useState(false)
  const [teamList, setTeamList] = useState([])
  const [teamName, setTeamName] = useState("")
  const[teamSaved, setTeamSaved] = useState(1)
  const[usersTeams, setUsersTeams] = useState([])
  const[userTeamsFound, setUserTeamsFound] = useState(false)
  const[currentTeam, setCurrentTeam] = useState("")
  const currentBudget = budget / 100000000*100;

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

  const addDriver = (info) =>{
    if (((teamList.length<5 && hasConstructor===false) || (teamList.length<6 && hasConstructor===true)) && budget-info.cost>0){
      return(
        setTeamList([...teamList, info]),
        setDrivers(drivers.filter(item => item.driver !== info.driver)),
        setBudget(budget-info.cost)
        // console.log(teamList)
        )
      }     
  }

  const addConstructor = (info) =>{
    if (teamList.length<6 && budget-info.cost>0 && hasConstructor===false){
      return(
        setTeamList([...teamList, info]),
        setConstructors(constructors.filter(item => item.constructor !== info.constructor)),
        setBudget(budget-info.cost),
        setHasConstructor(true)
        // console.log(teamList)
        )
      }     
  }

  const removeDriver = (info) => (
    setTeamList(teamList.filter(item => item.driver !== info.driver)),
    setDrivers([...drivers, info]),
    setBudget(budget+info.cost)
  )

  const removeConstructor = (info) => (
    setTeamList(teamList.filter(item => item.constructor !== info.constructor)),
    setConstructors([...constructors, info]),
    setBudget(budget+info.cost),
    setHasConstructor(false)
  )

  async function saveTeam() {
    if (localStorage.getItem('token') == null){
      alert("You must be signed in to create a team")
    }
    else{
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/saveTeam", {
        method: 'POST', 
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
          // 'Access-Control-Allow-Origin': 'http://localhost:5000/'
        },
        body: JSON.stringify({team:teamList, budget:budget, token:localStorage.getItem('token'), teamName: teamName}) // body data type must match "Content-Type" header
      })
      .then(response => {response.json(); setTeamSaved(true)})
      getUsersTeams();
    }
    
  }

  async function deleteTeam(e) {
    // console.log(e)
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/deleteTeam", {
    method: 'POST', 
    mode: 'cors',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({teamName:e, token:localStorage.getItem('token')}) // body data type must match "Content-Type" header
  })
  // .then(response => response.json())
  getUsersTeams();
  }


  async function getDrivers() {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/driversInfo", {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
      // 'Access-Control-Allow-Origin': 'http://localhost:5000/'
    },
    body: JSON.stringify({}) // body data type must match "Content-Type" header
  })
  .then(response => response.json())
  .then(data => {setDrivers(data["driverList"]); setConstructors(data["constructorList"]); setDriversNoChange(data["driverList"]); setConstructorsNoChange(data["constructorList"]);})
  // .then(console.log(drivers));
  }

  async function getUsersTeams() {
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
      setUserTeamsFound(true)
    }
  })
  }

  useEffect(() => {
    getDrivers();
    getUsersTeams();
    setTeamSaved(false);
  // }, [teamSaved])
  }, [])
  


  const handleOnClick = () =>{
    if (teamName == ""){
      alert("Team Name is Empty")
    }
    else{
      saveTeam()
    }
  }

  const addToTeamList = (team) => {
    setBudget(team.sort()[team.length - 1]["budget"])
    setTeamList(team.sort().slice(0,[team.length - 1]))    
    setDrivers(driversNoChange);
    setConstructors(constructorsNoChange);
    
    let newDriversList = driversNoChange;
    let newConstructorsList = constructorsNoChange;
    let newDriversListFiltered = [];
    let newConstructorsListFiltered = [];
    let isConstructor = false

    // added -1 to length to account for "budget" in list
    for (let i = 0; i < team.length-1; i++){
      if (team[i]["driver"] != undefined){
        newDriversListFiltered = newDriversList.filter(item => item.driver !== team[i]["driver"])
      }
      else if(team[i]["constructor"] != undefined){
        newConstructorsListFiltered = newConstructorsList.filter(items => items.constructor !== team[i]["constructor"])
        isConstructor = true
      }
      else{
        console.log(team[i]["budget"])
      }
      newDriversList = newDriversListFiltered
    }
    newConstructorsList = newConstructorsListFiltered
    
    if (isConstructor == true){
      // console.log(newConstructorsList)
      setConstructors(newConstructorsList)
    }

    setDrivers(newDriversList)
  }

  return (
    <div className="container-TeamBuilder">
      {/* <div className="teams">
        <div className="teamTitle">
          My Teams
        </div>
        <div className="team-list-container">
          {(userTeamsFound == false) ? (<h3 className='white'>No Teams Found</h3>):(<h3></h3>)}
          {
            Object.keys(usersTeams).map(function(key, index) {
              return(
                <div onClick={() => {addToTeamList(usersTeams[key]); console.log(usersTeams)}} className='team-item-container highlight'>
                  <p className="teamName">{key}</p>
                  <button className="teamDelete white" value={key} onClick={e => deleteTeam(e.target.value)}>Delete</button>
                </div>
              )
            })
          }
        </div>
      </div> */}
      <div className='container-team-select'>
        <div className='budget white'>Budget:<ProgressBar className='progressBar'  variant="success" now={currentBudget} /*label={`${budget}`}*//>${convertBudget(budget)}</div>
        <div className='break'></div>
        {/* <div className='teamList'> */}
        <div className='userTeamList'>
            <select onChange = {(event) => {addToTeamList(usersTeams[event.target.value]); setCurrentTeam(event.target.value)}} className="selectorButton white">
              <option selected disabled hidden value="none">Select Team</option>
              {Object.keys(usersTeams).map((key, value) => <option value={key}>{key}</option>)}
            </select>
            {/* <div className="teamNameInput">
              <input onChange={e => setTeamName(e.target.value)} placeholder="Enter team name:"></input>
              <button className="saveTeamButton" onClick={() => handleOnClick()} >Save Team</button>
            </div> */}

            { teamList.sort((a, b) => a.id > b.id ? 1 : -1).map((item) =>{
              if (item.driver != null){
                return(
                  <div onClick={() => removeDriver(item)} className='item-container highlight'>
                    <img className='driverImg' src={item.driverImg} width="500" height="600"></img>
                    <div className='driverTitle'>
                      {item.driver}
                    </div>
                    <div className='priceLabelDiv'>
                      <p className='priceLabel'>${convertBudget(item.cost)}</p>
                    </div>
                  </div>                
                )
              }
              else{
                return(
                  <div onClick={() => removeConstructor(item)} className='item-container highlight'>
                    <img className='constructorImg' src={item.constructorImg} width="500" height="600"></img>
                    <div className='driverTitle'>
                      {item.constructor}
                    </div>
                    <div className='priceLabelDiv'>
                      <p className='priceLabel'>${convertBudget(item.cost)}</p>
                    </div>
                  </div>
                )
              }
            })}
            {(currentTeam != "")?(<button className="teamDelete white" onClick={e => deleteTeam(currentTeam)}>Delete Team</button>):(<br/>)}
            <div className="teamNameInput">
              <input onChange={e => setTeamName(e.target.value)} placeholder="Enter team name:"></input>
              <button className="saveTeamButton" onClick={() => handleOnClick()} >Save Team</button>
            </div>

        </div>
        <div className='break-column'></div>
        <div className="selectorButtons">
            <button id={driverBtn} className="selectorButton white" onClick={() => {setDriverBtn((driverBtn) => (driverBtn === "btnOff" ? "btnOn" : "btnOff")); setConstructorBtn((constructorBtn) => (constructorBtn === "btnOn" ? "btnOff" : "btnOn"))}} >Drivers</button>
            <button id={constructorBtn} className="selectorButton white" onClick={() => {setConstructorBtn((constructorBtn) => (constructorBtn === "btnOff" ? "btnOn" : "btnOff")); setDriverBtn((driverBtn) => (driverBtn === "btnOn" ? "btnOff" : "btnOn"))}} >Constructors</button>
          
        <div className='teamList'>
            
            { (driverBtn === "btnOn")?
            (drivers.sort((a, b) => a.cost < b.cost ? 1 : -1).map((item) =>{
              return(
                <div onClick={() => addDriver(item)} className='item-container highlight'>
                  <img className='driverImg' src={item.driverImg} width="500" height="600"></img>
                  <div className='driverTitle'>
                    {item.driver}
                  </div>
                  <div className='priceLabelDiv'>
                    <p className='priceLabel'>${convertBudget(item.cost)}</p>
                  </div>
                </div>
              )
            }))
            :
            (constructors.sort((a, b) => a.cost < b.cost ? 1 : -1).map((item) =>{
              return(
                <div onClick={() => {addConstructor(item); console.log(item)}} className='item-container highlight'>
                  
                  <img className='constructorImg' src={item.constructorImg} width="500" height="600"></img>
                  
                  <div className='driverTitle'>
                    {item.constructor}
                  </div>

                  <div className='priceLabelDiv'>
                    <p className='priceLabel'>${convertBudget(item.cost)}</p>
                  </div>
                  
                </div>
              )
            }))
            }
        </div>
        </div>
        
      </div>
    </div>
  );
}


export default TeamBuilder