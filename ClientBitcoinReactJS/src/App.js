import React, { Component } from 'react';
import * as firebase from 'firebase';
import io from 'socket.io-client';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import Home from './Home';
import Autenticacao from './Autenticacao';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: false,
      speed: 10,
      socket: null,
      user:{
        id: "",
        nome: ""
      }
    };

    this.setLogin = this.setLogin.bind(this);
    this.setUser = this.setUser.bind(this);
    this.socketConn = this.socketConn.bind(this);
  }

  componentWillMount() {
    this.socketConn();
  }

  socketConn() {
    const socket = io('http://localhost:3001');

    socket.on('connect', function(){
      console.log('conectou!');
      this.setState({socket: socket});
    });
  }

  componentDidMount() {
    const rootRef = firebase.database().ref().child('react');
    const speedRef = rootRef.child('speed');

    speedRef.on('value', snap=>{
      this.setState({
        speed: snap.val()
      });
    });
  }

  setLogin(login) {
    this.setState({login: login});

    console.log(this.state.login);
  }

  setUser(id, name) {
    this.setState({
      user: {
        id,
        name
      }
    });

    console.log(this.state.user);
  }

  render() {
    return (
      <Router>

      <div className="App">
        <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
          <header className="mdl-layout__header">
            <div className="mdl-layout__header-row">
              <span className="mdl-layout-title">i9Coins</span>
              <div className="mdl-layout-spacer"></div>
              <nav className="mdl-navigation mdl-layout--large-screen-only">
                <Link className="mdl-navigation__link" to="/">Home</Link>
                <Link className="mdl-navigation__link" to="/Autenticacao">
                  {
                    this.state.login &&
                    "Market"
                  }
                  {
                    !this.state.login &&
                    "Login"
                  }
                </Link>
                <a className="mdl-navigation__link">{this.state.user.name}</a>
              </nav>
            </div>
          </header>

          <div className="mdl-layout__drawer">
            <span className="mdl-layout-title">Title</span>
            <nav className="mdl-navigation">
              <a className="mdl-navigation__link" href="">Link</a>
              <a className="mdl-navigation__link" href="">Link</a>
              <a className="mdl-navigation__link" href="">Link</a>
              <a className="mdl-navigation__link" href="">Link</a>
            </nav>
          </div>

          <main className="mdl-layout__content">
            <div className="page-content">

                <Route 
                  exact path='/' 
                  render={
                    (props) => 
                      <Home 
                        {...props} 
                        speed={this.state.speed} 
                      />
                  } 
                />

                <Route 
                  exact path='/Autenticacao' 
                  render={
                    (props) => 
                      <Autenticacao 
                        {...props} 
                        setLogin={this.setLogin} 
                        setUser={this.setUser}
                        logado={this.state.login} 
                        socket={this.state.socket}
                      />
                  } 
                />

            </div>
          </main>
        </div>
      </div>

      </Router>
    );
  }
}

export default App;
