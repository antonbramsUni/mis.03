
const ip	  = require('ip')
const path    = require('path')
const request = require('request')
const express = require('express')
const app     = express()
const server  = require('http').Server(app).listen(8000)
const io      = require('socket.io')(server)

//app.use('/wall', express.static('www/wall'))
// app.use('/client', express.static('www/client'))

app.use('/client', (req, res, next) => 
	req.pipe(request(`http://${ip.address()}:8080/www/client${req.url}`)).pipe(res))
app.use('/wall', (req, res, next) =>
	req.pipe(request(`http://${ip.address()}:8080/www/wall${req.url}`)).pipe(res))

io.sockets.on('connection', socket => {
	console.log('socket connected...')
	socket.on('disconnect', () => {
		console.log('...socket disconnected')
	})
	// socket.on('stream.client', data => {
	// 	console.log('stream', new Date())
	// 	socket.broadcast.emit('stream.client', data)
	// 	// write to the disk
	// 	// fs.writeFile('./learn/client.jpg',
	// 	// 	data.replace(/^data:image\/jpeg;base64,/, ""), 
	// 	// 	'base64', console.log)
	// })
	// socket.on('stream.wall', data => {
	// 	// console.log('stream', new Date())
	// 	// socket.broadcast.emit('stream', data)
	// 	// write to the disk
	// 	// fs.writeFile('./learn/wall.jpg', 
	// 	// 	data.replace(/^data:image\/jpeg;base64,/, ""), 
	// 	// 	'base64', console.log)
	// })
	socket.on('pointer', data => {
		console.log('[pointer]', new Date())
		socket.broadcast.emit('pointer', data)
	})
	socket.on('redraw', () => {
		console.log('[redraw]', new Date())
		socket.broadcast.emit('redraw')
	})
})
