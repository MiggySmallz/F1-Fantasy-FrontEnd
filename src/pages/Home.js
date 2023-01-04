import React, {useState, useEffect, useRef} from 'react'
import "./Home.css"

function Home(){

  const backend_url = "http://localhost:5000"
  // const backend_url = "http://f1fantasyflask-3.eba-ugqpypxw.us-east-2.elasticbeanstalk.com"
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
    await fetch(backend_url + "/drivers").then(
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
      
      {/* {(typeof data.result === 'undefined') ? (
        <p>Loading...</p>
      ) : (

        // Object.entries(data.result[0].Abbreviation)
        // .map( ([key, value]) => `My key is ${key} and my value is ${value}` )
        data.result.map(key => key)
      )} */}

      
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
              // Object.entries(data.result[0].FullName).map(([key, value1]) => {
                
              //   return (
              //       <tr>
              //           <td>{value1}</td>
              //           <td>{data.result[0].Abbreviation[key]}</td>
              //           <td>{data.result[0].DriverNumber[key]}</td>
              //       </tr>
              //   )
              // })
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