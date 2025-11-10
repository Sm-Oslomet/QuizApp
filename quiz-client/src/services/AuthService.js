const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

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
      body: JSON.stringify({ username: email, password})
    });

    if (!res.ok){
      const err = await res.json().catch(() => ({}));
      throw new Error("Registration failed");
    }

    return await this.login({email, password, remember}); // auto logins user after registration instead of taking you to login page
  },


  async login({email,password,remember}){
    const res = await fetch(`${API_BASE}/account/login`,{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({username: email, password})
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
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    sessionStorage.removeItem("userRole");
  },

  getToken(){
    return (
      sessionStorage.getItem("authToken")||
      localStorage.getItem("authToken")
    );
  },


  getCurrentUser(){
    const token = this.getToken();
    if(!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));

    const role = payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "User";
    return {
      id: payload.nameid || payload.sub,
      username: payload.unique_name || payload.name, role,
    };
  },

  getRole(){
    return ( sessionStorage.getItem("userRole") || localStorage.getItem("userrole") || "User");
  }
};