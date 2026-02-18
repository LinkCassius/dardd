import React from "react";
import { withStyles } from "@material-ui/core/styles";

const defaultToolbarStyles = {
  iconButton: {},
};

class CustomToolbar extends React.Component {
  render() {
    return (
      <button
        onClick={this.props.onClick}
        type="button"
        className="btn btn-success"
      >
        <i className="icon-diff"></i> {this.props.title}
      </button>
    );
  }
}

export default withStyles(defaultToolbarStyles, { name: "CustomToolbar" })(
  CustomToolbar
);
