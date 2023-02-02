import React, {useState, useEffect, useRef} from 'react'
import "./Home.css"

function Stats(){

  const [raceData, setRaceData] = useState("")
  const [qualiData, setQualiData] = useState("")
  const didMount = useRef(false);
  const [img, setImg] = useState();
  const [askedApi, setAskedApi] = useState(false);
  const [selected, setSelected] = React.useState("Race");
  const [selectedRaces, setSelectedRaces] = useState([]);
  const [selectedRaceType, setSelectedRaceType] = useState("Race");
  const [selectedYear, setSelectedYear] = useState();

  const year = ['2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'];

  const backend_url = "https://api.playf1fantasy.com"
  // const backend_url = "http://f1fantasyflask-3.eba-ugqpypxw.us-east-2.elasticbeanstalk.com"

  let type = null;
  let options = null;
  let yearOptions = null;

  useEffect(() => {
    if (!didMount.current) {
      // getApi();
      // getPic();
      // getRaces();
      didMount.current = true;
      return;
    }
  },[img])

  const changeSelectOptionHandler = (event) => {
    setSelected(event.target.value);
  };

  const changeSelectYearOptionHandler = (event) => {
    setSelectedYear(event.target.value);
    postData(event.target.value);
  };

  const changeSelectEventTypeOptionHandler = (event) => {
    setSelectedRaceType(document.getElementById("raceType").value)

    if (document.getElementById("raceType").value == "Race"){
      getRaceResult(selectedYear,event.target.value)
    }
    else{
      getQualiResult(selectedYear,event.target.value)
    }
    setAskedApi(true)
  };

  async function postData(year) {
      const response = await fetch(backend_url + "/sendYear", {
      method: 'POST', 
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
        // 'Access-Control-Allow-Origin': 'http://localhost:5000/'
      },
      body: JSON.stringify({year:year}) // body data type must match "Content-Type" header
    })
    .then(response => response.json())
    .then(data => setSelectedRaces(data["races"]));
    return response; // parses JSON response into native JavaScript objects
  }

  async function getPic(){
    const response = await fetch(backend_url + "/get_image");
    const imageBlob = await response.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    setImg(imageObjectURL);
  }

  async function getRaceResult(year,race) {
    const response = await fetch(backend_url + "/getRaceResults", {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({year:year, race:race})
  })
  .then(response => response.json())
  .then(data => setRaceData(data))

  return response;
  }

  async function getQualiResult(year,race) {
    const response = await fetch(backend_url + "/getQualiResults", {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({year:year, race:race})
  })
  .then(response => response.json())
  .then(data => setRaceData(data))

  return response;
  }

  async function getApi(){
    await fetch(backend_url + "/drivers").then(
      res => res.json()
    ).then(
      data => {
        setRaceData(data)
        console.log(data.result[0])
      }
    )
  }

  if (selected === "Race") {
    type = selectedRaces;

  } else if (selected === "Year") {
    type = year;
  }

  if (type) {
    // options = type.map((el) => <option key={el}>{el}</option>);
    options = type.map(key => Object.entries(key).map(([key, value]) => <option value={key} key={value}>{value}</option>));
  }
  if (type) {
    yearOptions = year.map((el) => <option key={el}>{el}</option>);
  }

  

  return (
    <div
      style={{
        padding: "16px",
        margin: "16px",
        textAlign: 'center',
      }}
    >
      <form>
        <div>
          <select id="raceType">
            <option selected disabled hidden>Select Event Type</option>
            <option value="Race">Race</option>
            <option value="Qualifier">Qualifier</option>
          </select>
          
          <select onChange={changeSelectYearOptionHandler}>
            <option value="none" selected disabled hidden>Select a Year</option>
            {yearOptions}
          </select>

          <select onChange={changeSelectEventTypeOptionHandler}>
            {options}
          </select>
        </div>
      </form>

      <div>
            
      <div>
        <table className="table table-bordered standings-table" id="shopping-cart">
          <thead>
            <tr>
              {(selectedRaceType === "Race") ? (<th><b>Pos</b></th>):(<th><b>Pos</b></th>)}
              {(selectedRaceType === "Race") ? (<th><b>No</b></th>):(<th><b>Driver</b></th>)}
              {(selectedRaceType === "Race") ? (<th><b>Driver</b></th>):(<th><b>Team</b></th>)}
              {(selectedRaceType === "Race") ? (<th><b>Team</b></th>):(<th><b>Q1</b></th>)}
              {(selectedRaceType === "Race") ? (<th><b>Time</b></th>):(<th><b>Q2</b></th>)}
              {(selectedRaceType === "Race") ? (<th><b>Points</b></th>):(<th><b>Q3</b></th>)}
              {/* <th><b>Pos</b></th>
              <th><b>No</b></th>
              <th><b>Driver</b></th>
              <th><b>Car</b></th>
              <th><b>Time</b></th>
              <th><b>Points</b></th> */}
            </tr>
          </thead>
          <tbody>
        
            {(typeof raceData.result === 'undefined') ? (
                
                (askedApi === false) ? (<tr>Waiting for selection...</tr>):(<tr>Asking Mr API... This may take a second</tr>)

            ) : (
              // <tr>Waiting for selection...</tr>
              // (selectedRaceType == "Race") ? (
                
                raceData.result.map((key) => {
                  return (
                    <tr>
                      <td>{key[0]}</td>
                      <td>{key[1]}</td>
                      <td>{key[2]}</td>
                      <td>{key[3]}</td>
                      <td>{key[4]}</td>
                      <td>{key[5]}</td>
                    </tr>
                  )
                })

              // ) : (
              //   qualiData.result.map((key) => {
              //     return (
              //       <tr>
              //         <td>{key[0]}</td>
              //         <td>{key[1]}</td>
              //         <td>{key[2]}</td>
              //         <td>{key[3]}</td>
              //         <td>{key[4]}</td>
              //         <td>{key[5]}</td>
              //       </tr>
              //     )
              //   })
              // ) 
            )}

          </tbody>
        </table>
      </div>
    </div>

    </div>
  );

}

export default Stats