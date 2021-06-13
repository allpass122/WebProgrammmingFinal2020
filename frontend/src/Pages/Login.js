import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const instance = axios.create({
  baseURL: `http://localhost:4000/`,
});

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

  const handleChange = (func) => (event) => {
    func(event.target.value.trim());
  };

  const ToSignUP = () => {
    setOpen(true);
  };

  const handleLogin = async () => {
    const {
      data: { success, uuid },
    } = await instance.post("/api/login", {
      name,
      pwd,
    });
    if (!success) {
      alert(`Wrong password or the user doesn't exist.`);
    } else {
      // console.log(`${name} ${uuid}`);
      history.push({
        pathname: `/users/selectPage`,
        search: "",
        state: { uuid: uuid, name: name, login: true },
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
      alert(msg);
    } else {
      alert(`Success :` + msg);
    }
    setOpen(false);
  };

  const handleDel = async () => {
    const {
      data: { success },
    } = await instance.post("/api/clear", {});
    alert(`${success}`);
  };

  return (
    <section className="Wrapper">
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
          Login
        </Button>
        <Button
          className={classes.button}
          variant="outlined"
          color="secondary"
          onClick={ToSignUP}
        >
          Click here to SignUp
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
          label="PlantText Password"
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
            SignUp
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
              label="PlantText Password"
            />
          </div>
        </div>
      </Modal>

      <Button
        className={classes.button}
        variant="outlined"
        color="secondary"
        disabled={false}
        onClick={handleDel}
      >
        Delete
      </Button>
    </section>
  );
};

export default Body;
