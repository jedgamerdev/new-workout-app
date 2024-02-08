import { useEffect, useState } from "react";
import { useWorkoutsContext } from "../../hooks/useWorkoutsContext";

const EditModal = ({ workout: initialWorkout }) => {
  const { dispatch } = useWorkoutsContext();

  const [workout, setWorkout] = useState({ ...initialWorkout });
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  useEffect(() => {
    const fetchWorkout = async () => {
      const response = await fetch(
        "http://localhost:3000/api/workouts/" + workout._id
      );
      const json = await response.json();

      if (response.ok) {
        setWorkout(json);
      }
    };

    fetchWorkout();
  }, [workout._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      "http://localhost:3000/api/workouts/" + workout._id,
      {
        method: "PATCH",
        body: JSON.stringify(workout),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setEmptyFields([]);
      setError(null);
      setWorkout({ title: "", load: "", reps: "" });
      dispatch({ type: "UPDATE_WORKOUT", payload: json });
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Edit Workout</h3>

      <label>Exercise Title:</label>
      <input
        type="text"
        onChange={(e) => setWorkout({ ...workout, title: e.target.value })}
        value={workout.title}
        className={emptyFields.includes("title") ? "error" : ""}
      />

      <label>Load (in kg):</label>
      <input
        type="number"
        onChange={(e) => setWorkout({ ...workout, load: e.target.value })}
        value={workout.load}
        className={emptyFields.includes("load") ? "error" : ""}
      />

      <label>Number of Reps:</label>
      <input
        type="number"
        onChange={(e) => setWorkout({ ...workout, reps: e.target.value })}
        value={workout.reps}
        className={emptyFields.includes("reps") ? "error" : ""}
      />

      <button>Update Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default EditModal;
