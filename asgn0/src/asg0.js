// Based on DrawTriangle.js (c) 2012 matsuda

const origin = {x: 200, y: 200};
const v1 = new Vector3([0, 0, 0]);

function main() {  
  // Retrieve <canvas> element
  var canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  var ctx = canvas.getContext('2d');

  /*
  2. (1 point) Draw a red vector v1 on a black canvas instead of the blue rectangle.
  The origin of the vector should be the center of the canvas. 
  */

  // Draw black canvas
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillRect(0, 0, 400, 400);

  // // Draw red vector v1
  // v1.elements[0] = 2.25;
  // v1.elements[1] = 2.25;
  // drawVector(v1, "red", ctx)

  /*
  3. (1 point)  Add to your webpage an interface for the user to specify and draw 
  the v1 vector.
  */
  const drawB = document.getElementById("btn");
  const v1x = document.getElementById("v1x");
  const v1y = document.getElementById("v1y");
  /*
  4. (2 points) Add to your webpage an interface for the user to specify and draw a second vector v2.
  */
  const v2x = document.getElementById("v2x");
  const v2y = document.getElementById("v2y");
  drawB.addEventListener("click", (_) => handleDrawEvent(ctx, v1x ,v1y, v2x, v2y));

}

function drawVector(v, color, ctx) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo((origin.x + v.elements[0] * 20), (origin.y - v.elements[1] * 20));
  ctx.stroke();
}

function handleDrawEvent(ctx, v1x, v1y, v2x, v2y) {
  // clear the canvas
  ctx.clearRect(0, 0, 400, 400);
  // Draw black canvas
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillRect(0, 0, 400, 400);
  // read + draw v1
  v1.elements[0] = v1x.value;
  v1.elements[1] = v1y.value;
  drawVector(v1, "red", ctx);
  // create + draw v2
  const v2 = new Vector3([0, 0, 0]);
  v2.elements[0] = v2x.value;
  v2.elements[1] = v2y.value;
  drawVector(v2, "blue", ctx);
}