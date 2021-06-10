function UserPage(props) {
  return (
    <>
      <h1>this is {props.match.params.id}'s page</h1>
    </>
  );
}
export default UserPage;
