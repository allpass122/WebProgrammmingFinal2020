import { useState } from "react";
import { useHistory } from "react-router-dom";
import instance from "./Api";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import {url} from "./url";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles({
  input: {
    margin: "0 0.2em",
  },
  button: {
    width: "100px",
    marginLeft: "0.6em",
  },
});

const Body = () => {
  const history = useHistory();
  const classes = useStyles();
  const [name, setName] = useState("");
  const [pwd, setPwd] = useState("");
  // for SignUp
  const [name_, setName_] = useState("");
  const [pwd_, setPwd_] = useState("");
  const [pwd_repeat, setPwd_repeat] = useState("");

  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  // for Snackbar Alert
  const [msgOpen, setMsgOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success"); // "error", "warning", "info", "success"

  const handleChange = (func) => (event) => {
    func(event.target.value.trim());
  };

  const handleLogin = async () => {
    const {
      data: { success, uuid, mapIDs },
    } = await instance.post("/api/login", {
      name,
      pwd,
    });
    if (!success) {
      // alert(`Wrong password or the user doesn't exist.`);
      setAlertMsg(`Wrong password or the user doesn't exist.`);
      setAlertType("error");
      setMsgOpen(true);
    } else {
      // console.log(`${name} ${uuid}`);
      history.push({
        pathname: `/users/selectPage`,
        search: "",
        state: { uuid: uuid, name: name, login: true, mapIDs: mapIDs },
      });
    }
  };

  const handleSignUp = async () => {
    const {
      data: { success, msg },
    } = await instance.post("/api/signup", {
      name_,
      pwd_,
    });
    if (!success) {
      setAlertMsg(msg);
      setAlertType("error");
      setMsgOpen(true);
      // alert(msg);
    } else {
      // alert(`Success :` + msg);
      setAlertMsg("This is a success message!");
      setAlertType("success");
      setMsgOpen(true);
    }
    setOpen(false);
  };

  const handleDel = async () => {
    const {
      data: { success },
    } = await instance.post("/api/clear", {});
    if (success) {
      setAlertMsg("This is a success message!");
      setAlertType("success");
      setMsgOpen(true);
    } else {
      setAlertMsg(`Delete Fail`);
      setAlertType("error");
      setMsgOpen(true);
    }
  };

  const handleDelMap = async () => {
    const {
      data: { success },
    } = await instance.post("/api/deleteMap", {});
    if (success) {
      setAlertMsg("This is a success message!");
      setAlertType("success");
      setMsgOpen(true);
    } else {
      setAlertMsg(`Delete Fail`);
      setAlertType("error");
      setMsgOpen(true);
    }
  };

  return (
    <section className="Wrapper">
      <Snackbar
        open={msgOpen}
        autoHideDuration={3000}
        onClose={() => {
          setMsgOpen(false);
        }}
      >
        <Alert
          onClose={() => {
            setMsgOpen(false);
          }}
          severity={alertType}
        >
          {alertMsg}
        </Alert>
      </Snackbar>
      <div className="Row">
        {/* Could use a form & a library for handling form data here such as Formik, but I don't really see the point... */}
        <TextField
          className={classes.input}
          placeholder="Name"
          value={name}
          onChange={handleChange(setName)}
        />
        <TextField
          className={classes.input}
          placeholder="Password"
          style={{ width: 240 }}
          value={pwd}
          type={show ? "text" : "password"}
          onChange={handleChange(setPwd)}
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          disabled={!name || !pwd}
          onClick={handleLogin}
        >
          登入
        </Button>
        <Button
          className={classes.button}
          variant="outlined"
          color="secondary"
          onClick={() => {
            setOpen(true);
          }}
        >
          註冊
        </Button>
      </div>

      <div className="Row1">
        <FormControlLabel
          control={
            <Switch
              checked={show}
              onChange={() => setShow(!show)}
              name="planttext password"
            />
          }
          label="顯示密碼"
        />
      </div>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <div className="SignUP">
          <TextField
            className={classes.input}
            placeholder="Name"
            value={name_}
            onChange={handleChange(setName_)}
          />
          <TextField
            className={classes.input}
            placeholder="Password"
            style={{ width: 240 }}
            value={pwd_}
            type={show ? "text" : "password"}
            onChange={handleChange(setPwd_)}
          />
          <TextField
            className={classes.input}
            placeholder="Retype Your Password"
            style={{ width: 240 }}
            value={pwd_repeat}
            type={show ? "text" : "password"}
            onChange={handleChange(setPwd_repeat)}
          />
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            disabled={!name_ || !pwd_ || pwd_ !== pwd_repeat}
            onClick={handleSignUp}
          >
            註冊
          </Button>
          <div className="Row1">
            <FormControlLabel
              control={
                <Switch
                  checked={show}
                  onChange={() => setShow(!show)}
                  name="planttext password"
                />
              }
              label="顯示密碼"
            />
          </div>
        </div>
      </Modal>
      <div
        style={
          name === "admin" && pwd === "deletemode"
            ? { display: "block" }
            : { display: "none" }
        }
      >
        <Button
          className={classes.button}
          variant="outlined"
          color="secondary"
          disabled={false}
          onClick={handleDel}
        >
          Delete User
        </Button>
        <Button
          className={classes.button}
          variant="outlined"
          color="secondary"
          disabled={false}
          onClick={handleDelMap}
        >
          Delete Map
        </Button>
      </div>
    </section>
  );
};

export default Body;
