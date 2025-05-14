import "./App.css";
import MenuItems from "./MenuItem";
function App() {
  function openWaze() {
    const latitude = 32.051403;
    const longitude = 34.811563;
    const wazeurl = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
    window.open(wazeurl, "_blank");
  }
  function openWhatsapp() {
    const whatsappUrl = `https://wa.me/00000000`;
    window.open(whatsappUrl, "_blank");
  }
  function openPhone() {
    window.location.href = "tel:+00000000";
  }
  return (
    <div className="mainWindow">
      <p className="welcomeParagraph">welcome</p>
      <button className="loginBtn">already have a user? log in</button>
      <div className="ContactInfoContainer">
        <button className="whatsappBtn" onClick={openWhatsapp}></button>
        <button className="phoneBtn" onClick={openPhone}></button>
        <button className="wazeBtn" onClick={openWaze}></button>
      </div>
      <div className="Menu">
        <MenuItems
          menuItemsList={[
            { price: "50", name: "hi" },
            { price: "20", name: "boo" },
          ]}
        ></MenuItems>
      </div>
    </div>
  );
}

export default App;
