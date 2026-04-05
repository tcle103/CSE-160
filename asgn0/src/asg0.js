// Based on DrawTriangle.js (c) 2012 matsuda

const origin = {x: 200, y: 200};
const v1 = new Vector3([0, 0, 0]);
const v2 = new Vector3([0, 0, 0]);

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
  4. (2 points) Add to your webpage an interface for the user to specify and draw a 
  second vector v2.
  */
  const v2x = document.getElementById("v2x");
  const v2y = document.getElementById("v2y");
  drawB.addEventListener("click", (_) => handleDrawEvent(ctx, v1x ,v1y, v2x, v2y));

  /*
  5. (2 points) Add to your webpage an interface for the user to perform and visualize
   the results of add, sub, div and mul operations. 
  */
  const opSelect = document.getElementById("op");
  const scalar = document.getElementById("scalar");
  const opB = document.getElementById("btn1");
  let currOp = opSelect.value;
  let currValue = 0;
  // some nice little flavor code (juice!) to get disable scalar box dynamically
  opSelect.addEventListener("click", (_) => {
    currOp = opSelect.value;
    if (currOp == "mult" || currOp == "div") {
      scalar.disabled = false;
      scalar.value = currValue;
    } else {
      scalar.disabled = true;
      scalar.value = "";
    }
  })
  scalar.addEventListener("change", (_) => {
    currValue = scalar.value;
  });
  opB.addEventListener("click", (_) => handleDrawOperationEvent(ctx, v1x ,v1y, v2x, v2y, currOp, scalar.value));
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
  // read + draw v2
  v2.elements[0] = v2x.value;
  v2.elements[1] = v2y.value;
  drawVector(v2, "blue", ctx);
}

function handleDrawOperationEvent(ctx, v1x, v1y, v2x, v2y, op, s) {
  // read and draw v1 and v2
  handleDrawEvent(ctx, v1x, v1y, v2x, v2y);
  let v3 = new Vector3([v1.elements[0], v1.elements[1], v1.elements[2]]);
  let v4 = new Vector3([v2.elements[0], v2.elements[1], v2.elements[2]]);
  switch (op){
    case "add":
      // add, draw v3 = v1 + v2
      v3.add(v2);
      drawVector(v3, "green", ctx);
      break;
    case "sub":
      // sub, draw v3 = v1 - v2
      v3.sub(v2);
      drawVector(v3, "green", ctx);
      break;
    case "mult":
      // mult, draw v3 = v1 * s and v4 = v2 * s
      v3.mul(s);
      v4.mul(s);
      drawVector(v3, "green", ctx);
      drawVector(v4, "green", ctx);
      break;
    case "div":
      // div, draw v3 = v1 / s and v4 = v2 / s
      v3.div(s);
      v4.div(s);
      drawVector(v3, "green", ctx);
      drawVector(v4, "green", ctx);
      break;
    case "mag":
      // magnitude, print to console magnitude
      // of v1 and v2
      console.log("Magnitude v1: "+v3.magnitude().toString());
      console.log("Magnitude v2: "+v4.magnitude().toString());
      break;
    case "norm":
      // normalize, draw normalized v1 and v2
      v3.normalize();
      v4.normalize();
      drawVector(v3, "green", ctx);
      drawVector(v4, "green", ctx);
    default:
      console.log("uh oh! operation fell through");
  }
}