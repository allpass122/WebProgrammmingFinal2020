import React from "react";
import { useState, useRef, useEffect } from "react";
import { enpackage, unpackage, show } from "../GameContainer/DataPackager";
import { useHistory } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import LoadingPage from "./LoadingPage";
import instance from "./Api";

import PlayMode from "../GameContainer/PlayMode/PlayMapCreater";
import init from "../GameContainer/Setting/example_0";

import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded";
import SettingsIcon from "@material-ui/icons/Settings";
import SettingsApplicationsIcon from "@material-ui/icons/SettingsApplications";
import FlagIcon from "@material-ui/icons/Flag";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
function checkLogin(props) {
  if (props.location.state === undefined) return false;
  else if (!props.location.state.login) return false;
  return true;
}

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const Play = (props) => {
  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  // for Snackbar Alert
  const [msgOpen, setMsgOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success"); // "error", "warning", "info", "success"
  const [idGetMap, setidGetMap] = useState(false);
  const [setting, setSetting] = useState("");
  const [mapp, setMapp] = useState({});
  // get data before render
  const [isBusy, setBusy] = useState(true);

  const { name, uuid, login, id, mode } = props.data;

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
      setMapp(map);
      setidGetMap(true);
    }
  };

  // if (id !== 0 && idGetMap === false) {
  //   getMap();
  // }

  const challengeSuccess = async (mapLocal) => {
    const {
      data: { success, errorCode },
    } = await instance.post("/api/challengeSuccess", {
      mapLocal,
    });
    console.log(`challenge: ${success}`);
    if (!success) {
    } else {
    }
  };

  const challenge = (time, pass) => {
    if (mode !== "challenge") {
      console.log(`practice no record`);
      return;
    }
    console.log(`receive challenge ${time}`);
    let mapLocal = { ...mapp };
    mapLocal.statistic.playTime += 1;
    // pass
    if (pass) {
      mapLocal.statistic.passTime += 1;
      if (!mapLocal.passPeople.includes(name)) {
        mapLocal.passPeople.push(name);
      }
    }
    // new record
    if (mapLocal.statistic.fastestPass > time / 1000.0 && pass) {
      mapLocal.statistic.fastestPass = time / 1000.0;
      mapLocal.statistic.fastestMan = name;
    }
    challengeSuccess(mapLocal);
  };

  useEffect(() => {
    // console.log(`busy?${isBusy}`);
    setBusy(true);
    getMap();
  }, []);

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
        >
          {mode === "challenge" ? <FlagIcon /> : <SettingsIcon />}
          {mode === "challenge" ? "Challenge Mode" : " Practice Mode"}
        </IconButton>
      </div>
      {setting === "" || msgOpen === true ? (
        <LoadingPage />
      ) : (
        <PlayMode
          width="1200px"
          height="600px"
          setting={unpackage(setting)}
          challenge={challenge}
        />
      )}
    </div>
  );
};
function Playmode(props) {
  return (
    <>
      {checkLogin(props) ? <Play data={props.location.state} /> : <ErrorPage />}
    </>
  );
}
export default Playmode;
