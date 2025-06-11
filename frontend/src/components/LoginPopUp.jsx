import { useEffect, useState } from "react";
import { Signup, logIn } from "../api/auth";

export default function LoginPopUp({setToken,className}) {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
  });
  const [message,setMessage]=useState("");

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleRegister(e) {
    e.preventDefault();
    //add show errors
    const serverResponse = await Signup(formData);
    //console.log("in compnent loging Popup status is ",serverResponse.message);
    if(serverResponse.message){
      setMessage(serverResponse.message);
    }
    if (serverResponse.message==="created successfully") {
      setFormData((prev) => ({ ...prev, password: "" }));
    }
  }

  async function login() {
    const authResult = await logIn(formData);
    if(authResult.message==="logged in successfully"){
      setMessage("logged in successfully");
      setToken(authResult.token);
      setFormData((prev) => ({ ...prev, password: "" }));
    }
    else{
      setMessage(authResult.message);
    }
    }

  function validate() {
    const errors = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email) || !formData.email) {
      errors.email = "email is invalid";
    }
    if (!formData.name) {
      errors.name = "name is invalid";
    }
    return errors;
  }

  return (
    <div className={className}>
    <form onSubmit={handleRegister}>
      <label htmlFor="emailInput">email</label>
      <input id="emailInput" type="text" name="email" onChange={handleChange} />
      <label htmlFor="password">password</label>
      <input
        id="password"
        type="password"
        name="password"
        onChange={handleChange}
      />
      <button type="button" onClick={login}>
        confirm
      </button>
      <button>register</button>
    </form>
    {message && <p>{message}</p>}
    </div>
  );
}
