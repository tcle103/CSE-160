// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'void main() {\n' +
    '  gl_Position = u_ModelMatrix * a_Position;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +  // uniform変数
    'void main() {\n' +
    '  gl_FragColor = u_FragColor;\n' +
    '}\n';

var shapesList = [];

function main() {

    let [canvas, gl] = setupWebGL();
    let [a_Position, u_FragColor, u_ModelMatrix] = connectVariablesToGLSL(gl);

    let c = new Cube([1.0, 0.0, 0.0, 1.0]);
    console.log(c);
    c.matrix.scale(0.2,0.2,0.2);
    console.log(c.matrix);
    c.render(gl, a_Position, u_FragColor, u_ModelMatrix);
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

    gl.enable(gl.DEPTH_TEST);

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('no u_ModelMatrix...');
        return;
    }

    return [a_Position, u_FragColor, u_ModelMatrix];
}

function renderAllShapes(gl, a_Position, u_FragColor, u_Size) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var len = shapesList.length;
    for (var i = 0; i < len; i++) {
        shapesList[i].render(gl, a_Position, u_FragColor, u_Size);
    }
}

function clear(gl, a_Position, u_FragColor, u_Size) {
    shapesList = [];
    renderAllShapes(gl, a_Position, u_FragColor, u_Size);
}
