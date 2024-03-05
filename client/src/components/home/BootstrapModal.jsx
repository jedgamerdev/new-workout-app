import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import { useWorkoutsContext } from "../../hooks/useWorkoutsContext";
import { useAuthContext } from "../../hooks/userAuthContext";

function BootstrapModal({ workout: initialWorkout }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { dispatch } = useWorkoutsContext();
  const [workout, setWorkout] = useState({ ...initialWorkout });
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const { user } = useAuthContext();
  useEffect(() => {
    if (!user) {
      return;
    }
    const fetchWorkout = async () => {
      const response = await fetch(
        "http://localhost:3000/api/workouts/" + workout._id,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const json = await response.json();

      if (response.ok) {
        setWorkout(json);
      }
    };

    fetchWorkout();
  }, [workout._id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return;
    }
    const response = await fetch(
      "http://localhost:3000/api/workouts/" + workout._id,
      {
        method: "PATCH",
        body: JSON.stringify(workout),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
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
    <>
      <span className="material-symbols-outlined edit" onClick={handleShow}>
        Edit
      </span>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="create" onSubmit={handleSubmit}>
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

            {error && <div className="error">{error}</div>}
            <div className="form-btn">
              <input
                type="button"
                className="cancel"
                value={"Cancel"}
                onClick={handleClose}
              />
              <input
                type="submit"
                value={"Save"}
                className="submit"
                onClick={handleClose}
              />
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default BootstrapModal;
