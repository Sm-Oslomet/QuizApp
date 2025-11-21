import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import quizService from "../../api/quizService";
import {authService} from "../../services/authService"
import ResponseModal from "../../components/ResponseModal";

function SelectQuiz() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({show: false, title:"", message:"", type: "success"});


  const showMessage = (title, message, type = "success", onConfirm =null) =>{
    setModal({
      show:true, title, message, type, onConfirm
    });
  };

  // last quizer ved mount
  useEffect(() => {
    loadQuizzes();
  }, []);

  async function loadQuizzes() {
    setLoading(true);
    try {
      let all = await quizService.getAll();
      const mapped = all.map((q)=> ({
        id: q.quizId || q.QuizId || q.id,
        title: q.title || q.Title,
        description: q.description || q.Description || "",
        questions: q.questions || q.Questions || [],
        creatorName: q.creatorName || q.CreatorName || ""
      }));
      setQuizzes(mapped);
    } catch (err) {
      console.error("Failed to load quizzes:", err);
      showMessage("Error", "Failed to load quizzes.", "error"); // title, message and type
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    showMessage(
      "Delete Quiz", "Are you sure you want to delete this quiz?", "danger",
      async() => {
        try {
          await quizService.remove(id);

          setQuizzes((prev) => prev.filter((q) => q.id !== id));
          showMessage("Success", "Quiz has been deleted", "success");
        } catch (err){
          showMessage("Error", "Failed to delete quiz", "error");
        }
      }
    );
  }

  /* we comment out load examples since it uses localstorage, which is no longer needed
  async function handleLoadExamples() {
    try {
      await quizService.loadExamples();
      alert("Example quizzes added!");
      // reload list
      loadQuizzes();
    } catch (err) {
      console.error("Failed to load example quizzes:", err);
      alert("Failed to load example quizzes.");
    }
  }
*/
  if (loading) {
    return <p className="text-center mt-5">Loading quizzes...</p>;
  }

  return (
    <div className="container py-5">
      <h1 className="text-center text-primary mb-4">Select a Quiz</h1>

      {quizzes.length === 0 ? (
        <div className="alert alert-info text-center">
          No quizzes found.
          <div className="mt-3 d-flex flex-column align-items-center gap-2">
            {!user?.guest && (
              <button
                className="btn btn-success"
                onClick={() => navigate("/create")}
              >
                Create New Quiz
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="row">
            {quizzes.map((quiz) => (
              <div className="col-md-6 mb-4" key={quiz.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{quiz.title}</h5>
                    <p className="text-muted">
                      {quiz.description || "No description"}
                    </p>
                    
                    <p className="small text-secondary">
                      Created by: {quiz.creatorName || "Unknown"}
                    </p>

                    <p className="small text-secondary">
                      Questions: {quiz.questions?.length || 0}
                    </p>


                    <div className="mt-auto d-flex justify-content-between">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/play/${quiz.id}`)}
                      >
                        Play
                      </button>

                      {!user?.guest && (
                        <button
                          className="btn btn-warning btn-sm text-white"
                          onClick={() => navigate(`/edit/${quiz.id}`)}
                        >
                          Edit
                        </button>
                      )}
                      {!user?.guest && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(quiz.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {modal.show && (
        <ResponseModal
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal((prev) => ({...prev, show:false}))}
        onConfirm={() => {
          if (modal.onConfirm) modal.onConfirm();
          setModal((prev) => ({...prev, show:false}));
        }}
        showConfirm={!!modal.onConfirm}
        />
      )}
    </div>
  );
}

export default SelectQuiz;
