import React, {useState, useEffect, useRef} from 'react'
import "./LeaguePage.css"
import { useNavigate, Link, useParams } from "react-router-dom";

function LeaguesPage() {

  let { id } = useParams();
  const backend_url = "http://localhost:5000"

  const [memberTeamsList,setMemberTeamsList] = useState({})
  const [leagueName, setLeagueName] = useState("")
  const [currentMember, setCurrentMember] = useState("Kris")

  useEffect(() => {
    
    getLeagueInfo()
    
  },[])

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


  return (
    <div className="background">
      {/* <h3>ID: {id}</h3> */}
      <h3 className = "leagueTitle">League: {leagueName}</h3>
      <div className="main-view">
        
        <div className = "memberNameList">
          {console.log(memberTeamsList["Miguel"])}
          {
            Object.keys(memberTeamsList).map(function(key, index) {
              return(
                <div className='names'>
                  {key}
                </div>
              )
            })
          }
        </div>

        <div className="memberTeam">
          {
            memberTeamsList["Christina"]?.map(function(key) {        
              return(
                <div className='driverCard'>
                  <img className='driverIcon'src={Object.values(key)}></img>
                  <h5 className='fontWhite'>{Object.keys(key)}</h5>
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