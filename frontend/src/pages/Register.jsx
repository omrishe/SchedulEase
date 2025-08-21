import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate,useParams} from "react-router-dom";

function Register({ setToken, className }) {
  const {slug}=useParams()
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    email: "",
    storeSlug:slug
  });
  const navigatePage = useNavigate();
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleRegister(e) {
    e.preventDefault();
    console.log(formData);
    const serverResponse = await signup(formData);
    if (serverResponse.isSuccess) {
      setMessage(serverResponse.message + " you will be redirected soon");
      setFormData({ userName: "", password: "", email: "" });
      setTimeout(() => navigatePage(`/store/${slug}/`), 1500);
    }
    else{
      setMessage(serverResponse.message);
    }
  }

  function validate() {
    const errors = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email) || !formData.email) {
      errors.email = "email is invalid";
    }
    if (!formData.userName) {
      errors.userName = "name is invalid";
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
        <label htmlFor="userNameInput">name</label>
        <input
          id="userNameInput"
          type="text"
          name="userName"
          value={formData.userName}
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
