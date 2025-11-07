// adminService object provides functions to manage users and quizzes in localStorage
export const adminService = {
  // Retrieves all users from localStorage
  getUsers() {
    // Gets "users" from localStorage and parses it to an array, or returns an empty array if not found
    return JSON.parse(localStorage.getItem("users")) || [];
  },

  // Deletes a user by id
  deleteUser(id) {
    // Filters out the user with the given id from the list of users
    const users = this.getUsers().filter((u) => u.id !== id);
    // Saves the updated list back to localStorage
    localStorage.setItem("users", JSON.stringify(users));
  },

  // Retrieves all quizzes from localStorage
  getQuizzes() {
    // Gets "quizzes" from localStorage and parses it to an array, or returns an empty array if not found
    return JSON.parse(localStorage.getItem("quizzes")) || [];
  },

  // Deletes a quiz by id
  deleteQuiz(id) {
    // Filters out the quiz with the given id from the list of quizzes
    const quizzes = this.getQuizzes().filter((q) => q.id !== id);
    // Saves the updated list back to localStorage
    localStorage.setItem("quizzes", JSON.stringify(quizzes));
  }
};