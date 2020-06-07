/**
 * Returns a tuple of the x,y coordinate values for a triangle given a set of three
 * coordinate objects, eg [{x1:n, y1:n},{x2:n, y2:n},{x3:n, y3:n}]
 */
const centroid = (coords) => {
	const centerX = (coords[0].x + coords[1].x + coords[2].x) / 3;
	const centerY = (coords[0].y + coords[1].y + coords[2].y) / 3;
	return [Math.round(centerX), Math.round(centerY)];
}

export default centroid;