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

function main() {

    let [canvas, gl] = setupWebGL();
    let [a_Position, u_FragColor, u_Size] = connectVariablesToGLSL(gl);
    canvas.onmousedown = (ev) => {
        click(ev, gl, canvas, a_Position, u_FragColor, u_Size);
    }

    // 7. Have a button to clear the canvas
    let clearButt = document.getElementById("clear");
    clearButt.onmousedown = (ev) => {
        clear(gl, a_Position, u_FragColor, u_Size);
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
    var gl = getWebGLContext(canvas);
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

    /*
    4. Have HTML sliders for choosing the RGB color to paint
    */
    let rslide = document.getElementById("r");
    let gslide = document.getElementById("g");
    let bslide = document.getElementById("b");

    /*
    5. Have an HTML slider for choosing the shape size 
    */
    let sSlide = document.getElementById("s");

    let p = new Point([x, y], [rslide.value / 100,
    gslide.value / 100,
    bslide.value / 100,
        1.0], sSlide.value);
    shapesList.push(p);

    renderAllShapes(gl, a_Position, u_FragColor, u_Size);
}

function clear(gl, a_Position, u_FragColor, u_Size) {
    shapesList = [];
    renderAllShapes(gl, a_Position, u_FragColor, u_Size);
}