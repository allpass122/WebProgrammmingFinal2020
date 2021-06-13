import ChooseMap from "./ChooseMap";
import ErrorPage from "./ErrorPage";

function checkLogin(props) {
  if (props.location.state === undefined) return false;
  else if (!props.location.state.login) return false;
  return true;
}

function UserPage(props) {
  return (
    <>
      {checkLogin(props) ? (
        <ErrorPage />
      ) : (
        <ChooseMap data={props.location.state} />
      )}
    </>
  );
}
export default UserPage;
