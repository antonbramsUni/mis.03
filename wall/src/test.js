
export default data => {
	var cv  = document.querySelector('canvas')
	var ct  = cv.getContext('2d')
	var img = new Image()
	img.onload = () => ct.drawImage(img, 0, 0, cv.width, cv.height)
	img.src = data
}
