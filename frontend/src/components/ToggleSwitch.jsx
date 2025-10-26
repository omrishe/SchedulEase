import { useState } from "react";
import "../../ToggleButton.css";

export default function ToggleSwitch({ label, onToggle }) {
  const [btnIsOn, setbtnIsOn] = useState(false);

  const handleToggle = () => {
    //made a new State variable cause we need the state in the if
    const newState = !btnIsOn;
    setbtnIsOn(newState);
    if (onToggle) {
      onToggle(newState);
    } // notify parent
  };

  return (
    <div className="toggle-btn-container">
      {label && <span className="toggle-label">{label}</span>}
      <div
        className={`toggle-btn ${btnIsOn ? "on" : "off"}`}
        onClick={handleToggle}
      >
        <div className="toggle-thumb" />
      </div>
    </div>
  );
}
