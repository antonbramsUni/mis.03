
const ip	  = require('ip')
const path    = require('path')
const request = require('request')
const express = require('express')
const app     = express()
const server  = require('http').Server(app).listen(8000)
const io      = require('socket.io')(server)

//app.use('/wall', express.static('www/wall'))
// app.use('/client', express.static('www/client'))

let clients = [
	'wall',
	'client'
].forEach(c => app.use(`/${c}`, (req, res, next) => req
	.pipe(request(`http://${ip.address()}:8080/www/${c}${req.url}`))
	.pipe(res)))

io.sockets.on('connection', socket => {
	console.log('socket connected...')
	socket.on('disconnect', () => {
		console.log('...socket disconnected')
	})
	let broadcast = [
		'pointer', 
		'redraw',
		'tracking'
	].forEach(a => {
		socket.on(a, data => {
			console.log(`${a}\t`, new Date())
			socket.broadcast.emit(a, data)
		})
	})
})
