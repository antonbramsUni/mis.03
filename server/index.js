
const path    = require('path')
const express = require('express')
const app     = express()
const server  = require('http').Server(app).listen(8000)
const io      = require('socket.io')(server)

app.use('/wall', express.static('www/wall'))
app.use('/client', express.static('www/client'))

io.sockets.on('connection', socket => {
	console.log('socket connected...')
	socket.on('disconnect', () => {
		console.log('...socket disconnected')
	})
	socket.on('stream.client', data => {
		console.log('stream', new Date())
		socket.broadcast.emit('stream.client', data)
	})
	socket.on('stream.wall', data => {
		// console.log('stream', new Date())
		// socket.broadcast.emit('stream', data)
	})
	socket.on('pointer', data => {
		// console.log('[pointer]', data)
		socket.broadcast.emit('pointer', data)
	})
})
