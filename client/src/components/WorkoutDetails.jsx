import { useWorkoutsContext } from "../hooks/useWorkoutsContext";

import BootstrapModal from "./home/BootstrapModal.jsx";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

import { useAuthContext } from "../hooks/userAuthContext";

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  const handleClick = async () => {
    if (!user) {
      return;
    }
    const response = await fetch(
      "http://localhost:3000/api/workouts/" + workout._id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_WORKOUT", payload: json });
    }
  };

  return (
    <div className="workout-details">
      <h4>{workout.title}</h4>
      <p>
        <strong>Load (kg): </strong>
        {workout.load}
      </p>
      <p>
        <strong>Number of reps: </strong>
        {workout.reps}
      </p>
      <p>
        {formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}
      </p>
      <BootstrapModal workout={workout} />

      <span className="material-symbols-outlined delete" onClick={handleClick}>
        delete
      </span>
    </div>
  );
};

export default WorkoutDetails;
