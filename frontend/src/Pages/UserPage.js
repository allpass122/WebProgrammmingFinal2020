// from https://github.com/mui-org/material-ui/edit/master/docs/src/pages/getting-started/templates/album/Album.js
import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { enpackage, unpackage, show } from "../GameContainer/DataPackager";
import LoadingPage from "./LoadingPage";
import instance from "./Api";

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CameraIcon from "@material-ui/icons/PhotoCamera";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import DeleteIcon from "@material-ui/icons/Delete";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import Tooltip from "@material-ui/core/Tooltip";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { green, purple, pink } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Preview from "../GameContainer/Preview";
import initSetting from "../GameContainer/Setting/example_0";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(pink[100]),
    backgroundColor: pink[100],
    "&:hover": {
      backgroundColor: pink[100],
    },
  },
}))(Button);

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        material-ui
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

export default function Album(props) {
  const classes = useStyles();
  const history = useHistory();
  const { uuid, name } = props.data;
  const [mapIDs, setMapIDs] = useState(props.data.mapIDs);
  // const [mapData, setMapData] = useState({});
  // for Snackbar Alert
  const [msgOpen, setMsgOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success"); // "error", "warning", "info", "success"
  const [allMaps, setAllMaps] = useState([]);
  // delete dialog
  const [deleteID, setDeleteID] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  // get data before render
  const [isBusy, setBusy] = useState(true);

  const DeleteSingleMap = async (id) => {
    const {
      data: { success, errorCode },
    } = await instance.post("/api/deleteSingleMap", {
      id,
      uuid,
    });
    if (!success) {
      setAlertMsg(`Delete Fail`);
      setAlertType("error");
      setMsgOpen(true);
    } else {
      setAlertMsg(`Delete success`);
      setAlertType("success");
      setMsgOpen(true);
      getMapIDs();
    }
  };
  const handlerDeleteSingleMap1 = () => {
    DeleteSingleMap(deleteID);
    setOpenDialog(false);
  };
  const handlerDeleteSingleMap = (id) => {
    setDeleteID(id);
    setOpenDialog(true);
  };

  const getAllMaps = async (mapIDs) => {
    console.log(`getAllMaps`);
    const {
      data: { success, errorCode, maps },
    } = await instance.post("/api/getAllMaps", {
      mapIDs,
    });
    if (!success) {
      console.log(`FAIL`);
    } else {
      // console.log(maps);
      setAllMaps(maps);
    }
  };

  const getMapIDs = async () => {
    // console.log("TT");
    const {
      data: { success, mapIDs },
    } = await instance.post("/api/getUserData", {
      uuid,
    });
    if (!success) {
      console.log(`getMapids fail`);
    } else {
      console.log(mapIDs);
      setMapIDs(mapIDs);
      getAllMaps(mapIDs);
    }
    setBusy(false);
  };

  const handlerStatistic = (key) => {
    if (allMaps[key] === undefined) {
      return `...`;
    } else {
      const { fastestPass, fastestMan, passTime, playTime } =
        allMaps[key].statistic;

      return `fastestPass:${fastestPass}, fastestMan:${fastestMan}, passTime:${passTime}, playTime:${playTime}`;
    }
  };

  useEffect(() => {
    console.log(`busy?${isBusy}`);
    setBusy(true);
    getMapIDs();
  }, []);

  // console.log("render")
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <SportsEsportsIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            Play Ground
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
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
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Hi {name}
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              你可以在這邊設計、查看你所擁有的關卡！！
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      history.push(`/`);
                    }}
                  >
                    登出
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      history.push({
                        pathname: `/PopularMap`,
                        state: { uuid: uuid, name: name, login: true },
                      });
                    }}
                  >
                    查看熱門排行地圖
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={() => {
                      history.push({
                        pathname: `/EditMode`,
                        state: {
                          uuid: uuid,
                          name: name,
                          login: true,
                          id: 0,
                          title: "",
                          description: "",
                        },
                      });
                    }}
                  >
                    新地圖
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={getMapIDs}
                  >
                    重新整理
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Dialog
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              刪除地圖？（無法復原）
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialog(false);
              }}
              color="primary"
            >
              取消
            </Button>
            <Button onClick={handlerDeleteSingleMap1} color="primary" autoFocus>
              確認
            </Button>
          </DialogActions>
        </Dialog>
        {isBusy ? (
          <LoadingPage />
        ) : (
          <Container className={classes.cardGrid} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={4}>
              {mapIDs.map((ele, key) => (
                <Grid item key={ele} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    {/* <CardMedia
                      className={classes.cardMedia}
                      image="https://source.unsplash.com/random"
                      title="Image title"
                    /> */}
                    <Preview
                      setting={unpackage(
                        allMaps[key] ? allMaps[key].content : initSetting
                      )}
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {/* {ele.title} */}
                        {allMaps[key] ? allMaps[key].title : ""}
                      </Typography>
                      <Typography>
                        {allMaps[key] ? allMaps[key].description : ""}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        disabled={allMaps[key] === undefined}
                        onClick={() => {
                          history.push({
                            pathname: `/PlayMode`,
                            state: {
                              uuid: uuid,
                              name: name,
                              login: true,
                              id: ele,
                              mode: "test",
                            },
                          });
                        }}
                      >
                        Play
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        disabled={
                          allMaps[key] === undefined ||
                          (allMaps[key] !== undefined && allMaps[key].publish)
                        }
                        onClick={() => {
                          history.push({
                            pathname: `/EditMode`,
                            state: {
                              uuid: uuid,
                              name: name,
                              login: true,
                              id: ele,
                              title: allMaps[key] ? allMaps[key].title : "",
                              description: allMaps[key]
                                ? allMaps[key].description
                                : "",
                            },
                          });
                        }}
                      >
                        Edit
                      </Button>
                      {allMaps[key] === undefined ? (
                        <p>???</p>
                      ) : allMaps[key].publish ? (
                        <Tooltip title={handlerStatistic(key)}>
                          <Button size="small" color="primary" variant="text">
                            Statistic
                          </Button>
                        </Tooltip>
                      ) : (
                        <>
                          <ColorButton
                            size="small"
                            color="primary"
                            variant="contained"
                          >
                            Private
                          </ColorButton>
                        </>
                      )}
                      <IconButton
                        className={classes.margin}
                        size="large"
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                          handlerDeleteSingleMap(ele);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        )}
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        {/* <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography> */}
        {/* <Copyright /> */}
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}
