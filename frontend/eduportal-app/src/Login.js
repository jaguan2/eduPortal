// Example React login request
async function login(username, role) {
    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, role }),
    });
  
    const data = await response.json();
    if (response.ok) {
      console.log("Login successful:", data);
    } else {
      console.error("Login failed:", data.error);
    }
  }
  