
import {vec, geo} from 'fw'
import rects from './model'
import {draw} from './view'

export default {
	dragged : -1,
	down (p) {
		for (var i = 0; i < rects.length; i ++) {
			let a = rects[i]
			if (geo.hitTest({l:a.x, t:a.y, w:a.w, h:a.h}, p)) {
				rects[i].z    = new Date().getTime()
				this.dragged  = i
				this.pointer  = p
				this.position = new vec(a.x, a.y)
				break
			}
		}
	},
	move (p) {
		if (this.dragged > -1) {
			let a = rects[this.dragged]
			let dif = this.position.add(p).sub(this.pointer)
			a.x = dif.x
			a.y = dif.y
			draw(p)
		}
	},
	shift (p) {
		this[this.dragged == -1? 'down': 'move'](p)
		if (this.dragged == -1) draw(p)
	},
	up (p) {
		this.dragged = -1
		draw()
	}
}
