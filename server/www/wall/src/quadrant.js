
import {vec, geo} from 'fw'

let findMinMax = matches => {
	// split
	let min = new vec(), max = new vec()
	matches.forEach(match => {
		let mClient = match.keypoint1
		if (min.x == 0 || min.x > mClient[0]) min.x = mClient[0]
		if (min.y == 0 || min.y > mClient[1]) min.y = mClient[1]
		if (max.x == 0 || max.x < mClient[0]) max.x = mClient[0]
		if (max.y == 0 || max.y < mClient[1]) max.y = mClient[1]
	})
	return {min, max}
}

let sortMatches = (matches, min, max) => {
	let quadClient = {
		lt: new vec(), rt: new vec(), 
		lb: new vec(), rb: new vec()}
	let quadWall = {
		lt: new vec(), rt: new vec(), 
		lb: new vec(), rb: new vec()}
	// get center quadrant
	let w = (max.x - min.x) / 2
	let h = (max.y - min.y) / 2
	let center = new vec(w + min.x, h + min.y)
	matches.forEach(match => {
		let mClient = new vec(match.keypoint1[0], match.keypoint1[1])
		let mWall   = new vec(match.keypoint2[0], match.keypoint2[1])
		// find corners
		;[
			{quad : 'lt', l: min.x,    t: min.y, 	w, h},
			{quad : 'rt', l: center.x, t: min.y, 	w, h},
			{quad : 'lb', l: min.x,    t: center.y, w, h},
			{quad : 'rb', l: center.x, t: center.y,	w, h}
		].forEach(q => {
			if (geo.hitTest(q, mClient)){
				quadClient[q.quad].add(mClient, 1)
				quadClient[q.quad].z ++
				quadWall[q.quad].add(mWall, 1)
				quadWall[q.quad].z ++
			}
		})
	})
	return {client: quadClient, wall: quadWall}
}

let findMeanVector = (client, wall) => {
	;['lt', 'rt', 'lb', 'rb'].forEach(q => {
		client[q].div(new vec(client[q].z, client[q].z), 1)
		wall[q].div(new vec(wall[q].z, wall[q].z), 1)
	})
	return {client, wall}
}

export let find = matches => {
	let {min, max} = findMinMax(matches)
	let {client, wall} = sortMatches(matches, min, max)
	return findMeanVector(client, wall)
}
