import { Fragment, useState } from "react";
export default function MenuItems({ menuItemsList, setWindow }) {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <>
      <div className="scrollableMenu">
        {menuItemsList.map((item) => (
          <Fragment key={item.name}>
            <button
              className="itemBtn"
              onClick={() => setIsClicked((prev) => !prev)}
            >
              <span>{item.name}</span>
              <span>{item.price}</span>
            </button>
          </Fragment>
        ))}
      </div>
      <button
        hidden={!isClicked}
        onClick={() => {
          setWindow("date");
          setIsClicked((prev) => !prev);
        }}
      >
        Next
      </button>
    </>
  );
}
