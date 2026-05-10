import { useState } from "react";
import { userLogIn } from "../services/authService.js";
import { useNavigate, useParams } from "react-router-dom";

export default function LoginPage({ updateAuthData }) {
  const { slug } = useParams();
  const navigatePage = useNavigate();
  const [formData, setFormData] = useState({
    Username: "",
    password: "",
    email: "",
    slug: slug,
  });
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleLogIn(e) {
    e.preventDefault();
    const authResult = await userLogIn(formData);
    if (authResult.isSuccess) {
      const message = authResult.message; //extract message recieved from server
      const authData = authResult.otherData; //extract user Data recieved from server
      await updateAuthData(authData);
      setMessage(message + " you will be redirected soon");
      setFormData((prev) => ({ ...prev, password: "" }));
      setTimeout(() => navigatePage(`/store/${slug}/`), 1500);
    } else {
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
    <div className="mainWindow">
      <p className="welcomeParagraph">Login to Your Account</p>
      <form onSubmit={handleLogIn}>
        <label htmlFor="emailInput">Email</label>
        <input
          id="emailInput"
          type="text"
          name="email"
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
