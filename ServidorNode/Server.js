const url = require('url');
const fs = require('fs');
const path = require('path');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const urlMongo = 'mongodb://localhost:27017';

//var MyWallet = require('blockchain.info/MyWallet');
	
// var WalletOpt = {apiCode: '', apiHost: 'http://localhost:3001'};
// var Wallet = new MyWallet('613b056f-3b46-45b8-8be2-0ad7d04e2071', '12carlos', WalletOpt);

// Wallet.getBalance().then( function(vparResponse){
// 	console.log(vparResponse.balance);
// });


const http = require('http').createServer(function(req, res) {
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

	// var ext = path.parse(pathname).ext;
	// console.log('Primeira: ', ext);

	// if(ext == '.map') {
	// 	var urlstr = pathname;

	// 	if(urlstr.indexOf('.css') != -1) {
	// 		ext = '.css';
	// 	}else {
	// 		ext = '.js';
	// 	}

	// 	console.log('Com .map: ', ext);
	// }
	
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
});

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

http.listen(3001, function() {
	console.log('Listening port 3001');
});