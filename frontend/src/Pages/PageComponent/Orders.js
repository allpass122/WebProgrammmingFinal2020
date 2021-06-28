import React from "react";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import instance from "../Api";

import Link from "@material-ui/core/Link";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
// import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import GradeIcon from "@material-ui/icons/Grade";
import Modal from "@material-ui/core/Modal";
// import Title from "./Title";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ColorButton = withStyles((theme) => ({
  root: {
    color: "#ffc107",
    // backgroundColor: theme.palette.getContrastText("#ffc107"),
    "&:hover": {
      backgroundColor: "#fff7b0",
    },
  },
}))(IconButton);

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));
// const instance = axios.create({
//   baseURL: `http://localhost:4000/`,
// });
export default function Orders(props) {
  const history = useHistory();
  const classes = useStyles();
  const { name, uuid, login } = props.info;
  const [open, setOpen] = useState(false);
  // record rate which map
  const [rateID, setRateID] = useState("");
  const [rate, setRate] = useState(3);
  // for Snackbar Alert
  const [msgOpen, setMsgOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success"); // "error", "warning", "info", "success"

  const rateMap = async (val) => {
    console.log(`value:${val}`);
    const {
      data: { success, errorCode },
    } = await instance.post("/api/rateMap", {
      rateID,
      val,
      name,
    });
    if (!success) {
      if (errorCode === 1) {
        setAlertMsg(`You need to pass this map to rate it`);
        setAlertType("error");
        setMsgOpen(true);
      } else if (errorCode === 2) {
        setAlertMsg(`You rated it before, the previous rate has been updated!`);
        setAlertType("info");
        setMsgOpen(true);
      } else {
        setAlertMsg(`Unknow error: ${errorCode}`);
        setAlertType("error");
        setMsgOpen(true);
      }
    } else {
      setAlertMsg(`Rate Success`);
      setAlertType("success");
      setMsgOpen(true);
    }
  };
  // console.log(props.data);
  const computeScore = (arr) => {
    let totalScore = 0;
    let totalPeople = 0;
    arr.forEach((ele) => {
      totalScore += ele.rate;
      // console.log(ele);
      totalPeople += 1;
    });
    return [
      totalScore,
      totalPeople,
      totalPeople === 0 ? 0 : totalScore / totalPeople,
    ];
  };

  return (
    <React.Fragment>
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
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            position: "absolute",
            margin: "0",
            top: "50%",
            left: "30%",
            width: "40%",
            height: "50%",
            // display: "flex",
            transform: "translateY(-50%)",
            // opacity: "0.8",
            // msTransform: "translateX(-50%)",
          }}
        >
          <div
            style={{
              marginTop: "1cm",
              top: "30%",
              left: "50%",
              position: "absolute",
              transform: "translate(-50%,-50%)",
              msTransform: "translate(-50%,-50%)",
            }}
          >
            <Typography component="legend">Rate</Typography>
            <Rating
              name="simple-controlled"
              value={rate}
              onChange={(event, newValue) => {
                rateMap(newValue);
                setOpen(false);
              }}
            />
          </div>
        </div>
      </Modal>
      {/* <Title>Recent Orders</Title> */}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Number of Plays</TableCell>
            <TableCell>Number of Passes</TableCell>
            <TableCell>Fastest</TableCell>
            <TableCell align="right">Record holder</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((map) => (
            <TableRow>
              <IconButton
                className={classes.margin}
                size="large"
                variant="outlined"
                color="secondary"
                onClick={() => {
                  history.push({
                    pathname: `/PlayMode`,
                    state: {
                      uuid: uuid,
                      name: name,
                      login: true,
                      id: map.id,
                      mode: "challenge",
                    },
                  });
                }}
              >
                <SportsEsportsIcon />
              </IconButton>
              <TableCell>{map.author}</TableCell>
              <TableCell>{map.title}</TableCell>
              <TableCell>{map.description}</TableCell>
              <TableCell>{map.statistic.playTime}</TableCell>
              <TableCell>{map.statistic.passTime}</TableCell>
              <TableCell>
                {map.statistic.fastestPass === 999.9
                  ? "-"
                  : map.statistic.fastestPass}
              </TableCell>
              <TableCell align="right">
                {map.statistic.fastestMan === "None"
                  ? "-"
                  : map.statistic.fastestMan}
              </TableCell>

              {`${computeScore(map.rateRec)[2].toFixed(2)}(${
                computeScore(map.rateRec)[1]
              })`}
              <ColorButton
                className={classes.margin}
                size="large"
                variant="outlined"
                color="primary"
                onClick={() => {
                  setRateID(map.id);
                  setOpen(true);
                }}
              >
                <GradeIcon />
              </ColorButton>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more orders
        </Link>
      </div> */}
    </React.Fragment>
  );
}
