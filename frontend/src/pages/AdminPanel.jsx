export function AdminPanel(userAuthData) {
  return userAuthData.role === "admin" ? (
    <p>welcome Admin</p>
  ) : (
    <p>forbidden</p>
  );
}
