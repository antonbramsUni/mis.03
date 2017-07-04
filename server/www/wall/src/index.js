
import '../graphic/style.sass'
import io from 'socket.io-client'
import {Screen, vec} from 'fw'
import drag from './drag'
import * as detection from './detection'
import * as Wall from './view'
import * as quadrant from './quadrant'
import * as projection from './projection'
import * as debug from './debug'
import * as view from './view'

// server communication
export let socket = io()
socket.on('connect', () => console.log('[Sockets] connected...'))

// mouse debugging
Screen.on('mousedown', e => drag.down(new vec(e.clientX, e.clientY)))
Screen.on('mousemove', e => drag.move(new vec(e.clientX, e.clientY)))
Screen.on('mouseup', e => drag.up())

// color tracker
let tempClient, tempcvWall, tempcvClient;
let t = 130

tracking.ColorTracker.registerColor('green', 
	(r, g, b) => r > 255-t && g < t && b > 255-t)
let colors = new tracking.ColorTracker(['green'])
colors.setMinDimension(5)

colors.on('track', event => {
	console.log(event.data)
	debug.drawColors(event.data)
	if (event.data.length == 4) {
		let byX = event.data.sort((a, b) => a.x - b.x)
		let sortY = (a, b) => a.y - b.y
		let one = byX.slice(0,2).sort(sortY)
		let two = byX.slice(2,4).sort(sortY)
		let a = one.concat(two)
		console.log('a', a)
		let v = i => new vec(a[i].x + a[i].width/2, a[i].y + a[i].height/2)
		let r = {client: {lt:v(0), rt:v(2), lb:v(1), rb:v(3)}, wall : {}}
		for (let i in view.marks)
			r.wall[i] = view.marks[i].scale(tempcvWall.ratio)
		console.log(r)
		let srcPointer = new vec(tempClient.pointer.x, tempClient.pointer.y).scale(tempClient.ratio)
		let dstPointer = projection.calculate(r.client, r.wall, srcPointer)
		drag.shift(dstPointer.scale(1 / tempcvWall.ratio))
		debug.drawCursor(srcPointer, dstPointer, tempcvClient.width)
	}
	setTimeout(() => socket.emit('redraw', {}), 10)
})

// video stream from client
socket.on('pointer', Client => {
	if (Client.event == 'move') {
		let height  = 150
		let cvWall  = detection.scaleCanvas(Wall.cv, height)
		detection.scaleImage(Client.data, height, cvClient => {
			// descriptors
			if (0) {
				// image recognition
				let desClient = detection.getDescriptors(cvClient)
				let desWall = detection.getDescriptors(cvWall.cv)
				let matches = detection.getMatches(desClient, desWall)
				let r = quadrant.find(matches)
				// find rectangles
				let srcPointer = new vec(Client.pointer.x, Client.pointer.y).scale(Client.ratio)
				let dstPointer = projection.calculate(r.client, r.wall, srcPointer)
				drag.shift(dstPointer.scale(1 / cvWall.ratio))
				setTimeout(() => socket.emit('redraw', {}), 10)
				// debug
				debug.drawScreens(cvClient, cvWall, height)
				debug.drawMatches(matches, cvClient.width)
				debug.drawCursor(srcPointer, dstPointer, cvClient.width)
			// Color
			} else {
				tempClient   = Client
				tempcvWall   = cvWall
				tempcvClient = cvClient
				debug.drawScreens(cvClient, cvWall, height)
				tracking.track(cvClient, colors)
			}
		})
	} else if (Client.event == 'up') setTimeout(() => drag.up(), 10)
})
