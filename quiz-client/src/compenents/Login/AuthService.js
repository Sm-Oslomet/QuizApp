// src/api/authService.js

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

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

export const authService = {
  // Registrer ny bruker
  register({ username, password }) {
    const users = loadUsers();

    // sjekk om brukernavn finnes
    const exists = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    if (exists) {
      throw new Error("Username already taken");
    }

    const newUser = {
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2, 9),
      username,
      password, // i ekte verden: hash passord
    };

    users.push(newUser);
    saveUsers(users);

    // automatisk logg inn etter registrering
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
      id: newUser.id,
      username: newUser.username,
    }));

    return {
      id: newUser.id,
      username: newUser.username,
    };
  },

  // Login med brukernavn+passord
  login({ username, password }) {
    const users = loadUsers();
    const match = users.find(
      (u) => u.username === username && u.password === password
    );
    if (!match) {
      throw new Error("Wrong username or password");
    }

    const publicUser = { id: match.id, username: match.username };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser));
    return publicUser;
  },

  // Guest login
  guestLogin() {
    const guestUser = {
      id: "guest",
      username: "Guest",
      guest: true,
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(guestUser));
    return guestUser;
  },

  // Hent aktiv bruker
  getCurrentUser() {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  // Logg ut
  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  },
};
