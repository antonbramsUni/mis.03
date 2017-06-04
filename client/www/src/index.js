
import '../graphic/style.sass'
import io from 'socket.io-client'

document.addEventListener('deviceready', () => {
	console.log('[App]', 'hello world')
	// app setup
	StatusBar.hide()
	window.screen.orientation.lock('landscape-primary')
	// socket 141.54.58.61 192.168.1.4
	let socket = io('http://141.54.58.61:3000')
	socket.on('connect', () => {
		console.log(socket.id)
		socket.emit('hello', 'world')
	})
	// html elements
	let v = document.querySelector('.view')
	let p = document.querySelector('.preview')
	// start camera
	window.plugin.CanvasCamera.initialize(v, p)
	window.plugin.CanvasCamera.start({
	    cameraPosition:'back', fps:10, use:'data', thumbnailRatio:1/3,
	    canvas  : {width:667, height:375},
	    capture : {width:667, height:375},
	}, error => console.log('[CanvasCamera]', error), data => {
		if (socket.connected)
			socket.emit('stream', data.output.images.thumbnail.data)
	})
})
