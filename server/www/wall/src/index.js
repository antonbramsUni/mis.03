
import '../graphic/style.sass'
import io from 'socket.io-client'
import {Screen, vec} from 'fw'
import drag from './drag'
import * as detection from './detection'
import * as Wall from './view'
import * as quadrant from './quadrant'
import * as projection from './projection'
import * as debug from './debug'

export let socket = io()
socket.on('connect', () => console.log('[Sockets] connected...'))

Screen.on('mousedown', e => drag.down(new vec(e.clientX, e.clientY)))
Screen.on('mousemove', e => drag.move(new vec(e.clientX, e.clientY)))
Screen.on('mouseup', e => drag.up())

socket.on('pointer', Client => {
	if (Client.event == 'move') {
		Client.pointer = new vec(Client.pointer.x, Client.pointer.y)
		let height  = 100
		let cvWall  = detection.scaleCanvas(Wall.cv, height)
		detection.scaleImage(Client.data, height, cvClient => {
			// image recognition
			let desClient = detection.getDescriptors(cvClient)
			let desWall = detection.getDescriptors(cvWall.cv)
			let matches = detection.getMatches(desClient, desWall)
			// find rectangles
			let r = quadrant.find(matches)
			let srcPointer = Client.pointer.scale(Client.ratio)
			let dstPointer = projection.calculate(r.client, r.wall, srcPointer)
			drag.shift(dstPointer.scale(1 / cvWall.ratio))
			setTimeout(() => socket.emit('redraw', {}), 100)
			// debug
			debug.drawScreens(cvClient, cvWall, height)
			debug.drawMatches(matches, cvClient.width)
			debug.drawCursor(srcPointer, dstPointer, cvClient.width)
		})
		if (Client.event == 'up') drag.up()
	}
})
