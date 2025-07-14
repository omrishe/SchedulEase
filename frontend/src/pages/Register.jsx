import { useState } from "react";
import { signup } from "../api/auth";
function Register({ setToken, className }) {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
  });
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleRegister(e) {
    e.preventDefault();
    //add show errors
    //add validate
    console.log(formData);
    const serverResponse = await signup(formData);
    //console.log("in compnent loging Popup status is ",serverResponse.message);
    if (serverResponse.message) {
      setMessage(serverResponse.message);
    }
    if (serverResponse.message === "created Successfully") {
      setFormData({ name: "", password: "", email: "" });
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
    <div className="mainWindow">
      <p className="welcomeParagraph">register new account</p>
      <form
        onSubmit={handleRegister}
        style={{ flexDirection: "column", display: "flex" }}
      >
        <label htmlFor="nameInput">name</label>
        <input
          id="nameInput"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <label htmlFor="emailInput">email</label>
        <input
          id="emailInput"
          type="text"
          name="email"
          onChange={handleChange}
          value={formData.email}
        />
        <label htmlFor="password">password</label>
        <input
          id="password"
          type="password"
          name="password"
          onChange={handleChange}
          value={formData.password}
        />
        <button type="submit"> submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
export default Register;
