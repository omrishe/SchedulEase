import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="mainWindow notFoundContainer">
      <span className="notFoundTitle">404</span>
      <p className="welcomeParagraph">Page Not Found</p>
      <p className="notFoundSubtitle">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="notFoundActions">
        <button
          className="loginBtn notFoundBackBtn"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
        <button
          className="registerBtn"
          onClick={() => navigate("/store/default")}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
