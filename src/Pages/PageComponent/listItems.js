import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import FiberNewIcon from "@material-ui/icons/FiberNew";
import AccessibleForwardIcon from "@material-ui/icons/AccessibleForward";

export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="All Maps" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <WhatshotIcon />
      </ListItemIcon>
      <ListItemText primary="Most Plays" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <InsertEmoticonIcon />
      </ListItemIcon>
      <ListItemText primary="Most Passes" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <FiberNewIcon />
      </ListItemIcon>
      <ListItemText primary="Newest" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AccessibleForwardIcon />
      </ListItemIcon>
      <ListItemText primary="Oldest" />
    </ListItem>
  </div>
);

// export const secondaryListItems = (
//   <div>
//     <ListSubheader inset>Saved reports</ListSubheader>
//     <ListItem button>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Current month" />
//     </ListItem>
//     <ListItem button>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Last quarter" />
//     </ListItem>
//     <ListItem button>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Year-end sale" />
//     </ListItem>
//   </div>
// );
