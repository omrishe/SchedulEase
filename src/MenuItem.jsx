import "./App.css";
export default function MenuItems({ menuItemsList, onClick }) {
  return (
    <div className="scrollableMenu">
      {menuItemsList.map((item) => (
        <button className="itemBtn" key={item.name} onClick={onClick}>
          <span>{item.name}</span>
          <span>{item.price}</span>
        </button>
      ))}
    </div>
  );
}
