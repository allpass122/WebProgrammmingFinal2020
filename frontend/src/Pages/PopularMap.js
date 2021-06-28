import ErrorPage from "./ErrorPage";
import {url} from "./url";

import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import clsx from "clsx";
import instance from "./Api";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import FiberNewIcon from "@material-ui/icons/FiberNew";
import AccessibleForwardIcon from "@material-ui/icons/AccessibleForward";
import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded";
import TextField from "@material-ui/core/TextField";
import GradeIcon from "@material-ui/icons/Grade";

import Orders from "./PageComponent/Orders";

const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "black",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "green",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "red",
        backgroundColor: "RoyalBlue",
      },
      "&:hover fieldset": {
        borderColor: "yellow",
      },
      "&.Mui-focused fieldset": {
        borderColor: "green",
        backgroundColor: "white",
        opacity: "0.1",
      },
    },
  },
})(TextField);

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));

function PopularMap(props) {
  const history = useHistory();
  const classes = useStyles();
  const { name, uuid, login } = props.data;
  const [open, setOpen] = useState(true);
  const [newestMaps, setNewestMaps] = useState([]);
  const [allMaps, setAllMaps] = useState([]);
  const [isBusy, setBusy] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setBusy(true);
    const getAllMapsByOrder = async () => {
      const {
        data: { success, maps, errorCode },
      } = await instance.post("/api/getAllMapsByOrder", {});
      if (!success) {
        // alert(`Wrong password or the user doesn't exist.`);
      } else {
        console.log(`setAllMaps`);
        setAllMaps(maps);
        setNewestMaps(maps);
      }
      setBusy(false);
    };
    getAllMapsByOrder();
  }, []);

  // ref:https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function shuffle(array) {
    var currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }
  const handler1 = () => {
    console.log(`Handler1`);
    // random the order of allMaps
    let arr = [...newestMaps];
    shuffle(arr);
    setAllMaps(arr);
  };
  const handler2 = () => {
    console.log(`Handler2`);
    let arr = [...newestMaps];
    arr.sort((a, b) => {
      return b.statistic.playTime - a.statistic.playTime;
    });
    setAllMaps(arr);
  };
  const handler3 = () => {
    console.log(`Handler3`);
    let arr = [...newestMaps];
    arr.sort((a, b) => {
      return b.statistic.passTime - a.statistic.passTime;
    });
    setAllMaps(arr);
  };
  const handler4 = () => {
    console.log(`Handler4`);
    setAllMaps(newestMaps);
  };
  const handler5 = () => {
    console.log(`Handler5`);
    let arr = [...newestMaps];
    arr = arr.reverse();
    setAllMaps(arr);
  };
  const computeScore = (arr) => {
    let totalScore = 0;
    let totalPeople = 0;
    arr.forEach((ele) => {
      totalScore += ele.rate;
      totalPeople += 1;
    });
    return [
      totalScore,
      totalPeople,
      totalPeople === 0 ? 0 : totalScore / totalPeople,
    ];
  };
  const handlerGrade = () => {
    console.log(`Handler3`);
    let arr = [...newestMaps];
    arr.sort((a, b) => {
      return (
        computeScore(b.rateRec)[2].toFixed(2) -
        computeScore(a.rateRec)[2].toFixed(2)
      );
    });
    setAllMaps(arr);
  };
  const handlerSearch = (w) => {
    console.log(`HandlerSearch`);
    let arr = [...newestMaps];
    arr = arr.filter((ele) => {
      return ele.author.toLowerCase().includes(w.toLowerCase());
    });
    setAllMaps(arr);
  };

  // const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  // console.log("Render");
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => {
              setOpen(true);
            }}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Other Maps
          </Typography>
          <CssTextField
            className={classes.margin}
            label="Search Author"
            variant="outlined"
            id="custom-css-outlined-input"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value.trim());
              handlerSearch(e.target.value.trim());
            }}
          />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton
            onClick={() => {
              setOpen(false);
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <div>
            <ListItem button onClick={handler1}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="All Maps" />
            </ListItem>
            <ListItem button onClick={handlerGrade}>
              <ListItemIcon>
                <GradeIcon />
              </ListItemIcon>
              <ListItemText primary="High Rate Maps" />
            </ListItem>
            <ListItem button onClick={handler2}>
              <ListItemIcon>
                <WhatshotIcon />
              </ListItemIcon>
              <ListItemText primary="Most Plays" />
            </ListItem>
            <ListItem button onClick={handler3}>
              <ListItemIcon>
                <InsertEmoticonIcon />
              </ListItemIcon>
              <ListItemText primary="Most Passes" />
            </ListItem>
            <ListItem button onClick={handler4}>
              <ListItemIcon>
                <FiberNewIcon />
              </ListItemIcon>
              <ListItemText primary="Newest" />
            </ListItem>
            <ListItem button onClick={handler5}>
              <ListItemIcon>
                <AccessibleForwardIcon />
              </ListItemIcon>
              <ListItemText primary="Oldest" />
            </ListItem>
            <ListItem button onClick={history.goBack}>
              <ListItemIcon>
                <ArrowBackRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Go Back" />
            </ListItem>
          </div>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Recent Orders */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Orders data={allMaps} info={props.data} />
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>{/* <Copyright /> */}</Box>
        </Container>
      </main>
    </div>
  );
}
function checkLogin(props) {
  if (props.location.state === undefined) return false;
  else if (!props.location.state.login) return false;
  return true;
}

function index(props) {
  return (
    <>
      {checkLogin(props) ? (
        <PopularMap data={props.location.state} />
      ) : (
        <ErrorPage />
      )}
    </>
  );
}
export default index;
