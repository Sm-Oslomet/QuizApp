
# QuizApp – Full-Stack Quiz Application  
A full-stack quiz system built using **ASP.NET Core Web API**, **Entity Framework Core**, **SQL Server**, and a **React client**.  
Users can register, verify email, create quizzes, edit them, take quizzes, view results, and admins can manage users & quizzes.

---

## 📌 Features

### 👤 Authentication & Users
- JWT-based authentication  
- Login / Register / Forgot Password / Reset Password  
- Email verification flag  
- Password hashing with SHA-256  
- Admin role support  

### 📝 Quiz System
- Create quizzes with unlimited questions and answers  
- Edit quizzes (only if the quiz has no attempts)  
- Take quizzes as a user or guest  
- Automatic score calculation  
- Record quiz attempts and detailed results  
- Delete quiz attempts  

### 🔐 Admin Area
- List all users  
- Delete users  
- List all quizzes  

### 🧪 API Testing
- Swagger UI enabled (Development mode)  
- JWT authorization integrated into Swagger  

---

## 🛠️ Backend Setup (ASP.NET Core API)

### **1️⃣ Requirements**
- .NET 8 SDK  
- SQL Server / LocalDB  
- Visual Studio / VS Code  

---

### **2️⃣ Configure the Database**

Update the connection string inside `appsettings.json` if needed:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=QuizAppApi;Trusted_Connection=True;"
}
````

---

### **3️⃣ Apply Entity Framework Migrations**

Inside the backend project directory:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

### **4️⃣ Run the Backend**

```bash
dotnet run
```

API will run on:

```
---

## 🎨 Frontend Setup (React App)

### **1️⃣ Navigate to frontend**

```bash
cd quiz-client
```

### **2️⃣ Install dependencies**

```bash
npm install
```

### **3️⃣ Start the development server**

```bash
npm start
```

React runs on:

```
http://localhost:3000
```

---

## 🔄 Connecting Frontend & Backend

Ensure correct CORS configuration in `Program.cs`:

```csharp
policy.WithOrigins("http://localhost:3000")
      .AllowAnyHeader()
      .AllowAnyMethod()
      .AllowCredentials();
```

The frontend will call the API using:

```
https://localhost:7000/api/...
```

---

## 🧪 Testing the Complete Application

### ✔️ **1. Register**

`POST /api/account/register`

Creates a user (email verification flag included).

### ✔️ **2. Login**

Receive:

* JWT Token
* username
* userId

Frontend saves token in `localStorage`.

### ✔️ **3. Create a Quiz**

Go to:

```
/create
```

### ✔️ **4. Edit Quizzes**

Go to:

```
/select
```

Then:

```
/edit/{id}
```

> Editing is disabled if the quiz already has attempts.

### ✔️ **5. Play a Quiz**

* Authenticated users → Result saved
* Guests → Result not saved

---

## 📄 License

This project is licensed for educational and portfolio use.

---

## 🙌 Author

QuizApp – React & ASP.NET Core full-stack project.

---

![Welcome Screen](./Images/WelcomePage.png)
![Login Screen](./Images/Login.png)
![Select Screen](./Images/SelectQuiz.png)
![Create Screen](./Images/CreateQuiz.png)
![Edit Screen](./images/EditQuiz.png)
![Play Screen](./Images/PlayQuiz.png)
![Result Screen](./Images/Score.png)

