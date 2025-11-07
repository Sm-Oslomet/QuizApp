const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

// Helpers

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

// AUTH SERVICE

export const authService = {

  // REGISTER --------------------
  register({ name, email, password, remember }) {
    const users = loadUsers();
    const exists = users.find((u) => u.email === email);

    if (exists) throw new Error("Email is already registered");
const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      emailVerified: false,
      role: "user",           
    };

    users.push(newUser);
    saveUsers(users);

    saveCurrentUser(newUser, remember);
    return newUser;
  },

  // LOGIN -------------
  login({ email, password, remember }) {

    // Enkel admin-login
    if (email.toLowerCase() === "admin@quiz.com" && password === "admin123") {
      const admin = {
        id: "admin",
        name: "Admin",
        email: "admin@quiz.com",
        isAdmin: true,
        emailVerified: true,
      };

      saveCurrentUser(admin, remember);
      return admin;
    }

    const users = loadUsers();
    const found = users.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    );

    if (!found) throw new Error("Wrong email or password");

    saveCurrentUser(found, remember);
    return found;
  },

  // GUEST LOGIN 
  guestLogin() {
    const guestUser = {
      id: "guest",
      name: "Guest",
      guest: true,
      isAdmin: false,
      emailVerified: true,
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(guestUser));
    sessionStorage.removeItem(CURRENT_USER_KEY);

    return guestUser;
  },

  // EMAIL VERIFY ----
  verifyEmail() {
    const current = this.getCurrentUser();
    if (!current) throw new Error("Not logged in");

    const users = loadUsers();
    const user = users.find((u) => u.id === current.id);

    if (user) {
      user.emailVerified = true;
      saveUsers(users);
    }

    current.emailVerified = true;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(current));

    return true;
  },

  // RESET PASSWORD ---------
  resetPassword(email, newPass) {
    const users = loadUsers();
    const user = users.find((u) => u.email === email);

    if (!user) throw new Error("No account with that email");

    user.password = newPass;
    saveUsers(users);
    return true;
  },

  // GET CURRENT USER -------
  getCurrentUser() {
    const stored =
      sessionStorage.getItem(CURRENT_USER_KEY) ||
      localStorage.getItem(CURRENT_USER_KEY);

    return stored ? JSON.parse(stored) : null;
  },

  // LOGOUT ---------
  logout() {
    sessionStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  },

   // ADMIN: deactivate user
  deactivateUser(id) {
    const users = loadUsers();
    const user = users.find((u) => u.id === id);
    if (!user) return false;

    user.disabled = true;
    saveUsers(users);
    return true;
  },

  // ADMIN: activate user
  activateUser(id) {
    const users = loadUsers();
    const user = users.find((u) => u.id === id);
    if (!user) return false;

    user.disabled = false;
    saveUsers(users);
    return true;
  },

  // ADMIN: promote to admin
  promoteToAdmin(id) {
    const users = loadUsers();
    const user = users.find((u) => u.id === id);
    if (!user) return false;

    user.role = "admin";
    saveUsers(users);
    return true;
  },

  // ADMIN: reset password
  adminResetPassword(id, newPassword) {
    const users = loadUsers();
    const user = users.find((u) => u.id === id);
    if (!user) return false;

    user.password = newPassword;
    saveUsers(users);
    return true;
  },

  // ADMIN: verify user email
  adminVerifyUser(id) {
    const users = loadUsers();
    const user = users.find((u) => u.id === id);
    if (!user) return false;

    user.emailVerified = true;
    saveUsers(users);
    return true;
  },
};
