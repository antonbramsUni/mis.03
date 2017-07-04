
let cv = document.querySelector('#dev')
let ct = cv.getContext('2d')

export let drawScreens = (client, wall, height) => {
	// set size
	cv.width 	   = client.width + wall.cv.width
	cv.height 	   = height
	cv.style.width  = cv.width  + 'px'
	cv.style.height = cv.height + 'px'
	// draw dev
	ct.drawImage(client, 0, 0)
	ct.drawImage(wall.cv, client.width, 0)
}

export let drawMatches = (matches, width) => {
	for (var i = 0; i < matches.length; i ++) {
		var color = '#' + Math.floor(Math.random()*16777215).toString(16)
		ct.fillStyle   = color
		ct.strokeStyle = color
		ct.beginPath()
		ct.arc(matches[i].keypoint1[0], matches[i].keypoint1[1], 2, 0, 2 * Math.PI)
		ct.arc(matches[i].keypoint2[0] + width, matches[i].keypoint2[1], 2, 0, 2 * Math.PI)
		ct.fillStyle = color
		ct.fill()
		ct.beginPath()
		ct.moveTo(matches[i].keypoint1[0], matches[i].keypoint1[1])
		ct.lineTo(matches[i].keypoint2[0] + width, matches[i].keypoint2[1])
		ct.stroke()
	}
}

export let drawCursor = (src, dst, width) => {
	ct.beginPath()
	ct.fillStyle = 'black'
	ct.arc(src.x, src.y, 5, 0, 2 * Math.PI)
	ct.fill()
	ct.beginPath()
	ct.fillStyle = 'black'
	ct.arc(dst.x + width, dst.y, 5, 0, 2 * Math.PI)
	ct.fill()
}
