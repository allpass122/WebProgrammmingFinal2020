import React from "react";
import { useState, useEffect } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
// import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";

import Title from "./Title";

// function preventDefault(event) {
//   event.preventDefault();
// }

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Orders(props) {
  const classes = useStyles();
  // console.log(props.data);
  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
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
                  console.log("Hi");
                }}
              >
                <SportsEsportsIcon />
              </IconButton>
              <TableCell>{map.author}</TableCell>
              <TableCell>{map.title}</TableCell>
              <TableCell>{map.description}</TableCell>
              <TableCell>{map.statistic.playTime}</TableCell>
              <TableCell>{map.statistic.passTime}</TableCell>
              <TableCell>{map.statistic.fastestPass}</TableCell>
              <TableCell align="right">{map.statistic.fastestMan}</TableCell>
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
