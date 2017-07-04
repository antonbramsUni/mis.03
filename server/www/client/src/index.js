
import '../graphic/style.sass'
import io from 'socket.io-client'
import {Screen} from 'fw'

export let getDescriptors = cv => {
	var data = cv
		.getContext('2d')
		.getImageData(0, 0, cv.width, cv.height)
	let blur    = tracking.Image.blur(data.data, cv.width, cv.height, 3)
	var gray    = tracking.Image.grayscale(blur, cv.width, cv.height)
	var corners = tracking.Fast.findCorners(gray, cv.width, cv.height)
	return {
		corners, 
		descriptors : tracking.Brief.getDescriptors(gray, cv.width, corners)
	}
}

export let scaleCanvas = (canvas, height) => {
	let cv    = document.createElement('canvas')
	let ct    = cv.getContext('2d')
	let ratio = height / canvas.height
	cv.height = height
	cv.width  = canvas.width * ratio
	ct.scale(ratio, ratio)
	ct.drawImage(canvas, 0, 0)
	return {cv, ratio}
}

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
	let redraw = true
	socket.on('redraw', () => {
		redraw = true
	})
	Screen.on('touchstart', e => {
		console.log('down', e)
		socket.emit('pointer', {event : 'down'})
	})
	Screen.on('touchmove', e => {
		console.log('move', e)
		// if (new Date() - last > rate) {
		// 	last = new Date()
		if (redraw) {
			redraw = false
			let canvas = scaleCanvas(cv, 100)
			socket.emit('pointer', {
				event   : 'move',
				pointer : {x:e.pageX, y:e.pageY},
				data    : canvas.cv.toDataURL('image/jpeg', 1),
				ratio   : canvas.ratio * 2
				// data  : getDescriptors(canvas),
				// size  : {width: canvas.width, height: canvas.height}
			})
		}
		console.log(redraw)
	})
	Screen.on('touchend', e => {
		console.log('up', e)
		socket.emit('pointer', {event : 'up'})
		redraw = true
	})
})
