class Cube {
    constructor(col) {
        this.col = col;
        
        this.matrix = new Matrix4();
    }
    render(gl, a_Position, u_FragColor, u_ModelMatrix) {
        var rgba = this.col;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // front face (red)
        drawRect3D([0.0, 1.0, 0.0,  1.0, 0.0, 0.0], gl, a_Position);
        gl.uniform4f(u_FragColor, 0, 1.0, 0.0, 1.0);
        // top face (green)
        drawRect3D([1.0, 1.0, 1.0, 0.0, 1.0, 0.0], gl, a_Position);
        // bottom face (blue)
        gl.uniform4f(u_FragColor, 0, 0.0, 1.0, 1.0);
        drawRect3D([1.0, 0.0, 1.0,  0.0, 0.0, 0.0], gl, a_Position);
        // back face (yellow)
        gl.uniform4f(u_FragColor, 1, 1.0, 0.0, 1.0);
        drawRect3D([1.0, 1.0, 1.0,  0.0, 0.0, 1.0], gl, a_Position);
        // left face (unsure)
        gl.uniform4f(u_FragColor, 0, 1.0, 1.0, 1.0);
        drawRect3D([0.0, 1.0, 1.0, 0.0, 0.0, 0.0], gl, a_Position);
        // right face (purple)
        gl.uniform4f(u_FragColor, 1.0, 0.0, 1.0, 1.0);
        drawRect3D([1.0, 1.0, 0.0,  1.0, 0.0, 1.0], gl, a_Position);
    }
}

function drawTriangle3D(v, gl, a_Position) {
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
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, n);

    gl.disableVertexAttribArray(a_Position);
}

function drawRect3D(corners, gl, a_Position) {
    console.log([corners[0], corners[4], corners[2],
        corners[3], corners[4], corners[5],
        corners[3], corners[1], corners[5]]);
    if (corners[1] == corners[4]) {
         drawTriangle3D(
        [corners[0], corners[4], corners[5],
        corners[3], corners[4], corners[5],
        corners[3], corners[1], corners[2]],
        gl, a_Position);
        drawTriangle3D(
        [corners[0], corners[4], corners[5],
        corners[3], corners[1], corners[2],
        corners[0], corners[1], corners[2]],
        gl, a_Position);
    } else {
        drawTriangle3D(
        [corners[0], corners[4], corners[2],
        corners[3], corners[4], corners[5],
        corners[3], corners[1], corners[5]],
        gl, a_Position);
        drawTriangle3D(
        [corners[0], corners[4], corners[2],
        corners[3], corners[1], corners[5],
        corners[0], corners[1], corners[2]],
        gl, a_Position);
    }
    
    
}