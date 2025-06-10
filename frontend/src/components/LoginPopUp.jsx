import { useEffect, useState } from "react";
import { Signup, logIn } from "../api/auth";

export default function LoginPopUp() {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
  });

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    //add show errors
    //createtoken
    const Status = Signup(formData);
    console.log("success");
    if (!Status) {
      setFormData((prev) => ({ ...prev, password: "" }));
    }
  }

  async function login() {
    const token = await logIn(formData);
    console.log("success");
    if (token instanceof Error) {
      //there was an error
      console.log(token);
    }
    if (!token) {
      //returns ok
      setFormData((prev) => ({ ...prev, password: "" }));
    } else {
      //token is empty
      console.log(token);
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
    <form onSubmit={handleSubmit}>
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
  );
}
