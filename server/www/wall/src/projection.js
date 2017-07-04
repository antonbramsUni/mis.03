
import transform from 'perspective-transform'
import {vec} from 'fw'

export let calculate = (src, dst, srcPointer) => {
	var dstPointer = transform([
		src.lt.x, src.lt.y, src.rt.x, src.rt.y,
		src.rb.x, src.rb.y, src.lb.x, src.lb.y
	], [
		dst.lt.x, dst.lt.y, dst.rt.x, dst.rt.y,
		dst.rb.x, dst.rb.y, dst.lb.x, dst.lb.y
	]).transform(srcPointer.x, srcPointer.y)
	return new vec(dstPointer[0], dstPointer[1])
}

export let draw = (pointer, ct, width) => {
	ct.beginPath()
	ct.arc(pointer.x + width, pointer.y, 5, 0, 2 * Math.PI)
	ct.fillStyle = 'black'
	ct.fill()
}
