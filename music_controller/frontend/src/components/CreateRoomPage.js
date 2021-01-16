import React, { Component } from "react";

import { Link } from "react-router-dom";

import {
  TextField,
  Grid,
  Typography,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormHelperText,
  Collapse,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
export default class CreateRoomPage extends Component {
  static defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    updateCallback: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: this.props.votesToSkip,
      guestCanPause: this.props.guestCanPause,
      errorMsg: "",
      successMsg: "",
    };
    this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
    this.handleVotesChange = this.handleVotesChange.bind(this);
    this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
    this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);
  }

  handleVotesChange(e) {
    this.setState({
      votesToSkip: e.target.value,
    });
  }

  handleGuestCanPauseChange(e) {
    this.setState({
      guestCanPause: e.target.value === "true" ? true : false,
    });
  }

  handleRoomButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
      }),
    };

    fetch("/api/create_room/", requestOptions)
      .then((response) => response.json())
      .then((data) => this.props.history.push("/room/" + data.code));
  }

  handleUpdateButtonPressed() {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
        code: this.props.roomCode,
      }),
    };

    fetch("/api/update_room", requestOptions).then((response) => {
      if (response.ok) {
        this.setState({
          successMsg: " به روزرسانی با موفقیت انجام شد ",
        });
      } else {
        this.setState({
          errorMsg: "خطایی در به روزرسانی وجود دارد",
        });
      }
      this.props.updateCallback();
    });
  }

  renderCreateButtons() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={this.handleRoomButtonPressed}
          >
            ایجاد
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            بازگشت
          </Button>
        </Grid>
      </Grid>
    );
  }

  renderUpdateButtons() {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={this.handleUpdateButtonPressed}
        >
          به روز رسانی
        </Button>
      </Grid>
    );
  }

  render() {
    const title = this.props.update ? "به روز رسانی" : "ساختن اتاق جدید";
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Collapse
            in={this.state.errorMsg != "" || this.state.successMsg != ""}
          >
            {this.state.successMsg != "" ? (
              <Alert
                severity="success"
                onClose={() => {
                  this.setState({ successMsg: "" });
                }}
              >
                {this.state.successMsg}
              </Alert>
            ) : (
              <Alert
                severity="error"
                onClose={() => {
                  this.setState({ errorMsg: "" });
                }}
              >
                {this.state.errorMsg}
              </Alert>
            )}
          </Collapse>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl component="fieldset">
            <FormHelperText>
              <div align="center">کنترل پخش </div>
            </FormHelperText>
            <RadioGroup
              row
              defaultValue={this.props.guestCanPause.toString()}
              onChange={this.handleGuestCanPauseChange}
            >
              <FormControlLabel
                value="true"
                control={<Radio color="primary" />}
                label="پخش/توقف"
                labelPlacement="buttom"
              />
              <FormControlLabel
                value="false"
                control={<Radio color="secondary" />}
                label="عدم کنترل"
                labelPlacement="buttom"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
            <TextField
              required="true"
              type="number"
              defaultValue={this.state.votesToSkip}
              onChange={this.handleVotesChange}
              inputProps={{
                min: 1,
                style: { textAlign: "center" },
              }}
            />
            <FormHelperText>
              <div align="center">تعداد رای ها</div>
            </FormHelperText>
          </FormControl>
        </Grid>
        {this.props.update
          ? this.renderUpdateButtons()
          : this.renderCreateButtons()}
      </Grid>
    );
  }
}
