// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'uniform mat4 u_GlobalRotationMatrix;\n'+
    'void main() {\n' +
    '  gl_Position = u_GlobalRotationMatrix * u_ModelMatrix * a_Position;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +  // uniform変数
    'void main() {\n' +
    '  gl_FragColor = u_FragColor;\n' +
    '}\n';

var shapesList = [];
let rot = new Matrix4();
let xheadRot = 0;
let yheadRot = 0;
let xs1Rot = 20;
let xs2Rot = 30;
let xs3Rot = 30;
let xlRot = 15;

function main() {

    let [canvas, gl] = setupWebGL();
    let [a_Position, u_FragColor, u_ModelMatrix, u_GlobalRotationMatrix] = connectVariablesToGLSL(gl);

    gl.uniformMatrix4fv(u_GlobalRotationMatrix, false, rot.elements);

    setHandlers(gl, a_Position, u_FragColor, u_ModelMatrix, u_GlobalRotationMatrix);

    renderScene(gl, a_Position, u_FragColor, u_ModelMatrix);
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

    var u_GlobalRotationMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotationMatrix');
    if (!u_GlobalRotationMatrix) {
        console.log('no u_GlobalRotationMatrix...');
        return;
    }

    return [a_Position, u_FragColor, u_ModelMatrix, u_GlobalRotationMatrix];
}

/*
    4. Have a function renderScene() which is going to draw your whole scene.
*/
function renderScene(gl, a_Position, u_FragColor, u_ModelMatrix) {
    let start = performance.now();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    shapesList = [];
    drawPik();

    var len = shapesList.length;
    for (var i = 0; i < len; i++) {
        shapesList[i].render(gl, a_Position, u_FragColor, u_ModelMatrix);
    }

    updatePerf(performance.now()-start);
}

function clear(gl, a_Position, u_FragColor, u_Size) {
    shapesList = [];
    renderScene(gl, a_Position, u_FragColor, u_Size);
}

function setHandlers(gl, a_Position, u_FragColor, u_ModelMatrix, u_GlobalRotationMatrix){
    /*
        3. Have a slider that sets a global variable for the rotation angle gAnimalGlobalRotation
    */
    let camSlide = document.getElementById("cam");
    camSlide.value = 0;
    camSlide.addEventListener("input", ()=> {
        rot = new Matrix4();
        rot.rotate(camSlide.value, 0, 1, 0);
        gl.uniformMatrix4fv(u_GlobalRotationMatrix, false, rot.elements);
        renderScene(gl, a_Position, u_FragColor, u_ModelMatrix);
    })

    let headx = document.getElementById("headx");
    headx.value = 0;
    headx.addEventListener("input", ()=>{
        xheadRot = headx.value;
        renderScene(gl, a_Position, u_FragColor, u_ModelMatrix);
    })

    let heady = document.getElementById("heady");
    heady.value = 0;
    heady.addEventListener("input", ()=>{
        yheadRot = heady.value;
        renderScene(gl, a_Position, u_FragColor, u_ModelMatrix);
    })

    let s1x = document.getElementById("s1x");
    s1x.value = 20;
    s1x.addEventListener("input", ()=>{
        xs1Rot = s1x.value;
        renderScene(gl, a_Position, u_FragColor, u_ModelMatrix);
    })

    let s2x = document.getElementById("s2x");
    s2x.value = 30;
    s2x.addEventListener("input", ()=>{
        xs2Rot = s2x.value;
        renderScene(gl, a_Position, u_FragColor, u_ModelMatrix);
    })

    let s3x = document.getElementById("s3x");
    s3x.value = 30;
    s3x.addEventListener("input", ()=>{
        xs3Rot = s3x.value;
        renderScene(gl, a_Position, u_FragColor, u_ModelMatrix);
    })

    let lx = document.getElementById("lx");
    lx.value = 30;
    lx.addEventListener("input", ()=>{
        xlRot = lx.value;
        renderScene(gl, a_Position, u_FragColor, u_ModelMatrix);
    })
}

function updatePerf(n) {
    document.getElementById("perf").innerText = "ms: "+Math.floor(n)+" fps: "+Math.floor(10000/n);
}

function drawPik() {
    let yellow = [1.0, 0.8, 0.3, 1.0];
    let red = [1.0,0,0,1];
    let white = [1.0,1.0,1.0,1.0];
    let black = [0.2,0.0,0.0,1.0];
    let green = [0.6,0.8,0.5,1.0];

    let m = new Matrix4();
    m.rotate(10,0,0,1);
    //m.scale(0.2, 0.2, 0.2);
    
    // head
    let head1 = new Matrix4();    
    //head1.translate(0,0.08,0);
    head1.rotate(xheadRot,1,0,0);
    head1.rotate(yheadRot,0,1,0);
    head1.translate(-0.1,0.052,-0.18/2);
    head1.scale(0.2,0.16,0.18);
    //head1.translate((-0.5+(-0.1*(yheadRot*xheadRot)/400)), -0.5, (-0.5+(0.1*xheadRot/8)));
    let h1 = new Cube(yellow);
    h1.setMatrix(head1);
    shapesList.push(h1);

    let head3 = new Matrix4;
    head3.rotate(xheadRot,1,0,0);
    head3.rotate(yheadRot,0,1,0);
    head3.translate(-0.078, 0, -0.136/2);
    head3.scale(0.78*0.2, 1.2*0.2, 0.68*0.2);
    //head3.translate((-0.5+(-0.1*(yheadRot*xheadRot)/400)),-0.55,(-0.5+(0.1*xheadRot/6)));
    let h3 = new Cube(yellow);
    h3.setMatrix(head3);
    shapesList.push(h3);

    let earR = new Matrix4;
    earR.rotate(xheadRot,1,0,0);
    earR.rotate(yheadRot,0,1,0);
    earR.translate(0.05,0.06,-0.0);
    earR.scale(0.13,0.13,0.03);
    let eaR = new Cube(yellow);
    eaR.setMatrix(earR);
    shapesList.push(eaR);

    let earL = new Matrix4;
    earL.rotate(xheadRot,1,0,0);
    earL.rotate(yheadRot,0,1,0);
    earL.translate(-0.18,0.06,-0.0);
    earL.scale(0.13,0.13,0.03);
    let eaL = new Cube(yellow);
    eaL.setMatrix(earL);
    shapesList.push(eaL);

    // eyes
    let eyeR = new Matrix4;
    eyeR.rotate(xheadRot, 1, 0,0);
    eyeR.rotate(yheadRot, 0,1,0);
    eyeR.translate(0.033,0.092, -0.11);
    eyeR.scale(0.1,0.08,0.03);
    //eyeR.translate((0.4+(-0.1*(yheadRot*xheadRot)/200)),-0.5,(-3.5+(0.1*xheadRot/1.4)));
    let eR = new Cube(white);
    eR.setMatrix(eyeR);
    shapesList.push(eR);

    let eyeL = new Matrix4;
    eyeL.rotate(xheadRot, 1, 0,0);
    eyeL.rotate(yheadRot, 0,1,0);
    eyeL.translate(-0.133,0.092, -0.11);
    eyeL.scale(0.1,0.08,0.03);
    //eyeL.translate((-1.4+(-0.1*(yheadRot*xheadRot)/200)),-0.5,(-3.5+(0.1*xheadRot/1.4)));
    let eL = new Cube(white);
    eL.setMatrix(eyeL);
    shapesList.push(eL);

    let pupilR = new Matrix4;
    pupilR.rotate(xheadRot, 1, 0,0);
    pupilR.rotate(yheadRot, 0,1,0);
    pupilR.translate(0.058, 0.1045, -0.12);
    pupilR.scale(0.05,0.05,0.03);
    //pupilR.translate((1.25+(-0.1*(yheadRot*xheadRot)/100)),-0.5,(-3.8+(0.1*xheadRot/1.4)));
    let pR = new Cube(black);
    pR.setMatrix(pupilR);
    shapesList.push(pR);

    let pupilL = new Matrix4;
    pupilL.rotate(xheadRot, 1, 0,0);
    pupilL.rotate(yheadRot, 0,1,0);
    pupilL.translate(-0.108, 0.1045, -0.12);
    pupilL.scale(0.05,0.05,0.03);
    //pupilL.translate((-2.25+(-0.1*(yheadRot*xheadRot)/100)),-0.5,(-3.8+(0.1*xheadRot/1.4)));
    let pL = new Cube(black);
    pL.setMatrix(pupilL);
    shapesList.push(pL);

    // stalk
    let stalk1 = new Matrix4;
    stalk1.rotate(xheadRot,1,0,0);
    stalk1.rotate(yheadRot,0,1,0);
    stalk1.translate(-0.035, 0.24, -0.035);
    stalk1.rotate(xs1Rot,1,0,0);
    stalk1.scale(0.07,0.15,0.07);
    //stalk1.translate(-0.5+(-0.1*(yheadRot*xheadRot)/120),(0.3+(0.1*xheadRot/16)),(-1.0+(0.1*xheadRot/3)));
    let s1 = new Cube(lerp(yellow, green, 0.1));
    s1.setMatrix(stalk1);
    shapesList.push(s1);

    let stalk2 = new Matrix4;
    stalk2.rotate(xheadRot,1,0,0);
    stalk2.rotate(yheadRot,0,1,0);
    stalk2.translate(-0.035, 0.24, -0.035);
    stalk2.rotate(xs1Rot, 1, 0, 0);
    stalk2.translate(0.01,0.13,0.01);
    stalk2.rotate(xs2Rot,1,0,0);
    stalk2.scale(0.05,0.15,0.05);
    //stalk2.translate(-0.5+(-0.1*(yheadRot*xheadRot)/90),(1.1+(0.1*xheadRot/8.5)),(-2.5+(0.1*xheadRot/2.8)));
    let s2 = new Cube(lerp(yellow, green, 0.4));
    s2.setMatrix(stalk2);
    shapesList.push(s2);

    let stalk3 = new Matrix4;
    stalk3.rotate(xheadRot,1,0,0);
    stalk3.rotate(yheadRot,0,1,0);
    stalk3.translate(-0.035, 0.24, -0.035);
    stalk3.rotate(xs1Rot, 1, 0, 0);
    stalk3.translate(0.01,0.13,0.01);
    stalk3.rotate(xs2Rot,1,0,0);
    //stalk3.translate(-0.02, 0.47,0.14);
    stalk3.translate(0.005,0.15,0.005);
    stalk3.rotate(xs3Rot, 1, 0, 0);
    stalk3.scale(0.04,0.09,0.04);
   // stalk3.translate(-0.5+(-0.1*(yheadRot*xheadRot)/65),(1.8+(0.1*xheadRot/3.5)),(-7.5+(0.1*xheadRot/15)));
    let s3 = new Cube(lerp(yellow, green, 0.8));
    s3.setMatrix(stalk3);
    shapesList.push(s3);

    let leaf = new Matrix4;
    leaf.rotate(xheadRot,1,0,0);
    leaf.rotate(yheadRot,0,1,0);
    leaf.translate(-0.0, 0.24, -0.035);
    leaf.rotate(xs1Rot, 1, 0, 0);
    leaf.translate(0.0,0.13,0.01);
    leaf.rotate(xs2Rot,1,0,0);
    leaf.translate(0.0,0.15,0.005);
    leaf.rotate(xs3Rot, 1, 0, 0);
    leaf.translate(-0.075,0.075,0);
    leaf.rotate(xlRot, 1,0,0);
    leaf.scale(0.15,0.15,0.04);
    let l = new Cube(green);
    l.setMatrix(leaf);
    shapesList.push(l);

    // body
    let body1 = new Matrix4;
    body1.translate(-0.055,-0.18,-0.055);
    body1.scale(0.55*0.2,1.1*0.2,0.55*0.2);
    let b1 = new Cube(yellow);
    b1.setMatrix(body1);
    shapesList.push(b1);

    let body2 = new Matrix4;
    body2.translate(-0.065,-0.18,-0.06);
    body2.scale(0.65*0.2,0.6*0.2,0.6*0.2);
    let b2 = new Cube(yellow);
    b2.setMatrix(body2);
    shapesList.push(b2);

    // arms
    let armR = new Matrix4;
    armR.translate(0.055,-0.05,-0.02);
    armR.scale(0.12,0.04,0.04);
    let aR = new Cube(yellow);
    aR.setMatrix(armR);
    shapesList.push(aR);

    let armL = new Matrix4;
    armL.translate(-0.175,-0.05,-0.02);
    armL.scale(0.12,0.04,0.04);
    let aL = new Cube(yellow);
    aL.setMatrix(armL);
    shapesList.push(aL);

    // leg
    let legR = new Matrix4;
    legR.translate(0.015,-0.26,-0.02);
    legR.scale(0.04,0.08,0.04);
    let lR = new Cube(yellow);
    lR.setMatrix(legR);
    shapesList.push(lR);

    let legL = new Matrix4;
    legL.translate(-0.055,-0.26,-0.02);
    legL.scale(0.04,0.08,0.04);
    let lL = new Cube(yellow);
    lL.setMatrix(legL);
    shapesList.push(lL);
}

function lerp(s, e, step) {
    let start = s;
    let end = e;

    let col = [];

    for (let i = 0; i < start.length; ++i) {
        col.push(
            (start[i]*(1-step))+(end[i]*step)
        );
    }

    return col;
}