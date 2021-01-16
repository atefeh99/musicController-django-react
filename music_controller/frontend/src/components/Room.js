import React, { Component } from "react";
import { Typography, Grid, Button } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      showSettings: false,
    };
    this.roomCode = this.props.match.params.roomCode; //get the roomcode from url
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this); //bind the function to constructor
    this.updateShowSettings = this.updateShowSettings.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    this.renderSettingsButton = this.renderSettingsButton.bind(this);
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.getRoomDetails(); //set room details from a unique code
  }
  //when you use setState in a function that function should be bind to the class in order to use this function in other components
  getRoomDetails() {
    fetch("/api/get_room" + "?code=" + this.roomCode)
      .then((response) => {
        if (!response.ok) {
          this.props.leaveRoomCallback();
          this.props.history.push("/");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
      });
  }
  //delete the room when button pressed
  leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      header: { "Content-Type": "application/json" },
    };
    fetch("/api/leave_room/", requestOptions).then((_response) => {
      this.props.leaveRoomCallback();
      this.props.history.push("/");
    });
  }
  updateShowSettings(value) {
    this.setState({
      showSettings: value,
    });
  }
  renderSettings() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={this.state.votesToSkip}
            guestCanPause={this.state.guestCanPause}
            roomCode={this.roomCode}
            updateCallback={this.getRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => this.updateShowSettings(false)}
          >
            بستن
          </Button>
        </Grid>
      </Grid>
    );
  }
  renderSettingsButton() {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.updateShowSettings(true)}
        >
          تنظیمات
        </Button>
      </Grid>
    );
  }

  render() {
    if (this.state.showSettings) {
      return this.renderSettings();
    }
    return (
      <Grid dir="rtl" container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            کد : {this.roomCode}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            رای ها : {this.state.votesToSkip}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            کنترل پخش:
            {this.state.guestCanPause ? "دارد" : " ندارد "}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            قابلیت میزبان : {this.state.isHost ? "دارد" : " ندارد "}
          </Typography>
        </Grid>
        {this.state.isHost ? this.renderSettingsButton() : null}
        <Grid item xs={12} align="center">
          <Button
            color="secondary"
            variant="contained"
            onClick={this.leaveButtonPressed}
          >
            ترک کردن اتاق
          </Button>
        </Grid>
      </Grid>
    );
  }
}
