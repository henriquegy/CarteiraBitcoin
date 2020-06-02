import React, { Component } from 'react';
import './StyleFull.css';

import Login from './Login';
import Inscricao from './Inscricao';

class Autenticacao extends Component {
	constructor(props) {
		super(props);

		this.state = {
			tela_login: true
		}

		this.handleLogout = this.handleLogout.bind(this);
		this.charmarTelaInscricao = this.charmarTelaInscricao.bind(this);
	}

	handleLogout(event) {
		this.props.setUser("", "");
		this.props.setLogin(false);

		this.props.socket.emit('msg', 'funcionou com reactjs');
	}

	charmarTelaInscricao(value) {
		this.setState({
			tela_login: value
		});
	}

	render() {
		if(this.props.logado) {
			return(
				<div>
					<h1>Login sucesso</h1>
					<button onClick={this.handleLogout}>Loout</button>
				</div>
			);
		}

		if(!this.state.tela_login) {
			return( 
				<Inscricao charmarTelaInscricao={this.charmarTelaInscricao} /> 
			);
		}

		return( 
			<Login 
				setLogin={this.props.setLogin} 
				setUser={this.props.setUser} 
				charmarTelaInscricao={this.charmarTelaInscricao}  
			/> 
		);
	}
}

export default Autenticacao;