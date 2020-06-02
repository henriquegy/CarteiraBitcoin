import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Initialize Firebase
var config = {
	apiKey: "AIzaSyDMUhoNH0lnoQHmXChhuDmLTr-D8CMWDlw",
	authDomain: "projetoteste-84041.firebaseapp.com",
	databaseURL: "https://projetoteste-84041.firebaseio.com",
	projectId: "projetoteste-84041",
	storageBucket: "projetoteste-84041.appspot.com",
	messagingSenderId: "633152006869"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
