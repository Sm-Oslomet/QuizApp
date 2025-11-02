const API_URL = `${process.env.REACT_APP_API_URL}/account`;

export const authService = {
    async register({ username, email, password }) {
        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Registration failed");

        // Save JWT token and user info locally
        localStorage.setItem("token", data.token);
        localStorage.setItem(
            "currentUser",
            JSON.stringify({ id: data.userId, username: data.username })
        );

        return data;
    },

    async login({ username, password }) {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");

        localStorage.setItem("token", data.token);
        localStorage.setItem(
            "currentUser",
            JSON.stringify({ id: data.userId, username: data.username })
        );

        return data;
    },

    guestLogin() {
        const guestUser = { id: "guest", username: "Guest", guest: true };
        localStorage.setItem("currentUser", JSON.stringify(guestUser));
        return guestUser;
    },

    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem("currentUser")) || null;
        } catch {
            return null;
        }
    },

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
    },

    getAuthHeader() {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    },
};
