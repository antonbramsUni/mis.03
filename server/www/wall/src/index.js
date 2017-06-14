
import '../graphic/style.sass'
import io from 'socket.io-client'
import {Screen, vec, event} from 'fw'
import drag from './drag'
import test from './test'

// app communication
export let e = new event.Machine('App')

// server communication
var socket = io()
socket.on('connect', () => console.log('[Sockets] connected...'))
socket.on('stream.client', test)

// send view snapshot to the server
e.on('update', data => socket.emit('stream.wall', data))

// pointer events
socket.on('pointer', event => {
	console.log(event)
	if (drag[event.type])
		drag[event.type](event)
})

// mouse drag test
Screen.on('mousedown', e => drag.down(new vec(e.clientX, e.clientY)))
Screen.on('mousemove', e => drag.move(new vec(e.clientX, e.clientY)))
Screen.on('mouseup', e => drag.up())
