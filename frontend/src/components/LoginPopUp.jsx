import { useEffect, useState } from "react";
import { createAuth } from "../api/auth";

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
    e.preventdefault();
    //add show errors
    //createtoken
    const token = createAuth(formData);
    if (!token) {
      setFormData((prev) => ({ ...prev, password: "" }));
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
      <button>confirm</button>
    </form>
  );
}
