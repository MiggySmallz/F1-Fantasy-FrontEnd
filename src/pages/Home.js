import React, {useState, useEffect, useRef} from 'react'

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
  //   await fetch(backend_url + "/drivers").then(
  //     res => res.json()
  //   ).then(
  //     data => {
  //       setData(data)
  //       console.log(data.result[0])
  //     }
  //   )
// -------------------------------------Commented out just for less api use ------------------------------ //
  }


  return(
    <div>
      
      {(typeof data.result === 'undefined') ? (
        <p>Loading...</p>
      ) : (

        Object.entries(data.result[0].Abbreviation)
        .map( ([key, value]) => `My key is ${key} and my value is ${value}` )
      )}

      
      <div>
        <table className="table table-bordered" id="shopping-cart">
          <thead>
            <tr>
              <th><b>Driver</b></th>
              <th><b>Abbreviation</b></th>
              <th><b>#</b></th>
            </tr>
          </thead>
          <tbody>
            {(typeof data.result === 'undefined') ? (
              <p>Loading...</p>
            ) : (


              Object.entries(data.result[0].FullName).map(([key, value1]) => {
                
                return (
                    <tr>
                        <td>{value1}</td>
                        <td>{data.result[0].Abbreviation[key]}</td>
                        <td>{data.result[0].DriverNumber[key]}</td>
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