import React, { Component } from 'react';
import * as firebase from 'firebase';

class Inscricao extends Component {
	constructor(props) {
		super(props);

		this.handleTelaLogin = this.handleTelaLogin.bind(this);
		this.handleCadastrar = this.handleCadastrar.bind(this);
	}

	handleCadastrar(event) {
		var vmetCamposObgIsEmpty = false;
		const vmetFbMainDB = firebase.database();
		const vmetFbChildUsers = vmetFbMainDB.ref().child('users');

		// Construindo o usuário dinâmicamente
		// Caso tenha algum campo que tenha sido preenchido e não seja obrigatório
		// o mesmo não será inserido no objeto json.
		let vmetDinamicUser = {};

		if(this.refs.nomecompleto.value !== "") {
			vmetDinamicUser.NomeCompleto = this.refs.nomecompleto.value;
		}else {
			vmetCamposObgIsEmpty = true;
		}

		if((this.refs.email.value !== "") && (this.refs.senha.value !== "")) {
			vmetDinamicUser.Email_Senha = this.refs.email.value + '_' + this.refs.senha.value;
		}else {
			vmetCamposObgIsEmpty = true;
		}

		if(this.refs.agencia.value !== "") {
			vmetDinamicUser.Agencia = parseInt(this.refs.agencia.value, 10);
		}else {
			vmetCamposObgIsEmpty = true;
		}

		if(this.refs.conta.value !== "") {
			vmetDinamicUser.Conta = parseInt(this.refs.conta.value, 10);
		}else {
			vmetCamposObgIsEmpty = true;
		}

		if(this.refs.operacao.value !== "") {
			vmetDinamicUser.Operacao = parseInt(this.refs.operacao.value, 10);
		}

		if(this.refs.banconome.value !== "") {
			vmetDinamicUser.BancoNome = this.refs.banconome.value;
		}else {
			vmetCamposObgIsEmpty = true;
		}
		
		if((vmetCamposObgIsEmpty) && (Object.keys(vmetDinamicUser).length === 0)) {
			console.log("Existem campos vazios!");
		}else {
			console.log(vmetDinamicUser);

			vmetFbChildUsers.push().set(vmetDinamicUser);
		}
	}

	handleTelaLogin(event) {
		this.props.charmarTelaInscricao(true);
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
							    <h2 className="mdl-card__title-text">Me inscrever</h2>
							  </div>

							  <div align="left" className="mdl-card__supporting-text">
							    Todos os dados são obrigatórios.

							    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
								  <input ref="nomecompleto" className="mdl-textfield__input" type="text"/>
								  <label className="mdl-textfield__label">Nome Completo</label>
								</div>
								<div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
								  <input ref="email" className="mdl-textfield__input" type="text"/>
								  <label className="mdl-textfield__label">Email</label>
								</div>
								<div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
								  <input ref="senha" className="mdl-textfield__input" type="password"/>
								  <label className="mdl-textfield__label">Senha</label>
								</div>
								<div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
								  <input ref="agencia" className="mdl-textfield__input" type="number"/>
								  <label className="mdl-textfield__label">Agência</label>
								</div>
								<div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
								  <input ref="conta" className="mdl-textfield__input" type="number"/>
								  <label className="mdl-textfield__label">Conta</label>
								</div>
								<div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
								  <input ref="operacao" className="mdl-textfield__input" type="number"/>
								  <label className="mdl-textfield__label">Operação</label>
								</div>
								<div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
								  <input ref="banconome" className="mdl-textfield__input" type="text"/>
								  <label className="mdl-textfield__label">Nome do banco</label>
								</div>

							  </div>

							  <div align="left" className="mdl-card__actions mdl-card--border">
							    <a 
							    	onClick={this.handleCadastrar} 
							    	className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
							    >
							      Confirmar Dados
							    </a>
							    <a 
							    	onClick={this.handleTelaLogin} 
							    	className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
							    >
							      Login
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

export default Inscricao;