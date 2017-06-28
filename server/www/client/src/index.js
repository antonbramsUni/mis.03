
import '../graphic/style.sass'
import io from 'socket.io-client'
import {Screen} from 'fw'

document.addEventListener('deviceready', () => {
	console.log('[App]', 'hello world')
	// app setup
	StatusBar.hide()
	window.screen.orientation.lock('landscape-primary')
	// socket 192.168.1.4
	let socket = io()
	socket.on('connect', () => {
		console.log(socket.id)
		socket.emit('hello', 'world')
	})
	// html elements
	let cv     = document.querySelector('.view')
	let last   = null
	let rate   = 100
	// start camera
	window.plugin.CanvasCamera.initialize(cv)
	window.plugin.CanvasCamera.start({
	    cameraPosition:'back', fps:30, use:'data',
	    canvas  : {width:667, height:375},
	    capture : {width:667, height:375},
		quality : 10,
	}, error => console.log('[CanvasCamera]', error))
	// mouse drag
	Screen.on('touchstart', e => {
		console.log('down', e)
		socket.emit('pointer', {
			type    : 'down',
			pointer : {x:e.pageX, y:e.pageY}
		})
	})
	Screen.on('touchmove', e => {
		console.log('move', e)
		if (new Date() - last > rate) {
			last = new Date()
			socket.emit('pointer', {
				type    : 'move',
				pointer : {x:e.pageX, y:e.pageY},
				data    : cv.toDataURL('image/jpeg', 0)
			})
		}
	})
	Screen.on('touchend', e => {
		console.log('up', e)
		socket.emit('pointer', {type : 'up'})
	})
})
