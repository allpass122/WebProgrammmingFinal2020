import ErrorPage from "./ErrorPage";

function PopularMap(props) {
  return (
    <>
      <h1>popular page</h1>
    </>
  );
}
function checkLogin(props) {
  if (props.location.state === undefined) return false;
  else if (!props.location.state.login) return false;
  return true;
}

function index(props) {
  return <>{checkLogin(props) ? <PopularMap /> : <ErrorPage />}</>;
}
export default index;
