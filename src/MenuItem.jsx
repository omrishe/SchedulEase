import "./App.css";
export default function MenuItems({ menuItemsList, onClick }) {
  return (
    <div className="scrollableMenu">
      {menuItemsList.map((item, index) => (
        <button className="itemBtn" key={index} onClick={onClick}>
          <span>{item.name}</span>
          <span>{item.price}</span>
        </button>
      ))}
    </div>
  );
}
