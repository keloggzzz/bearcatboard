import {useState, useContext} from "react";
import { DataContext } from "../App";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEnvelope, faLock} from '@fortawesome/free-solid-svg-icons'

export default function Login(){
const [email,setEmail]=useState("");
const [pwd, setPwd]=useState("");

const { logStatus, setLogStatus } = useContext(DataContext); 


function check(){
    if(email.trim()==="" || pwd.trim() === ""){
            alert("Please fill out both fields.");
            return;
    
    }if(email.trim()==="user1"  && pwd.trim() === "test"){
        alert("Login successful!");
        sessionStorage.setItem("logged",1); 
        setLogStatus(1);
    
    } else{
    alert("Invalid credentials");
    }
}

function logout(){
    sessionStorage.setItem("logged", 0);
    setLogStatus(0);
    
  }

var login=<div>


<div className="loginDiv">
    <h1>Welcome Back, Bearcat</h1>
    <h2>Sign in to get access to exclusive offers and reccomendations</h2>
    <br></br>

<div className="credentialsDiv">
<p className="loginP">Email*:</p>
<div className="loginFieldContainer">
   <FontAwesomeIcon icon={faEnvelope} className="fieldIcon"/>
   <input className="fields" type="text" id="email" value={email} placeholder="Enter Email Address" onChange={(e)=>{setEmail(e.target.value)}}/>
</div>
   <br></br>
   <p className="loginP">Password*:</p>
<div className="loginFieldContainer">
    <FontAwesomeIcon icon={faLock} className="fieldIcon" />
  
   <input className="fields" type="password" id="pwd" value={pwd} placeholder="Enter password" onChange={(e)=>{setPwd(e.target.value)}}/>
  <br></br><br></br>
  </div>
  </div>
  <br></br>
  



  <input className="loginButton" type="button" value="Login" onClick={check}/>
  <br></br><br></br>

  Don't have an account?
  <input className="signUpLink" type="button" value="Sign Up"/>

</div>
</div>


var logoutUser=<div>
<h2 className="text-pink-500">You are logged in!</h2>
<br></br>
</div>
  return(
    <div className="loginPage">
        <div className="loginPhotoDiv">
            <img src="images/LoginPhoto.png" alt="login" />
        </div>
        <div>
            <div>{logStatus===0?login:logoutUser}</div>
       </div>
    </div>
  );
}
