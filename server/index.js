
let http   = require('http')
let server = http.createServer()
let io     = require('socket.io')(server)

server.listen(3000, () => {
	console.log('listening on *:3000')
})

io.sockets.on('connection', socket => {
	socket.on('disconnect', () => {
		console.log('socket disconnected')
		// socket.emit('text', 'wow. such event. very real time.')
	})
	socket.on('stream', data => {
		// console.log('stream', data)
		socket.broadcast.emit('stream', data)
	})
})