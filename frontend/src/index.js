import "./App.css";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Login from "./Pages/Login";
import { NavLink, Switch, Route, BrowserRouter } from "react-router-dom";
import UserPage from "./Pages/UserPage";
import PopularMap from "./Pages/PopularMap";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/users/selectPage" component={UserPage} />
        <Route exact path="/PopularMap" component={PopularMap} />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
