const socket = io();

const form = document.getElementById('form');
const inputX = document.getElementById('inputX');
const inputY = document.getElementById('inputY');

form.addEventListener('submit', (e) => {
	e.preventDefault();
	const date = new Date().getTime();
	if (inputX.value.trim().length === 0 || inputY.value.trim().length === 0) return;
	socket.emit('mensaje-cliente', {
		fecha: date,
		x: inputX.value,
		y: inputY.value,
	});
	// input.value = '';
});
