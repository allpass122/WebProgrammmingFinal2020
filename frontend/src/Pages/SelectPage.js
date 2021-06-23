import UserPage from "./UserPage";
import ErrorPage from "./ErrorPage";

function checkLogin(props) {
  if (props.location.state === undefined) return false;
  else if (!props.location.state.login) return false;
  return true;
}

function UserPage0(props) {
  return (
    <>
      {checkLogin(props) ? (
        <UserPage data={props.location.state} />
      ) : (
        <ErrorPage />
      )}
    </>
  );
}
export default UserPage0;
