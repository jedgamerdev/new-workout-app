import { useAuthContext } from "./userAuthContext";
import { useWorkoutsContext } from "./useWorkoutsContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: workoutDispatch } = useAuthContext();

  const logout = () => {
    localStorage.removeItem("user");

    dispatch({ type: "logout" });
    workoutDispatch({ type: "SET_WORKOUTS", payload: null });
  };
  return { logout };
};
