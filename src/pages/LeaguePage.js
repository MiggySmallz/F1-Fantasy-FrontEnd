import React, {useState, useEffect, useRef} from 'react'
import "./LeaguePage.css"
import { useNavigate, Link, useParams } from "react-router-dom";

function LeaguesPage() {

  let { id } = useParams();
  const backend_url = "http://localhost:5000"
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

  async function getRaces() {
    const response = await fetch(backend_url + "/sendYear", {
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
    const response = await fetch(backend_url + "/getPoints", {
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
    const response = await fetch(backend_url + "/getCosts", {
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
    const response = await fetch(backend_url + "/getLeagueInfo", {
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
      {/* <h3>ID: {id}</h3> */}
      <h3 className = "leagueTitle white">League: {leagueName}</h3>
      <div>
        <select onChange={e => getPoints(e.target.value)} className="raceList">
            {races.map(key => Object.entries(key).map(([key, value]) => <option value={key} key={value}>{value}</option>))}
        </select>
      </div>
      <div className="main-view">        
        <div className = "memberNameList">
          {/* {console.log(memberTeamsList["Miguel"])} */}
          <h3>League Members</h3>
          {
            Object.keys(memberTeamsList).map(function(key, index) {
              return(
                <div className='memberName white' onClick={() => setMember(key)}>
                  {key}
                </div>
              )
            })
          }
        </div>

        <div className="memberTeam">

        <table className="memberTeam-table white">
          <thead>
            <tr>
              <td></td>
              <td>Driver</td>
              <td>Points</td>
              <td>Cost</td>
            </tr>
          </thead>
          <tbody>

          
          {
            memberTeamsList[currentMember]?.map(function(key) {        
              return(
                // <div className='driverCard'>
                <tr>
                  <td><img className='driverIcon'src={Object.values(key)}></img></td>
                  <td>{Object.keys(key)}</td>
                  {(points[Object.keys(key)] > 0) ? (<td className='green'>{points[Object.keys(key)]}</td>):(<td className='red'>{points[Object.keys(key)]}</td>)}
                  <td>{costs[Object.keys(key)]}</td>
                </tr>
                
                // </div>
              )                              
            })
          }       
          </tbody>
        </table>   
        </div>

      </div>
    </div>
    
  );
}

export default LeaguesPage