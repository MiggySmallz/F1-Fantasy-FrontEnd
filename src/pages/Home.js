import React, {useState, useEffect, useRef} from 'react'
import "./Home.css"

function Home(){

  // const backend_url = "https://api.playf1fantasy.com"
  // const backend_url = "http://f1fantasyapi-env.eba-w3fistyc.us-east-2.elasticbeanstalk.com"
  const [data, setData] = useState("")
  const didMount = useRef(false);
  // const [img, setImg] = useState();

  useEffect(() => {
    if (!didMount.current) {
      getApi();
      // getPic();
      didMount.current = true;
      return;
    }
  },[data])

  

  async function getApi(){
// -------------------------------------Commented out just for less api use ------------------------------ //
    await fetch(process.env.REACT_APP_BACKEND_URL + "/drivers").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data.result[0])
      }
    )
// -------------------------------------Commented out just for less api use ------------------------------ //
  }


  return(
    <div>
      <h1 className="white title">2022 Final Points</h1>      
      <div>
        <table className="table table-bordered standings-table">
          <thead>
            <tr>
              <th><b>Position</b></th>
              <th><b>Driver</b></th>
              <th><b>Team</b></th>
              <th><b>Points</b></th>
            </tr>
          </thead>
          <tbody>
            {(typeof data.result === 'undefined') ? (
              <p className="white">Loading...</p>
            ) : (

              data.result.map(key => {
                
                return (
                    <tr>
                        <td>{key[0]}</td>
                        <td>{key[1]}</td>
                        <td>{key[2]}</td>
                        <td>{key[3]}</td>
                    </tr>
                )
              })
            )}

          </tbody>
        </table>
      </div>
    </div>

    

  )
}

export default Home