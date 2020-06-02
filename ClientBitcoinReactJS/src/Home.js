import React, { Component } from 'react';

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			balance: "null"
		};

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		console.log("balance");
		var MyWallet = require('blockchain.info/MyWallet');
		var options = {apiCode: '', apiHost: 'http://localhost:3001'};
		var wallet = new MyWallet('613b056f-3b46-45b8-8be2-0ad7d04e2071', '12carlos', options);

		wallet.getBalance().then(response => {
			console.log(response);
			this.setState({
				balance: response.balance
			});
		});
	}

	render() {		
		return(
			<div>
				<h1>Bem vindo a home page! {this.props.speed}</h1>
				<button onClick={this.handleClick}>Balance</button>
				<div>{this.state.balance}</div>
			</div>
		);
	}
}

export default Home;