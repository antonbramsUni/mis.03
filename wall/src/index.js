
import '../graphic/style.sass'
import io from 'socket.io-client'
import {Screen, vec, event} from 'fw'
import drag from './drag'
import test from './test'

// app communication
export let e = new event.Machine('App')

// server communication
var socket = io('http://localhost:3000')
socket.on('connect', () => console.log('[Sockets] connected...'))
socket.on('stream', test)

// send view snapshot to the server
e.on('update', data => socket.emit('update', data))

// pointer events
socket.on('pointer', event => {
	if (event.type == 'up') 
		drag.up()
	else {
		let pointer = new vec(event.x, event.y)
		if (event.type == 'down') drag.down(pointer)
		else if (event.type == 'move') drag.move(pointer)
	}
})

// mouse drag test
Screen.on('mousedown', e => {
	let pointer = new vec(e.clientX, e.clientY)
	drag.down(pointer)
})
Screen.on('mousemove', e => {
	let pointer = new vec(e.clientX, e.clientY)
	drag.move(pointer)
})
Screen.on('mouseup', e => {drag.up()})
