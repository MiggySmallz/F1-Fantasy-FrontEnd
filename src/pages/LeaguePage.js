import React, {useState, useEffect, useRef} from 'react'
import "./LeaguePage.css"
import { useNavigate, Link, useParams } from "react-router-dom";

function LeaguesPage() {

  let { id } = useParams();
  // const backend_url = "https://api.playf1fantasy.com"
  const [memberTeamsList,setMemberTeamsList] = useState({})
  const [points,setPoints] = useState({})
  const [costs,setCosts] = useState({})
  const [leagueName, setLeagueName] = useState("")
  const [currentMember, setCurrentMember] = useState("Kris")
  const [races, setRaces] = useState([])

  useEffect(() => {
    
    getLeagueInfo()
    getRaces()
    getPoints()
    getCosts()

  },[])

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
    .then(data => {setRaces(data["races"]); console.log(data["races"])});
    return response; // parses JSON response into native JavaScript objects
  }

  async function getPoints(race) {
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
    body: JSON.stringify({leagueID:id})
  })
  .then(response => response.json())
  .then(data => {setMemberTeamsList(data["memberTeamsList"]); setLeagueName(data["leagueName"])})
  }

  const setMember = (key) => {
    setCurrentMember(key)
  }


  return (
    <div className="background">
      <h3 className = "leagueTitle white">League: {leagueName}</h3>
      <div className="main-view">        
        <div className = "memberNameList">
          <div className='dropDowns'>
            <div>
              <h4>Races:</h4>
              <select onChange={e => getPoints(e.target.value)} className="dropdownList">
              {races.map(key => Object.entries(key).map(([key, value]) => <option value={key} key={value}>{value}</option>))}
              </select>
            </div>
            <div>
              <h4>League Members:</h4>
              <select onChange={e => setMember(e.target.value)} className="dropdownList">
              {Object.keys(memberTeamsList).map(key => <option value={key} >{key}</option>)}
              </select>
            </div>
          </div>
          

          


          {/* <h4 className="memberTitle">League Members</h4>
          {
            Object.keys(memberTeamsList).map(function(key, index) {
              return(
                <div className='memberName white' onClick={() => setMember(key)}>
                  {key}
                </div>
              )
            })
          } */}
        </div>

        <div className="memberTeam">

        {/* <table className="memberTeam-table white">
          <thead>
            <tr>
              <td></td>
              <td>Driver</td>
              <td>Points</td>
              <td>Cost</td>
              <td></td>
            </tr>
          </thead>
          <tbody>

          
          {
            memberTeamsList[currentMember]?.map(function(key) {        
              return(

                <tr>
                  <td></td>
                  <td className='driverIcon'><img className='driverIcon' src={Object.values(key)}></img>{Object.keys(key)}</td>
                  {(points[Object.keys(key)] > 0) ? (<td className='green'>{points[Object.keys(key)]}</td>):(<td className='red'>{points[Object.keys(key)]}</td>)}
                  <td>{convertBudget(costs[Object.keys(key)])}</td>
                  <td></td>
                </tr>

              )                              
            })
          }       
          </tbody>
        </table>    */}
        <div className="titleCard"><div></div><div>Driver Name</div><div>Points</div><div>Cost</div><div></div></div>
        {
            memberTeamsList[currentMember]?.map(function(key) {        
              return(

                <div className="driverCard">
                  <img className='driverIcon' src={Object.values(key)}></img>
                  <b>{Object.keys(key)}</b>
                  {(points[Object.keys(key)] > 0) ? (<div className='green'>{points[Object.keys(key)]}</div>):(<div className='red'>{points[Object.keys(key)]}</div>)}
                  <div>{convertBudget(costs[Object.keys(key)])}</div>
                </div>

              )                              
            })
          }     




        </div>

      </div>
    </div>
    
  );
}

export default LeaguesPage