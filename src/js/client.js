import 'file-loader?name=[name].[ext]!../index.html';
import 'file-loader?name=./css/[name].[ext]!../css/style.css';

import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";

import Archives from "./pages/Archives";
import Featured from "./pages/Featured";
import Layout from "./pages/Layout";
import TodoGo from "./pages/TodoGo";
import NotFound from "./pages/NotFound";

import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyBW9pOmFeAtm3TN83YvmDiouwWySJQzabI",
  authDomain: "chatroom-53e95.firebaseapp.com",
  databaseURL: "https://chatroom-53e95.firebaseio.com",
  storageBucket: "chatroom-53e95.appspot.com",
  messagingSenderId: "286065195870"
};
firebase.initializeApp(config);

const app = document.getElementById('app');

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute component={TodoGo}></IndexRoute>
    </Route>
    <Route path='*' component={NotFound} />
  </Router>,
app);