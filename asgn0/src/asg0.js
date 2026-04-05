// Based on DrawTriangle.js (c) 2012 matsuda

const origin = {x: 200, y: 200}
const v1 = new Vector3([2.25, 2.25, 0])

function main() {  
  // Retrieve <canvas> element
  var canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  var ctx = canvas.getContext('2d');

  // // Draw a blue rectangle
  // ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // Set color to blue
  // ctx.fillRect(120, 10, 150, 150);        // Fill a rectangle with the color

  // Draw black canvas instead
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillRect(0, 0, 400, 400);

  // Draw vector
  drawVector(v1, "red", ctx)
}

function drawVector(v, color, ctx) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo((origin.x + v.elements[0] * 20), (origin.y - v.elements[1] * 20));
  ctx.stroke();
}
