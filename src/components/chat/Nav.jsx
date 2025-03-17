import React, { useEffect, useRef, useState } from "react";
import "./stylesheets/nav.css";
import logo from "../../assets/logo.png";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./modals/ProfileModal";
import NotificationBadge, { Effect } from "react-notification-badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Dialog from "@mui/material/Dialog";

// import Button from "@mui/material/Button";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

const Nav = () => {
  const { user } = ChatState();

  const { notification } = ChatState();

  return (
    <>
      <div id="nav">
        <button>Search Users</button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={logo} height={45} width={45} alt="" />
          <h2 style={{ color: "#347136" }}>Talk-A-Tive</h2>
        </div>

        <div id="nav-right">
          <div id="notif-btn">
            <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}
            />
            <NotificationsIcon style={{ cursor: "pointer" }} />

            {/* <PopupState variant="popover" popupId="demo-popup-menu">
              {(popupState) => (
                <React.Fragment>
                  <Button variant="contained" {...bindTrigger(popupState)}>
                    Dashboard
                  </Button>
                  <Menu {...bindMenu(popupState)}>
                    <MenuItem onClick={popupState.close}>Profile</MenuItem>
                    <MenuItem onClick={popupState.close}>My account</MenuItem>
                    <MenuItem onClick={popupState.close}>Logout</MenuItem>
                  </Menu>
                </React.Fragment>
              )}
            </PopupState> */}
          </div>

          <div id="profile-btn" onClick={showProfileModal}>
            <img src={user?.pic} height={35} width={50} alt="" />
            <ArrowDropDownIcon />
          </div>
        </div>
      </div>

      {/* search modal */}
      <div
        className="modal"
        id="search-modal"
        style={{ display: searchModalShow ? "block" : "none" }}
      >
        <SearchModal />
      </div>

      {/* profile modal */}
      <div
        className="profile-modal"
        style={{ display: profileModalShow ? "block" : "none" }}
      >
        <ProfileModal />
      </div>
    </>
  );
};

export default Nav;
