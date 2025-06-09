export async function createAuth(formData) {
  try {
    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      handlePostError(data);
      return null;
    }
    return data;
  } catch (error) {
    console.log("error:", error.errors);
    return null;
  }
}

function handlePostError(data) {
  if (data.error) {
    console.error("Error:", data.error);
    console.error("error details:", data.details);
  }
  if (data.message) {
    console.error("Message:", data.message);
  }
  if (!data.message && !data.error) {
    console.error("unknown error occured during auth");
  }
}
