// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = 10.0;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +  // uniform変数
    'void main() {\n' +
    '  gl_FragColor = u_FragColor;\n' +
    '}\n';
var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point

function main() {

    let [canvas, gl] = setupWebGL();
    let [a_Position, u_FragColor] = connectVariablesToGLSL(gl);
    canvas.onmousedown = (ev) => {
        click(ev, gl, canvas, a_Position, u_FragColor);
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

    return [a_Position, u_FragColor];
}

function renderAllShapes(gl, a_Position, u_FragColor) {
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    for (var i = 0; i < len; i++) {
        var xy = g_points[i];
        var rgba = g_colors[i];

        // Pass the position of a point to a_Position variable
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Draw
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

function click(ev, gl, canvas, a_Position, u_FragColor) {
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

    // Store the coordinates to g_points array
    g_points.push([x, y]);
    // Store color from sliders
    g_colors.push([rslide.value / 100, 
        gslide.value / 100,
        bslide.value / 100,
        1.0])

    renderAllShapes(gl, a_Position, u_FragColor);
}