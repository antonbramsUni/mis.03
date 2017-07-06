
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
socket.on('tracking', data => {
	if (data.event.length == 4 && data.pointer) {
		console.log(data)
		// sort corners
		let byX = data.event.sort((a, b) => a.x - b.x)
		let sortY = (a, b) => a.y - b.y
		let a = byX.slice(0,2).sort(sortY).concat(byX.slice(2,4).sort(sortY))
		let v = i => new vec(a[i].x + a[i].width/2, a[i].y + a[i].height/2)
		// create rect
		let r = {client: {lt:v(0), rt:v(2), lb:v(1), rb:v(3)}, wall : view.marks}
		// project
		let srcPointer = new vec(data.pointer.x, data.pointer.y)
		let dstPointer = projection.calculate(r.client, r.wall, srcPointer)
		drag.shift(dstPointer)
	}
	
	// let height  = 150
	// let cvWall  = detection.scaleCanvas(Wall.cv, height)
	// detection.scaleImage(Client.data, height, cvClient => {
	// 		tempClient   = Client
	// 		tempcvWall   = cvWall
	// 		tempcvClient = cvClient
	// 		debug.drawScreens(cvClient, cvWall, height)
	// 		tracking.track(cvClient, colors)
	// 	}
	// })
})

// video stream from client
socket.on('pointer', Client => {
	if (Client.event == 'move') {
	} else if (Client.event == 'up') setTimeout(() => drag.up(), 10)
})
