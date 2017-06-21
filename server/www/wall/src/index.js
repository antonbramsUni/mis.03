
import '../graphic/style.sass'
import io from 'socket.io-client'
import {Screen, vec, event} from 'fw'
import drag from './drag'
import test from './test'
import transform from 'perspective-transform'

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


