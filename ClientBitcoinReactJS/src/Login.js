import React, { Component } from 'react';
import * as firebase from 'firebase';

class Login extends Component {
	constructor(props) {
		super(props);

		this.handleLogar = this.handleLogar.bind(this);
		this.handleTelaInscricao = this.handleTelaInscricao.bind(this);
	}

	handleLogar(event) {
		var vmetLoginSenha = this.refs.refEmail.value + '_' + this.refs.refSenha.value;

		console.log(vmetLoginSenha);

		const vmetFbMainDB = firebase.database().ref();
		const vmetFbChildUser = vmetFbMainDB.child('users').orderByChild('Email_Senha').equalTo(vmetLoginSenha);

		vmetFbChildUser.on('value', snap=>{
			if(snap.val() !== null) {
				var vmetKeyUser;
				var vmetUserName;

				snap.forEach( function(data) {
					vmetKeyUser = data.key;
					vmetUserName = data.val().NomeCompleto;
				});

				this.props.setUser(vmetKeyUser, vmetUserName);
				this.props.setLogin(true);
			}else {
				console.log();
			}
		});
	}

	handleTelaInscricao(event) {
		this.props.charmarTelaInscricao(false);
	}

	render() {
		return(
			<div>
				<div className="mdl-grid">
				  <div className="mdl-cell mdl-cell--12-col"></div>
				</div>

				<div className="mdl-grid">
				  <div className="mdl-cell mdl-cell--12-col"></div>
				</div>

				<div className="mdl-grid">
				  <div className="mdl-cell mdl-cell--12-col"></div>
				</div>

				<div className="mdl-grid">
					<div className="mdl-cell mdl-cell--12-col">
						<div align="center">
							<div className="demo-card-square mdl-card mdl-shadow--2dp">
							  <div className="mdl-card__title mdl-card--expand extern_color_red">
							    <h2 className="mdl-card__title-text">Login</h2>
							  </div>

							  <div align="left" className="mdl-card__supporting-text">
							    Para acessar a área restrita informe os seguintes dados.

							    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
								  <input ref="refEmail" className="mdl-textfield__input" type="text"/>
								  <label className="mdl-textfield__label">Email</label>
								</div>
								<div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
								  <input ref="refSenha" className="mdl-textfield__input" type="password"/>
								  <label className="mdl-textfield__label">Senha</label>
								</div>

							  </div>

							  <div align="left" className="mdl-card__actions mdl-card--border">
							    <a 
							    	onClick={this.handleLogar} 
							    	className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
							    >
							      Acessar
							    </a>
							    <a 
							    	onClick={this.handleTelaInscricao} 
							    	className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
							    >
							      Me Inscrever
							    </a>
							  </div>
							</div>
						</div>	
					</div>		
				</div>
			</div>
		);
	}
}

export default Login;