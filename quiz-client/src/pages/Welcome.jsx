import React from "react";

function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-500 to-purple-600 p-8 text-white">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to QuizMaster</h1>
        <p className="text-lg mb-8">
          Create, manage, and take interactive quizzes to test your knowledge.
        </p>
        <div className="flex justify-center gap-4 mb-10">
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-100">
            + Create Quiz
          </button>
          <button className="bg-transparent border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600">
            Browse Quizzes
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-gray-900">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2 text-lg text-indigo-600">
              JavaScript Fundamentals
            </h3>
            <p>15 questions</p>
            <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
              Take Quiz
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2 text-lg text-indigo-600">
              React Hooks Deep Dive
            </h3>
            <p>20 questions</p>
            <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
              Take Quiz
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2 text-lg text-indigo-600">
              CSS Grid & Flexbox
            </h3>
            <p>12 questions</p>
            <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
              Take Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
