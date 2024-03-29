import { useState } from "react";
import { useWorkoutsContext } from "../../hooks/useWorkoutsContext";
import "./EditModal.css";

const EditModal = ({ workout: initialWorkout, onClose }) => {
  const { dispatch } = useWorkoutsContext();

  const [workout, setWorkout] = useState({ ...initialWorkout });
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

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
      setWorkout(json);
      dispatch({ type: "UPDATE_WORKOUT", payload: json });
    }
  };

  return (
    <div className="edit-modal">
      <div onClick={onClose} className="overlay">
        <div className="modal-content">
          <span className="material-symbols-outlined close-modal">close</span>
          <form className="create" onSubmit={handleSubmit}>
            <h3>Edit Workout</h3>

            <label>Exercise Title:</label>
            <input
              type="text"
              onChange={(e) =>
                setWorkout({ ...workout, title: e.target.value })
              }
              value={workout.title}
              className={emptyFields.includes("title") ? "error" : ""}
              required={true}
            />

            <label>Load (in kg):</label>
            <input
              type="number"
              onChange={(e) => setWorkout({ ...workout, load: e.target.value })}
              value={workout.load}
              className={emptyFields.includes("load") ? "error" : ""}
              required={true}
            />

            <label>Number of Reps:</label>
            <input
              type="number"
              onChange={(e) => setWorkout({ ...workout, reps: e.target.value })}
              value={workout.reps}
              className={emptyFields.includes("reps") ? "error" : ""}
              required={true}
            />
            <input type="submit" value="Save" className="submit" />
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
