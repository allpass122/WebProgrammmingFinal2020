import React from "react";
import { useState, useRef } from "react";
import EditMode from "../GameContainer/EditMode/Main";
import Vec2 from "../GameContainer/Class/Vec2";
import { useHistory } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import LoadingPage from "./LoadingPage";
import instance from "./Api";

// import util from "util";
import init from "../GameContainer/Setting/example_0";
import { enpackage, unpackage, show } from "../GameContainer/DataPackager";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded";
import SaveIcon from "@material-ui/icons/Save";
import Modal from "@material-ui/core/Modal";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {url} from "./url";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));
function checkLogin(props) {
  if (props.location.state === undefined) return false;
  else if (!props.location.state.login) return false;
  return true;
}

function Edit(props) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(props.data.title);
  const [description, setDescription] = useState(props.data.description);
  // for Snackbar Alert
  const [msgOpen, setMsgOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success"); // "error", "warning", "info", "success"
  const [setting, setSetting] = useState(init);
  const [idGetMap, setidGetMap] = useState(false);
  const [publish, setPublish] = useState(false);
  // upload work around
  const [delayUpload, setDelayUpload] = useState(false);

  const [id, setId] = useState(props.data.id);
  const childRef = useRef();

  let { name, uuid, login } = props.data;

  const handleUpload = async () => {
    console.log("upload function");
    let settingPack = setting;
    let id0 = id;
    const {
      data: { success, errorCode, idNew },
    } = await instance.post("/api/upload", {
      uuid,
      settingPack,
      title,
      description,
      name,
      publish,
      id0,
    });
    if (!success) {
      if (errorCode === 1) {
        setAlertMsg("This map exists. The map has been updated");
        setAlertType("info");
        setMsgOpen(true);
        // alert(`This map exists.`);
      } else if (errorCode === 2) {
        // alert(`Too many maps!! Every user can only save 8 maps.`);
        setAlertMsg("Too many maps!! Every user can only save 8 maps.");
        setAlertType("error");
        setMsgOpen(true);
      } else {
        // alert(`Unknow error. Error code:${errorCode}`);
        setAlertMsg(`Unknow error. Error code:${errorCode}`);
        setAlertType("error");
        setMsgOpen(true);
      }
    } else {
      setAlertMsg("This is a success message!");
      setAlertType("success");
      setMsgOpen(true);
    }
    // id = idNew;
    setId(idNew);
    console.log("Upload success");
    setOpen(false);
  };

  const getMap = async () => {
    const {
      data: { success, errorCode, map },
    } = await instance.post("/api/getMap", {
      id,
    });
    if (!success) {
      setAlertMsg(`Error. Error code:${errorCode}`);
      setAlertType("error");
      setMsgOpen(true);
    } else {
      setAlertMsg(`Load data success`);
      setAlertType("success");
      setMsgOpen(true);
      setSetting(map["content"]);
      setidGetMap(true);
    }
  };

  if (id !== 0 && idGetMap === false) {
    getMap();
  }
  if (delayUpload) {
    handleUpload();
    setDelayUpload(false);
  }

  const save = (setting) => {
    console.log("Update setting");
    setSetting(enpackage(setting));
    // show(enpackage(setting));
  };

  // console.log(util.inspect(setting, {showHidden: false, depth: null}))

  return (
    <div style={{ textAlign: "center" }}>
      <Snackbar
        open={msgOpen}
        autoHideDuration={500}
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
      <div style={{ marginTop: "1em" }}>
        <IconButton
          className={classes.margin}
          size="large"
          variant="outlined"
          color="secondary"
          onClick={history.goBack}
        >
          <ArrowBackRoundedIcon />
        </IconButton>

        <IconButton
          className={classes.margin}
          size="large"
          variant="outlined"
          color="secondary"
          disabled={Object.entries(setting).length === 0}
          onClick={() => {
            childRef.current.returnSetting();
            setOpen(true);
          }}
        >
          <CloudUploadIcon />
        </IconButton>
        <IconButton
          size="large"
          variant="contained"
          color="secondary"
          onClick={() => {
            if (childRef.current) {
              childRef.current.returnSetting();
            }
            if (!title || !description) {
              setOpen(true);
            } else {
              setPublish(false);
              setDelayUpload(true);
              // setTimeout(setOpen(true), 500);
              // setOpen(false);

              // handleUpload();
              // setTimeout(handleUpload, 600);
            }
          }}
        >
          <SaveIcon />
        </IconButton>
      </div>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <>
          <div className="upload">
            <TextField
              label="Title"
              variant="filled"
              rows={1}
              placeholder="Title"
              defaultValue=""
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
            <TextField
              id="filled-textarea"
              label="Description"
              variant="filled"
              multiline
              placeholder="Description"
              defaultValue=""
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
            />
            <IconButton
              className={classes.margin}
              size="large"
              variant="contained"
              color="secondary"
              onClick={handleUpload}
              disabled={!title || !description}
            >
              <CloudUploadIcon />
            </IconButton>
          </div>
          <div className="upload_">
            <FormControlLabel
              control={
                <Switch
                  checked={publish}
                  onChange={() => setPublish(!publish)}
                  name="public on internet"
                />
              }
              label="public on internet"
            />
          </div>
        </>
      </Modal>
      {msgOpen === true ? (
        <LoadingPage />
      ) : (
        <EditMode
          width="1200px"
          height="600px"
          ref={childRef}
          setting={unpackage(setting)}
          save={save}
        />
      )}
    </div>
  );
}
function Editmode(props) {
  return (
    <>
      {checkLogin(props) ? <Edit data={props.location.state} /> : <ErrorPage />}
    </>
  );
}

export default Editmode;
