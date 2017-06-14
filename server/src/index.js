
// let http   = require('http')
// let server = http.createServer()
// let io     = require('socket.io')(server)

// server.listen(3000, () => {
// 	console.log('listening on *:3000')
// })
// 
// io.sockets.on('connection', socket => {
// 	console.log('socket connected...')
// 	socket.on('disconnect', () => {
// 		console.log('...socket disconnected')
// 		// socket.emit('text', 'wow. such event. very real time.')
// 	})
// 	socket.on('stream', data => {
// 		// console.log('stream', data)
// 		socket.broadcast.emit('stream', data)
// 	})
// 	socket.on('pointer', data => {
// 		console.log('[pointer]', data)
// 		socket.broadcast.emit('pointer', data)
// 	})
// })

// import http from 'http'
// import url  from 'url'
// import fs   from 'fs'
// import io   from 'socket.io'
// 
// let server = http.createServer((request, response) => {
// 	var path = __dirname + url.parse(request.url).pathname
// 	console.log(__dirname)
// 	console.log(path)
// 	fs.readFile(path, (error, data) => {
// 		if (error) {
// 			response.writeHead(404)
// 			response.write('opps this doesn\'t exist - 404')
// 			response.end()
// 		} else {
// 			response.writeHead(200, {'Content-Type': 'text/html'})
// 			response.write(data, 'utf8')
// 			response.end()
// 		}
// 	})
// }).listen(8000)
// 
// io(server).sockets.on('connection', socket => {
// 	
// })

import path from 'path'
import express from 'express'
const app = express()

app.get('/client', (req, res, next) => {
	return express.static(path.join(process.cwd(), 'www/client'))(req, res, next)
})

app.get('*', (req, res, next) => {
	return express.static(path.join(process.cwd(), 'www/wall'))(req, res, next)
})

app.listen(8000)
