import "./App.css";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Game from "./Game";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Container maxWidth="sm">
          <Typography
            component="div"
            noWrap="true"
            align="center"
            style={{
              backgroundColor: "antiquewhite",
              height: "100vh",
              width: "auto",
            }}
          >
            <p className="gameName">Game Demo</p>
            <Game />
          </Typography>
        </Container>
      </header>
    </div>
  );
}

export default App;
