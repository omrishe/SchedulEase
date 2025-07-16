export function AdminPanel({ userAuthData }) {
  function handleSetMenuItemBtn() {
    return;
  }
  return userAuthData.role === "admin" ? (
    <>
      <p>welcome Admin</p>
      <button onClick={handleSetMenuItemBtn}></button>
    </>
  ) : (
    <p>forbidden</p>
  );
}
