
// Helpers ---- Have been commented out since instead of using helpers with localStorage we want to start using the API
/*
function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveCurrentUser(user, remember) {
  const cleanUser = { ...user };
  delete cleanUser.password;

  if (remember) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(cleanUser));
    sessionStorage.removeItem(CURRENT_USER_KEY);
  } else {
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(cleanUser));
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}
*/

// AUTH SERVICE
const API_BASE="http://localhost:5251/api";

export const authService = {

  // REGISTER --------------------
  async register({ name, email, password, remember }) {
    const res = await fetch(`${API_BASE}/account/register`,{
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        email, 
        name, 
        password,
      }),
    });

    if (!res.ok){
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Registration failed");
    }

    return await this.login({email, password, remember}); // auto logins user after registration instead of taking you to login page
  },


    // -------------- Login
  async login({email,password,remember}){
    const res = await fetch(`${API_BASE}/account/login`,{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email, password})
    });
    if(!res.ok){
      throw new Error("Incorrect email or password!");
    }

    const data = await res.json();
    const token = data.token;

    if (remember){
      localStorage.setItem("authToken", token);
      sessionStorage.removeItem("authToken");
    } else {
      sessionStorage.setItem("authToken", token);
      localStorage.removeItem("authToken");
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]; // changes done with the help of AI, in order to add the admin-user roles

    if (remember) {
      localStorage.setItem("userRole", role);
      sessionStorage.removeItem("userRole");
    } else {
      sessionStorage.setItem("userRole", role);
      localStorage.removeItem("userRole");
    }
    return this.getCurrentUser();
  },

  logout(){
    localStorage.removeItem("authToken"); // we clear tokens stored, JWT
    sessionStorage.removeItem("authToken");

    localStorage.removeItem("userRole"); // clear role
    sessionStorage.removeItem("userRole");

    sessionStorage.removeItem("guestUser"); // if the user is logged in as a guest, clear it aswell
  },


  guestLogin() {
    // we clear JWT tokens when a user logs in as guest, to not confuse backend
    sessionStorage.removeItem("authToken");
    localStorage.removeItem("authToken");

    const guestUser = {
      guest: true,
      name: "Guest"
    };

    sessionStorage.setItem("guestUser", JSON.stringify(guestUser));
  },

  getToken(){
    return (
      sessionStorage.getItem("authToken")||
      localStorage.getItem("authToken")
    );
  },

// Decoded JWT token, info about user
  getCurrentUser(){

    const guestData = sessionStorage.getItem("guestUser");
    if (guestData) {
      return JSON.parse(guestData);
    }

    const token = this.getToken();
    if(!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));

    const role = payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "User";
    return {
      id: payload.id,
      isVerified: payload.isVerified === "True",
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  },

  getRole(){
    return ( sessionStorage.getItem("userRole") || localStorage.getItem("userrole") || "User");
  },


// verify email logic
  async verifyEmail(email){
    const res = await fetch(`${API_BASE}/account/verify-email`, {
      method: "POST",
      headers:{"Content-Type": "application/json" },
      body: JSON.stringify({email}),
    });

    if (!res.ok) throw new Error("Verification failed");

    const data = await res.json();

    if (data.token){
      sessionStorage.setItem("authToken", data.token);
      localStorage.setItem("authToken", data.token);
    }
    return data;
  },


  // Forgot password logic

  async forgotPassword(email){
    const res = await fetch(`${API_BASE}/account/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email}),
    });

    if (!res.ok) throw new Error("Could not send reset token, incorrect email");
    return await res.json();
  },
  // reset password logic

  async resetPassword(token, newPassword){
    const res = await fetch(`${API_BASE}/account/reset-password`, {
      method: "POST",
      headers:{"Content-Type": "application/json"},
      body: JSON.stringify({token, newPassword}),
    });

    if(!res.ok) throw new Error("Could not reset password");
    return await res.json();
  },
};