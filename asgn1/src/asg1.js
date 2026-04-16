// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform float u_Size;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = u_Size;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +  // uniform変数
    'void main() {\n' +
    '  gl_FragColor = u_FragColor;\n' +
    '}\n';
/*
6. Have a single variable which contains the list of all shapes that 
need to be drawn. Have a class which contains the information for a 
Point.
*/
var shapesList = [];
class Point {
    constructor(pos, col, size) {
        this.pos = pos;
        this.col = col;
        this.size = size;
    }
    render(gl, a_Position, u_FragColor, u_Size) {
        var xy = this.pos;
        var rgba = this.col;
        var size = this.size;

        // Pass the position of a point to a_Position variable
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Pass size of point to u_Size
        gl.uniform1f(u_Size, size);
        // Draw
        gl.drawArrays(gl.POINTS, 0, 1);
    }
};
// 9. Have a button to draw triangles 
class Triangle extends Point {
    render(gl, a_Position, u_FragColor, u_Size) {
        var xy = this.pos;
        var rgba = this.col;
        var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Pass size of point to u_Size
        gl.uniform1f(u_Size, size);

        let d = this.size / 200.0;
        drawTriangle([xy[0], xy[1], xy[0] + d, xy[1], xy[0], xy[1] + d],
            gl, a_Position);
    }
}
// 10. Have a button to draw circles
class Circle extends Point {
    constructor(pos, col, size, seg) {
        super(pos, col, size);
        this.seg = seg;
    }
    render(gl, a_Position, u_FragColor, u_Size) {
        var xy = this.pos;
        var rgba = this.col;
        var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Pass size of point to u_Size
        gl.uniform1f(u_Size, size);


        let r = this.size / 400.0;
        drawCircle(xy, gl, a_Position, this.seg, r);
    }
}
let fancy = false;
let currShape = "Fish?";
let currPos = [0, 0];
let targetPos = [0, 0];
let dir = 1;

function main() {

    let [canvas, gl] = setupWebGL();
    let [a_Position, u_FragColor, u_Size] = connectVariablesToGLSL(gl);
    canvas.onmousedown = (ev) => {
        click(ev, gl, canvas, a_Position, u_FragColor, u_Size);
    }
    // 8. Draw a shape when the mouse is held down and there is mouse motion
    canvas.onmousemove = (ev) => {
        if (!fancy) {
            if (ev.buttons == 1) {
                click(ev, gl, canvas, a_Position, u_FragColor, u_Size);
            }
        } else {
            setTarget(ev, canvas);
        }

    }

    // 7. Have a button to clear the canvas
    let clearButt = document.getElementById("clear");
    clearButt.onmousedown = (_) => {
        clear(gl, a_Position, u_FragColor, u_Size);
    }

    let pButt = document.getElementById("p");
    pButt.onmousedown = (_) => {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        currShape = pButt.value;
        fancy = false;
    }
    let tButt = document.getElementById("t");
    tButt.onmousedown = (_) => {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        currShape = tButt.value;
        fancy = false;
    }
    let cButt = document.getElementById("c");
    cButt.onmousedown = (_) => {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        currShape = cButt.value;
        fancy = false;
    }
}

/*
3. Organize your code with specific functions for handling setupWebGL(), 
    connectVariablesToGLSL (), handleClicks(), and renderAllShapes(). 
*/
function setupWebGL() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');
    if (!canvas) {
        console.log('No canvas?!');
        return;
    }

    // Get the rendering context for WebGL
    var gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    return [canvas, gl];
}

function connectVariablesToGLSL(gl) {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Get the storage location of a_Position
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    // Get storage location of u_Size
    var u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('no u_Size...');
        return;
    }

    return [a_Position, u_FragColor, u_Size];
}

function renderAllShapes(gl, a_Position, u_FragColor, u_Size) {
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = shapesList.length;
    for (var i = 0; i < len; i++) {
        shapesList[i].render(gl, a_Position, u_FragColor, u_Size);
    }
}

function click(ev, gl, canvas, a_Position, u_FragColor, u_Size) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    // 4. Have HTML sliders for choosing the RGB color to paint
    let rslide = document.getElementById("r");
    let gslide = document.getElementById("g");
    let bslide = document.getElementById("b");

    // 5. Have an HTML slider for choosing the shape size 
    let sSlide = document.getElementById("s");

    /* 11. Have a slider to determine the number of segments 
        in the circle 
    */
    let segSlide = document.getElementById("seg");

    if (!fancy) {
        let p;
        switch (currShape) {
            case "Triangle":
                p = new Triangle([x, y], [rslide.value / 100,
                gslide.value / 100,
                bslide.value / 100,
                    1.0], sSlide.value);
                break;
            case "Circle":
                p = p = new Circle([x, y], [rslide.value / 100,
                gslide.value / 100,
                bslide.value / 100,
                    1.0], sSlide.value, segSlide.value);
                break;
            case "Fish?":
                function draw() {
                    fishTrack(gl, a_Position, u_FragColor, u_Size);
                    if (fancy) {
                        requestAnimationFrame(draw);
                    }
                }
                requestAnimationFrame(draw);
                fancy = true;
                break;
            default:
                p = new Point([x, y], [rslide.value / 100,
                gslide.value / 100,
                bslide.value / 100,
                    1.0], sSlide.value);
                break;
        }
        if (p) {
            shapesList.push(p);
            renderAllShapes(gl, a_Position, u_FragColor, u_Size);
        }
    }
}

function clear(gl, a_Position, u_FragColor, u_Size) {
    shapesList = [];
    renderAllShapes(gl, a_Position, u_FragColor, u_Size);
}

function drawTriangle(v, gl, a_Position) {
    var n = 3; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, n);

    gl.disableVertexAttribArray(a_Position);
}

function drawCircle(pos, gl, a_Position, seg, r) {
    let v = []
    let deg1;
    let deg2;
    for (let i = 1; i < seg + 1; i++) {
        deg1 = (360 * (i - 1) / seg) * (Math.PI / 180);
        deg2 = (360 * i / seg) * (Math.PI / 180);
        v = [pos[0], pos[1],
        r * Math.cos(deg1) + pos[0], r * Math.sin(deg1) + pos[1],
        r * Math.cos(deg2) + pos[0], r * Math.sin(deg2) + pos[1]];
        drawTriangle(v, gl, a_Position);
    }
}

function drawRect(corners, gl, a_Position) {
    drawTriangle(
        [corners[0], corners[3],
        corners[2], corners[1],
        corners[0], corners[1]],
        gl, a_Position);
    drawTriangle(
        [corners[0], corners[3],
        corners[2], corners[3],
        corners[2], corners[1]],
        gl, a_Position);
}

function drawFancy(gl, a_Position, u_FragColor, u_Size) {
    gl.clearColor(0.3, 0.4, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function drawFish(p, gl, a_Position, u_FragColor, u_Size) {
    // Pass size of point to u_Size
    gl.uniform1f(u_Size, 10.0);
    let s = 0.1;
    let d = dir * -1;

    // body
    gl.uniform4f(u_FragColor, 1.0, 0.4, 0.0, 1.0);

    drawRect([p[0] + s * d, p[1] + (2 * s), p[0] + (3 * s * d), p[1] - s], gl, a_Position);
    drawTriangle([p[0] + (3 * s * d), p[1] + s, p[0] + (4 * s * d), p[1] + s, p[0] + (3 * s * d), p[1] + (2 * s)],
        gl, a_Position);
    drawRect([p[0] + (3 * s * d), p[1] + s, p[0] + (4 * s * d), p[1]], gl, a_Position);
    drawTriangle([p[0] + (3 * s * d), p[1] - s, p[0] + (4 * s * d), p[1], p[0] + (3 * s * d), p[1]],
        gl, a_Position);

    // fins
    gl.uniform4f(u_FragColor, 1.0, 0.25, 0.0, 1.0);
    drawTriangle([p[0] + s * d, p[1] + (2 * s), p[0] + (3 * s * d), p[1] + (2 * s), p[0] + (3 * s * d), p[1] + (3 * s)],
        gl, a_Position);
    drawTriangle([p[0] + s * d, p[1] - s, p[0] + (3 * s * d), p[1] - (s * 3 / 2), p[0] + (3 * s * d), p[1] - s],
        gl, a_Position);
    drawTriangle([p[0] + (4 * s * d), p[1] + s, p[0] + (5 * s * d), p[1] + s, p[0] + (5 * s * d), p[1] + (2 * s)],
        gl, a_Position);
    drawRect([p[0] + (4 * s * d), p[1] + s, p[0] + (5 * s * d), p[1]], gl, a_Position);
    drawTriangle([p[0] + (4 * s * d), p[1], p[0] + (5 * s * d), p[1] - s, p[0] + (5 * s * d), p[1]],
        gl, a_Position);

    gl.uniform4f(u_FragColor, 1.0, 0.3, 0.0, 1.0);
    drawTriangle([p[0] + (s * 3 / 2 * d), p[1] + s, p[0] + (2 * s * d), p[1] + s, p[0] + (2 * s * d), p[1] + (s * 3 / 2)],
        gl, a_Position);
    drawRect([p[0] + (s * 3 / 2 * d), p[1] + s, p[0] + (2 * s * d), p[1]], gl, a_Position);
    drawTriangle([p[0] + (s * 3 / 2 * d), p[1], p[0] + (2 * s * d), p[1] - (s / 2), p[0] + (2 * s * d), p[1]],
        gl, a_Position);

    // head
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, 1.0, 0.25, 0.0, 1.0);

    drawTriangle([p[0], p[1], p[0] + s * d, p[1] - s, p[0] + s * d, p[1] + (2 * s)],
        gl, a_Position);
    drawTriangle([p[0] + s * d, p[1] + s, p[0] + (s * 3 / 2 * d), p[1] + s, p[0] + s * d, p[1] + (2 * s)],
        gl, a_Position);
    drawRect([p[0] + s * d, p[1] + s, p[0] + (s * 3 / 2 * d), p[1]], gl, a_Position);
    drawTriangle([p[0] + s * d, p[1], p[0] + s * d, p[1] - s, p[0] + (s * 3 / 2 * d), p[1]], gl, a_Position);

    gl.uniform4f(u_FragColor, 0.2, 0.0, 0.03, 1.0);
    drawCircle([p[0] + (s * 0.8 * d), p[1] + (s * 0.6)], gl, a_Position, 8, 0.015);
}

function setTarget(ev, canvas) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    targetPos = [x, y];
}

function fishTrack(gl, a_Position, u_FragColor, u_Size) {
    let x = targetPos[0];
    let y = targetPos[1];

    if (x < currPos[0]) {
        dir = -1;
    } else {
        dir = 1;
    }

    yp = y - currPos[1];
    xp = x - currPos[0];

    currPos[0] += Math.min(0.02 * xp, 0.3);
    currPos[1] += Math.min(0.02 * yp, 0.3);

    drawFancy(gl, a_Position, u_FragColor, u_Size);
    drawFish(currPos, gl, a_Position, u_FragColor, u_Size);
}