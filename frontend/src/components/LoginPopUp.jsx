export default function LoginPopUp() {
  return (
    <form onChange={() => {}}>
      <label htmlFor="emailInput">email</label>
      <input id="emailInput" type="text" name="emailInput" />
      <label htmlFor="password">password</label>
      <input id="password" type="password" name="passwordInput" />
      <button>confirm</button>
    </form>
  );
}
