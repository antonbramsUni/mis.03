
let radius = 3

export let scaleCanvas = (canvas, height) => {
	let cv    = document.createElement('canvas')
	let ct    = cv.getContext('2d')
	let ratio = height / canvas.height
	cv.height = height
	cv.width  = canvas.width * ratio
	ct.scale(ratio, ratio)
	ct.drawImage(canvas, 0, 0)
	return cv
}

export let scaleImage = (data, height, onload) => {
	let cv    = document.createElement('canvas')
	let ct    = cv.getContext('2d')
	var img   = new Image()
	cv.height = height
	img.onload = function () {
		cv.width = this.naturalWidth * (height / this.naturalHeight)
		ct.drawImage(this,
			0, 0, this.naturalWidth, this.naturalHeight, 
			0, 0, cv.width, cv.height)
		onload(cv)
	}
	img.src = data
}

export let getDescriptors = cv => {
	var data = cv
		.getContext('2d')
		.getImageData(0, 0, cv.width, cv.height)
	let blur    = tracking.Image.blur(data.data, cv.width, cv.height, radius)
	var gray    = tracking.Image.grayscale(blur, cv.width, cv.height)
	var corners = tracking.Fast.findCorners(gray, cv.width, cv.height)
	return {
		corners, 
		descriptors : tracking.Brief.getDescriptors(gray, cv.width, corners)
	}
}

export let getMatches = (a, b) => tracking.Brief
	.reciprocalMatch(
		a.corners, a.descriptors, 
		b.corners, b.descriptors)
	.sort((a, b) => b.confidence - a.confidence)

export let draw = (matches, ct, width) => {
	for (var i = 0; i < matches.length; i ++) {
		var color = '#' + Math.floor(Math.random()*16777215).toString(16)
		ct.fillStyle   = color
		ct.strokeStyle = color
		ct.fillRect(matches[i].keypoint1[0], matches[i].keypoint1[1], 4, 4)
		ct.fillRect(matches[i].keypoint2[0] + width, matches[i].keypoint2[1], 4, 4)
		ct.beginPath()
		ct.moveTo(matches[i].keypoint1[0], matches[i].keypoint1[1])
		ct.lineTo(matches[i].keypoint2[0] + width, matches[i].keypoint2[1])
		ct.stroke()
	}
}