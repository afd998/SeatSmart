import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import themeFile from "./util/theme"
import "./App.css";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles/";
import { Box } from '@material-ui/core';
import { Typography} from '@material-ui/core';
import { CssBaseline } from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import jwtDecode from "jwt-decode";
import AuthRoute from './util/AuthRoute'
//PAGES
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";
//REDUX
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from "./redux/actions/userActions";
import axios from "axios";
const theme = createMuiTheme(themeFile);
const token = localStorage.FBIdToken;

axios.defaults.baseURL = 'https://us-central1-seatingsmart-15114.cloudfunctions.net/api';
//axios.defaults.baseURL = "http://localhost:5000/seatingsmart-15114/us-central1/api";
if (token) {
  const decodedToken = jwtDecode(token)
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = '/login';
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}else{

}
function App() {
  return (
    <div className = {theme.root}>
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline/>
        <Router>
          <div className="container">
            <Switch>
              <Route exact path="/" component={home} />
              <AuthRoute exact path="/login" component={login} />
              <AuthRoute exact path="/signup" component={signup} />
            </Switch>
          </div>
        </Router>
      </MuiThemeProvider>
    </Provider>
    </div>
  );
}

export default App;
