// src/AuthContext.js
//
// 2. create AuthContext
//
import React from "react";

const AuthContext = React.createContext({ isAuth: false });

class AuthProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isAuth: false };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login() {
    // fake async
    setTimeout(() => this.setState({ isAuth: true }), 1000);
  }

  logout() {
    this.setState({ isAuth: false });
  }

  render() {
    return (
      <AuthContext.Provider
        value={{
          isAuth: this.state.isAuth,
          login: this.login,
          logout: this.logout
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };
