import { useState } from "react";
import { signup } from "../services/authService.js";
import { useNavigate, useParams } from "react-router-dom";
import { getErrorMessage } from "../utils/errorHandling.js";

function RegisterPage({ setToken, className }) {
  const { slug } = useParams();
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    email: "",
    storeSlug: slug,
  });

  const navigatePage = useNavigate();
  const [message, setMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleRegister(e) {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    const serverResponse = await signup(formData);
    if (serverResponse.isSuccess) {
      setMessage(serverResponse.message + " you will be redirected soon");
      setFormData({ userName: "", password: "", email: "" });
      setTimeout(() => navigatePage(`/store/${slug}/login`), 1500);
    } else {
      setMessage(getErrorMessage(serverResponse.code));
    }
  }

  function validateForm() {
    const errors = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email) || !formData.email) {
      errors.email =
        "Invalid email address. Must contain '@' and a valid domain";
    }
    if (!formData.userName) {
      errors.userName = "name cant be empty";
    }
    if (!formData.password) {
      errors.password = "password cant be empty";
    } else if (
      formData.password.length < 7 ||
      !/[A-Z]/.test(formData.password) ||
      !/\d/.test(formData.password)
    ) {
      errors.password =
        "Password must be at least 7 characters long and include at least 1 uppercase letter and 1 number.";
    }
    return errors;
  }

  return (
    <div className="mainWindow">
      <p className="welcomeParagraph">Create Your Account</p>
      <form
        onSubmit={handleRegister}
        style={{ flexDirection: "column", display: "flex" }}
      >
        <label htmlFor="userNameInput">Name</label>
        <input
          id="userNameInput"
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
        />
        {formErrors.userName && (
          <span
            style={{ color: "red", fontSize: "0.8rem", marginBottom: "10px" }}
          >
            {formErrors.userName}
          </span>
        )}
        <label htmlFor="emailInput">Email</label>
        <input
          id="emailInput"
          type="text"
          name="email"
          onChange={handleChange}
          value={formData.email}
        />
        {formErrors.email && (
          <span
            style={{ color: "red", fontSize: "0.8rem", marginBottom: "10px" }}
          >
            {formErrors.email}
          </span>
        )}
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          onChange={handleChange}
          value={formData.password}
        />
        {formErrors.password && (
          <span
            style={{ color: "red", fontSize: "0.8rem", marginBottom: "10px" }}
          >
            {formErrors.password}
          </span>
        )}
        <button type="submit">Create Account</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
export default RegisterPage;
