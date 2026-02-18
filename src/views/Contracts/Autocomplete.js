import React, { Component } from "react";
import PropTypes from "prop-types";
import { ApiEndPoints } from "../../config";

import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { check } from "./../../utils/authHelper";
import auth from "../../auth";

export class Autocomplete extends Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array),
  };
  static defaultProperty = {
    suggestions: [],
  };
  constructor(props) {
    super(props);
    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: "",
      contracts: null,
      id: "",
    };
  }

  onChange = (e) => {
    const userInput = e.currentTarget.value;
    fetch(ApiEndPoints.globalsearch + "?search=" + userInput, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          filteredSuggestions: data.result,
        });
      })
      .catch(console.log);

    this.setState({
      activeSuggestion: 0,
      showSuggestions: true,
      userInput: e.currentTarget.value,
    });
  };

  onClick = (e) => {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText,
    });
    this.setState({ id: e.currentTarget.id });
    if (check("ContractDetail View Access"))
      this.props.history.push("/contract-detail/" + e.currentTarget.id);
  };
  onKeyDown = (e) => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion],
      });
    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    } else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
      },
    } = this;
    let suggestionsListComponent;
    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions">
            {filteredSuggestions.map((contract, index) => {
              let className;
              if (index === activeSuggestion) {
                className = "";
              }
              return (
                <li
                  className="lilist"
                  key={contract._id}
                  id={contract._id}
                  onClick={onClick}
                >
                  {contract.contractNumber}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>No suggestions</em>
          </div>
        );
      }
    }

    return (
      <React.Fragment>
        <div className="float-left"><input
          type="search"
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={userInput}
          placeholder="Search Contract"
        />
        </div>
        {suggestionsListComponent}
      </React.Fragment>
    );
  }
}

export default withRouter(Autocomplete);
