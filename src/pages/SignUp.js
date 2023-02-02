import React, {useState, useEffect, useRef} from 'react'
import "./SigningForm.css"
import { useNavigate } from "react-router-dom";

function SignUp(){


  const backend_url = "https://api.playf1fantasy.com"
  // const backend_url = "http://f1fantasyflask-3.eba-ugqpypxw.us-east-2.elasticbeanstalk.com"
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")

  let navigate = useNavigate();
  // useEffect(() => {
   
  // })

  async function sendSignUp() {
    const response = await fetch(backend_url + "/signUp", {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({firstName:firstName, lastName:lastName, email:email, pass:pass}) // body data type must match "Content-Type" header
    })
  }

  const handleSubmit = async e => {
    e.preventDefault();
    await sendSignUp();
    navigate('/Home');  
  }


  return (
    <div className="background">
      {/* <div className="sign-up-container">
        <h1>Sign Up</h1>
        <input className="input"></input>
        <input className="input"></input>
      </div> */}
      <div class="box" id="signup">
        <form onSubmit={handleSubmit}>
            <span class="text-center">Sign Up</span>
            <div class="input-container">
              <input onInput={e => setFirstName(e.target.value)} type="text" required/>
              <label>First Name</label>		
            </div>
            <div class="input-container">
              <input onInput={e => setLastName(e.target.value)} type="text" required/>
              <label>Last Name</label>		
            </div>
            <div class="input-container">		
              <input onInput={e => setEmail(e.target.value)} type="text" required/>
              <label>Email</label>
            </div>
            <div class="input-container">		
              <input onInput={e => setPass(e.target.value)} type="password" required/>
              <label>Password</label>
            </div>
            <button type="submit" class="btn">Submit</button>
          
        </form>	
      
      </div>
    </div>
    
  );

}

export default SignUp