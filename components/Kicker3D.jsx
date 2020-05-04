import config from '../config';

const { extraLength, minHeight: minY, sides, } = config.model3d.sides;
const { thickness, } = config.model3d.surface;

const calculatePoints = (minX, minY, angle, radius) => {
  const angleRad = angle * Math.PI / 180;
  let currentAngleRad, x, y;

  const points = [];
  for (let i = 0; i <= sides; i++) {
    currentAngleRad = i / sides * angleRad;
    x = radius * Math.sin(currentAngleRad);
    y = radius * (1 - Math.cos(currentAngleRad));
    if (y < minY) {
      continue;
    }
    points.push([x, y]);
  }

  return points;
};

const calculateSidePoints = (angle, radius) => {
  const minX = Math.acos(1 - minY / radius);
  const points = calculatePoints(minX, minY, angle, radius);
  const lastPoint = points[points.length - 1];

  // Extend the sides a bit so we have room for a strut at the top
  points.push([lastPoint[0] + extraLength, lastPoint[1]]);
  points.push([lastPoint[0] + extraLength, 0]);

  points.unshift([points[0][0], 0]);
  return points;
};

const calculateSurfacePoints = (angle, radius) => {
  const points = calculatePoints(0, 0, angle, radius);
  const steps = points.length;
  const angleRad = angle * Math.PI / 180;

  for (let l = points.length - 1, i = l; i >= 0; i--) {
    const currentAngleRad = i / steps * angleRad;
    const x = points[i][0] - thickness * Math.sin(currentAngleRad);
    const y = points[i][1] + thickness * Math.cos(currentAngleRad);

    points.push([x, y]);
  }

  return points;
};

const Kicker3d = (angle, radius, width) => {
  const sidePoints = calculateSidePoints(angle, radius);
  const surfacePoints = calculateSurfacePoints(angle, radius);

  console.log({sidePoints, surfacePoints});
};

export default Kicker3d;