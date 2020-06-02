# CarteiraBitcoin
Carteira bitcoin como mercadobitcoin.com.br

A minha intenção com esse projéto era criar um servidor http puro do zero se o uso de bibliotécas prontas como Express, que service
as paginas html e os arquivos státicos que a compõe imagens, css, jsvascript, videos, etc. Entretanto na hora de gerar o handshake(aperto de mãos) entre o index.html e o socket.io no próprio servidor deu muito trabalho a ponto de não funcionar e percebi que ia demandar
mais tempo do que eu queria dispor para entender todos os nuances que envolvem um servidor web como o apache.

Com isso explicado vou começar expanando o servidor com o conhecimento contido nele.

Na pasta ServidorNode, arquivos importantes:

index.html 
static(pasta)
not-found(pasta)
Server.js

Os arquivos e pastas index.html, static(pasta) e not-found(pasta), podem ser ignorados a menos que você queira dar prosseguimento
no trabalho de construir um servidor http do zero.

Server.js

```javascript
const url = require('url');
const fs = require('fs');
const path = require('path');
```

Aqui eu uso tres bibliotecas para resolver problemas de url, arquivos(fs) e pastas(path).

```javascript
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const urlMongo = 'mongodb://localhost:27017';
```

Instancio o driver do MongoDb com MongoClient, biblioteca assert para melhorar as comunicações do Node.js com o MongDb e por fim a url de onde o banco vai estar ouvindo.

```javascript
//var MyWallet = require('blockchain.info/MyWallet');
	
// var WalletOpt = {apiCode: '', apiHost: 'http://localhost:3001'};
// var Wallet = new MyWallet('613b056f-3b46-45b8-8be2-0ad7d04e2071', '12carlos', WalletOpt);

// Wallet.getBalance().then( function(vparResponse){
// 	console.log(vparResponse.balance);
// });
```
Nesta parte do código houve uma tentativa de integrar o servidor com a api da blockchain para criar e gerenciar carteiras.

```javascript
const http = require('http').createServer(function(req, res) {
```

Procurei usar o método http chamando o require da bibliotéca diretametne e lógo em seguida na mesma chamada o createServer para organizar o código uma vez que estou usando socket.io também no mesmo arquivo para interceptar as requisições http.

```javascript
console.log(`${req.method} ${req.url}`);
// parse URL
const parsedUrl = url.parse(req.url);
// extract URL path
let pathname = `.${parsedUrl.pathname}`;
// maps file extention to MIME types
const mimeType = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.eot': 'appliaction/vnd.ms-fontobject',
  '.ttf': 'aplication/font-sfnt'
};
```

Usei console.log para me mostrar o que estava vindo da url na requisição. url.parse resolve o endereço em um caminho com pastas, se a requisição for feita da url base como o endereço do site "www.meusite.com.br" ou "localhost" o servidor vai resolver a url na pasta padrão e com parseUrl.pathname eu pego o caminho inicial de tudo. mineType é só um objeto para que eu possa automatizar o retorno para o navegador de acordo com a extenção do arquivo.

```javascritp
fs.exists(pathname, function(exist) {
	
  if(!exist) {
    // if the file is not found, return 404
    res.statusCode = 404;
    res.end(`File ${pathname} not found!`);
    return;
  }
  // if is a directory, then look for index.html
  if (fs.statSync(pathname).isDirectory()) {
      pathname += '/index.html';
  }
  // read file from file system
  fs.readFile(pathname, function(err, data) {
    if(err) {
      res.statusCode = 500;
      res.end(`Error getting the file: ${err}.`);
    } else {
      // based on the URL path, extract the file extention. e.g. .js, .doc, ...
      const ext = path.parse(pathname).ext;

      // if the file is found, set Content-type and send data
      res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
      res.end(data);
    }
  });
});
```

Em fs.exists eu verifico o caminho resolvido pela requisição passada, se não existe o caminho passado na pastas do servidor eu retorno o erro 404 para o navegador(vale resaltar que em um servidor http sempre temos que retornar algo para o navegador). Se for realmente um diretório válido validado em fs.statSync(pathname).isDirectory(), então eu pego o caminho da pasta e adiciono o index.html isso vai fazer o servidor procurar o arquivo pra mim. Em fs.readFile eu tento ler o arquivo caso o arquivo esteja corrompido ou por algum motivo o servidor não consiga lê-lo eu retorno erro 500 para o navegador, caso consiga ler o arquivo então eu devolvo o arquivo para o navegador com a formatação que o mesmo está experando(depois veja na requisição do navegador os formatos de arquivos que ele recebe de servidores é bem interesante).

```javascript
const io = require('socket.io')(http);

io.on('connection', (socket) => {
	console.log('New conn id: ', socket.id);

	socket.on('insertCRUD', (insertCRUD) => {
		const obj = JSON.parse(insertCRUD);

		//socket.broadcast.emit('msg', insertCRUD);

		const insertOneDocument = function(db, doc, obj, callback) {
			const collection = db.collection(doc);

			collection.insertOne(obj, function(err, result){
				assert.equal(err, null);
				assert.equal(1, result.insertedCount);

				console.log("Inserted 1 document in collection document");
				callback(result);
			});
		};

		MongoClient.connect(urlMongo, function(err, client) {
			assert.equal(null, err);

			const db = client.db(obj.dbName);

			insertOneDocument(db, obj.collect, obj.data, function(){
				client.close();
			});
		});
	});
})
```

Na parte do socket.io é que a mágica acontece e não depende da parte do servidor http para existir. Em io.on eu abro a escuta do servidor para requisições via socket de clientes, no caso eu estou esperando uma mensagem em socket.on('insertCRUD', (insertCRUD) => {
quando algum cliente gerar um emit com a string "insertCRUD" eu estabeleço uma conexão com o MongoDB com o método MongoClient.connect(urlMongo, function(err, client) { e depois executo a inserção do dado no banco com o método const insertOneDocument = function(db, doc, obj, callback) {. Notem que separei a inserção em uma função de fora, porque quando faço isso posso ter mais de um método de inserção. Consulte a api MongoDB para saber mais de como usar os métodos do monco com o Node.js.

```javascript
http.listen(3001, function() {
	console.log('Listening port 3001');
});
```

E por ultimo temos o método listen que executa o servidor e é o primeiro método a ser executado no servidor node.

Na pasta ClientBitcoinReactJS, os arquivo importantes são:

App.js
Autenticacao.js
Home.js
Login.js

App.js

No ReactJS eu não utilizei Redux.

```javascript
import io from 'socket.io-client';
```

Faço o import do socket.io no lado do cliente.

```javascript
socketConn() {
  const socket = io('http://localhost:3001');

  socket.on('connect', function(){
    console.log('conectou!');
    this.setState({socket: socket});
  });
}
```

Criei um método para estabelecer a conexão com o socket e em this.setState({socket: socket}); eu passo objeto socket para aplicação toda para que eu possa fazer chamadas ao servidor em qualquer parte da aplicação.

```javascript
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
```

Aqui eu passo a bola do socket para o componente <Autenticacao /> e ele vai se encarregar de validar os usuários e depois liberar acesso as outras telas.

Com o tempo vou melhorar mais essa documentação.

Espero que sirva de conhecimento para alguem.

Bons estudos!
