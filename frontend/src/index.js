import "./App.css";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Login from "./Pages/Login";
import {
  NavLink,
  Switch,
  Route,
  BrowserRouter,
  HashRouter as Router,
} from "react-router-dom";
import SelectPage from "./Pages/SelectPage";
import PopularMap from "./Pages/PopularMap";
import EditMode from "./Pages/EditMode";
import PlayMode from "./Pages/PlayMode";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/users/selectPage" component={SelectPage} />
        <Route exact path="/PopularMap" component={PopularMap} />
        <Route exact path="/EditMode" component={EditMode} />
        <Route exact path="/PlayMode" component={PlayMode} />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
