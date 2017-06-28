
import '../graphic/style.sass'
import io from 'socket.io-client'
import {Screen, vec, event} from 'fw'
import drag from './drag'
import test from './test'
// recognition and matching
import transform from 'perspective-transform'
import * as detection from './detection'
import * as Wall from './view'

// app communication
export let e = new event.Machine('App')

// server communication
export let socket = io()
socket.on('connect', () => console.log('[Sockets] connected...'))
// socket.on('stream.client', test)

// send view snapshot to the server
// e.on('update', data => socket.emit('stream.wall', data))

// pointer events
// socket.on('pointer', event => {
// 	console.log(event)
// 	if (drag[event.type])
// 	drag[event.type](event)
// })

// mouse drag test
Screen.on('mousedown', e => drag.down(new vec(e.clientX, e.clientY)))
Screen.on('mousemove', e => drag.move(new vec(e.clientX, e.clientY)))
Screen.on('mouseup', e => drag.up())

// var srcCorners = [
// 	40, 10,
// 	100, 10,
// 	200, 120,
// 	40, 100
// ]
// var dstCorners = [
// 	200, 10,
// 	400, 10,
// 	400, 100,
// 	230, 200
// ]
// 
// let cursor = new Layer({
// 	position : 'absolute',
// 	zIndex : 100,
// 	size : new vec().fill(10).px,
// 	border : {radius: '5px'},
// 	bg : {color : 'black'},
// })
// 
// Screen.on('mousemove', e => {
// 	var dstPt = transform(srcCorners, dstCorners)
// 		.transform(e.clientX, e.clientY)
// 	cursor.move = new vec(dstPt[0], dstPt[1]).px
// })
// 
// let layer = new Layer({
// 	position : 'absolute',
// 	size : new vec(100, 100).px,
// 	bg : {color : 'red'},
// 	project : [
// 		new vec(srcCorners[0], srcCorners[1]),
// 		new vec(srcCorners[6], srcCorners[7]),
// 		new vec(srcCorners[2], srcCorners[3]),
// 		new vec(srcCorners[4], srcCorners[5]),
// 	]
// })
// 
// let layer2 = new Layer({
// 	position : 'absolute',
// 	size : new vec(100, 100).px,
// 	bg : {color : 'green'},
// 	project : [
// 		new vec(dstCorners[0], dstCorners[1]),
// 		new vec(dstCorners[6], dstCorners[7]),
// 		new vec(dstCorners[2], dstCorners[3]),
// 		new vec(dstCorners[4], dstCorners[5]),
// 	]
// })

// wall canvas
// socket.on('stream.client', data => dataClient = data)
let cvDev   = document.querySelector('#dev')
let ctDev   = cvDev.getContext('2d')

socket.on('pointer', Client => {
	if (Client.type == 'move') {
		
		let height = 200
		
		detection.scaleImage(Client.data, height, cvClient => {
			let cvWall = detection.scaleCanvas(Wall.cv, height)
			// set size
			cvDev.width 	   = cvClient.width + cvWall.width
			cvDev.height 	   = height
			cvDev.style.width  = cvDev.width  + 'px'
			cvDev.style.height = cvDev.height + 'px'
			// draw dev
			ctDev.drawImage(cvClient, 0, 0)
			ctDev.drawImage(cvWall, cvClient.width, 0)
			// image recognition
			let desClient = detection.getDescriptors(cvClient)
			let desWall = detection.getDescriptors(cvWall)
			var matches = detection.getMatches(desClient, desWall)
			detection.draw(matches, ctDev, cvClient.width)
		})
	}
})


