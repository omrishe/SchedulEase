import "./App.css";
export default function MenuItems({ menuItemsList }) {
  return (
    <>
      {menuItemsList.map((item, index) => (
        <button className="itemBtn" key={index}>
          <span>{item.name}</span>
          <span>{item.price}</span>
        </button>
      ))}
    </>
  );
}
