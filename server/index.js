import express, { text } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { ObjectID } from 'bson';


const app = express();
let databaseConnected = false;
let salt = bcrypt.genSaltSync(10);

let port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.listen(port, () => {
	console.log(`servidor rodando na porta ${port}`);
});

let db;
MongoClient.connect(process.env.URL, (err, client) => {
	if (err) return console.log(err);
	db = client.db('mevnDataBase');

	databaseConnected = true;
	console.log('conectado ao banco de dados');
});

app.get('/', (req, res) => {
	res.send('Conectado ao servidor');
});

app.get('/databaseStatus', (req, res) => {
	res.send({ databaseStatus: databaseConnected });
});

app.post('/register', (req, res) => {
	let user = req.body;

	if (databaseConnected) {
		db.collection('users')
			.find({ email: user.email })
			.toArray((err, result) => {
				if (result.length === 0) {
					user.password = bcrypt.hashSync(user.password, salt);
					if (err) return console.log(err);
					console.log(user);

					db.collection('users').insertOne(user, (err, result) => {
						if (err) return console.log(err);

						console.log('Salvo no Banco de Dados');
						res.send({
							success: true,
							message: 'Registrado com sucesso.',
						});
					});
				} else {
					res.send({
						success: false,
						message: 'Esse email já esta cadastrado.',
					});
				}
			});
	} else {
		console.log(err);
		res.send({
			success: false,
			message: 'Não estamos conseguindo se conectar ao banco de dados',
		});
	}
});

app.post('/login', (req, res) => {
	let data = req.body;

	if (databaseConnected) {
		db.collection('users')
			.find({ email: data.email })
			.toArray((err, result) => {
				if (err) return console.log(err);
				if (result.length === 1) {
					if (bcrypt.compareSync(data.password, result[0].password)) {
						res.send({
							success: true,
							message: 'Logado com sucesso!',
							data: result[0],
						});
					} else {
						res.send({
							success: false,
							message: 'Senha incorreta',
						});
					}
				} else {
					res.send({
						success: false,
						message: 'Usuário inexistente',
					});
				}
				console.log(result);
			});
	} else {
		console.log(err);
		res.send({
			success: false,
			message: 'Não estamos conseguindo se conectar ao banco de dados',
		});
	}
});

app.post('/edit', (req, res) => {
	let data = req.body

	if (databaseConnected) {
		db.collection('users')
			.find({ _id: ObjectID(data.id) })
			.toArray((err, result) => {
				if (err) return console.log(err);
				if (result.length === 1) {
					if (bcrypt.compareSync(data.oldPass, result[0].password)) {
						db.collection('users').updateOne(
							{ _id: ObjectID(data.id) },
							{
								$set: {
									name: data.name,
									password: bcrypt.hashSync(data.newPass, salt),
								},
							},
							(err, result) => {
								if (err) return console.log(err);
								console.log('Atualizado no Banco de Dados');
							}
						);

						res.send({
							success: true,
							message: 'Editado com sucesso!',
							data: result[0],
						});
					} else {
						res.send({
							success: false,
							message: 'Algo deu errado, tente relogar.',
						});
					}
				} else {
					res.send({
						success: false,
						message: 'Usuário inexistente',
					});
				}
				console.log(result);
			});
	} else {
		console.log(err);
		res.send({
			success: false,
			message: 'Não estamos conseguindo se conectar ao banco de dados',
		});
	}
});

app
	.route('/comment')
	.get((req, res) => {
		db
			.collection('comment')
			.find()
			.toArray((err, result) => {
				if (err) return console.log(err);

				res.send(result);
			});
	})
	.post((req, res) => {
		let data = req.body;

		console.log(data);

		if (databaseConnected) {
			db
				.collection('users')
				.find({ _id: ObjectID(data.user) })
				.toArray((err, result) => {
					if (err) return console.log(err);
					if (result.length === 1) {
						if (bcrypt.compareSync(data.pass, result[0].password)) {
							db
								.collection('comment')
								.insertOne({ user: data.user, text: data.text }, (err, result) => {
									if (err) return console.log(err);
									console.log('comentario postado!')
									res.send({
										success: true,
										message: 'Comentário enviado com sucesso!',
									});
							});
						} else {
							res.send({
								success: false,
								message: 'Algo deu errado, tente relogar.',
							});
						}
					} else {
						res.send({
							success: false,
							message: 'Usuário inexistente',
						});
					}
					console.log(result);
				});
		} else {
			console.log(err);
			res.send({
				success: false,
				message: 'Não estamos conseguindo se conectar ao banco de dados',
			});
		}
	});

app.post('/user', (req, res) => {
	let data = req.body;

	db
		.collection('users')
		.find({ _id: ObjectID(data.id) })
		.toArray((err, result) => {
			res.send(result[0]);
		});
});
