import cors from 'cors';
import dotnev from 'dotenv';
import express from 'express';
import http from 'http';
import { dirname } from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dbConnection } from './database/config.js';
import Pedidos from './models/pedidos.js';
import Coordenadas from './models/coordenadas.js'

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

app.use('/', express.static('public'));

// Configuración del socket server
const io = new Server(server);

io.on('connection', (socket) => {

	socket.on('mensaje-cliente', async (payload) => {

		const pedido = new Pedidos({
			fecha: payload.fecha,
		});

		await pedido.save();

		const coordenadas = new Coordenadas({
			x: payload.x,
			y: payload.y,
			pedido: pedido._id,
		});

		await coordenadas.save();

	});

	socket.on('disconnect', () => {
		console.log('Desconectado', socket.id);
	});
});

server.listen(process.env.PORT, () => {
	console.log(`Server run http://localhost:${process.env.PORT}`);
});
