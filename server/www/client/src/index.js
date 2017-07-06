
import '../graphic/style.sass'
import io from 'socket.io-client'
import {Screen} from 'fw'

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
	    cameraPosition:'back', fps:25, use:'data',
	    canvas  : {width:667, height:375},
	    capture : {width:667, height:375},
		quality : 1,
	}, error => console.log('[CanvasCamera]', error))
	
	// recognition loop
	let pointer, render
	let tol = 130
	
	// custom color
	tracking.ColorTracker.registerColor('pink', 
		(r, g, b) => r > 255-tol && g < tol && b > 255-tol)
	let colors = new tracking.ColorTracker(['pink'])
	colors.setMinDimension(5)
	
	// loop
	let next = () => {
		render = scaleCanvas(cv, 150)
		tracking.track(render.cv, colors)
	}
	// on track
	colors.on('track', event => {
		cv.style.opacity = event.data.length == 4? 1:.3
		let scale = value => value * .5/render.ratio
		event.data.forEach(t => {
			t.x      = scale(t.x)
			t.y      = scale(t.y)
			t.width  = scale(t.width)
			t.height = scale(t.height)
		})
		socket.emit('tracking', {pointer, event : event.data
			// stream : render.cv.toDataURL('image/jpeg', 1),
		})
		setTimeout(next, 80)
	})
	next()
	// mouse drag
	Screen.on('touchstart', e => {
		console.log('down', e)
		socket.emit('pointer', {event : 'down'})
	})
	Screen.on('touchmove', e => {
		console.log('move', e)
		pointer = {x:e.pageX, y:e.pageY}
	})
	Screen.on('touchend', e => {
		console.log('up', e)
		socket.emit('pointer', {event : 'up'})
		pointer = null
	})
})
