import cors from 'cors';
import dotnev from 'dotenv';
import express from 'express';
import http from 'http';
import { dirname } from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dbConnection } from './database/config.js';
import Coordenadas from './models/coordenadas.js';
import Pedidos from './models/pedidos.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configura las variables de entorno
dotnev.config();

// Crear la app con express
const app = express();

// CORS
app.use(cors());

// Crear el servidor con http
const server = http.createServer(app);

// Base de datos
dbConnection();

const users = {};

app.use((req, res, next) => {
	console.log(req.url);
});

// Configuración del socket server
const io = new Server(server);

app.get('/cliente', (req, res) => {});

io.on('connection', (socket) => {
	socket.on('crear-pedido', async () => {
		const date = new Date().getTime();
		const pedido = new Pedidos({
			fecha: date,
		});

		await pedido.save();

		users[socket.id] = {
			socket: socket,
			pedido_id: pedido.id,
		};
	});

	socket.on('mensajero', async (payload) => {
		const coordenadas = new Coordenadas({
			x: payload.x,
			y: payload.y,
			pedido_id: users[payload.socket_id].pedido_id,
		});

		await coordenadas.save();

		users[payload.socket_id].socket.emit('mensaje-servidor', coordenadas);
	});

	socket.on('pedidos', async () => {
		io.emit('cliente', Object.keys(users));
	});

	socket.on('ruta-pedido', async (payload) => {
		console.log(payload);
		const pedido = await Coordenadas.find({
			pedido_id: users[payload].pedido_id,
		}).populate('pedido_id');
		socket.emit('ruta-pedido', pedido);
	});

	socket.on('disconnect', () => {
		console.log('Desconectado', socket.id);
		delete users[socket.id];
	});
});

server.listen(process.env.PORT, () => {
	console.log(`Server run http://localhost:${process.env.PORT}`);
});
