import { useNavigate } from "react-router-dom";

export default function StoreNotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="mainWindow notFoundContainer">
      <span className="notFoundTitle">Store Not Found</span>
      <p className="welcomeParagraph">Oops! Store Not Found</p>
      <p className="notFoundSubtitle">
        The store you're looking for doesn't exist or has been removed.
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
          onClick={() => navigate("/store/demo-store")}
        >
          Try our Demo Store
        </button>
      </div>
    </div>
  );
}
