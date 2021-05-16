const vertexAttribs = {
    "meshPosition": 0
};

const TRIANGLE_PAIR = 2;
const TRIANGLE_VERTICIES = 3;
const VEC2_COUNT = 2;
const VEC2_X = 0;
const VEC2_Y = 1;

function shaderTypeToString(gl, shaderType) {
    switch (shaderType) {
    case gl.VERTEX_SHADER: return 'Vertex';
    case gl.FRAGMENT_SHADER: return 'Fragment';
    default: return shaderType;
    }
}

function compileShaderSource(gl, source, shaderType) {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(`Could not compile ${shaderTypeToString(shaderType)} shader: ${gl.getShaderInfoLog(shader)}`);
    }
    return shader;
}


function linkShaderProgram(gl, shaders, vertexAttribs) {
    const program = gl.createProgram();
    for (let shader of shaders) {
        gl.attachShader(program, shader);
    }

    for (let vertexName in vertexAttribs) {
        gl.bindAttribLocation(program, vertexAttribs[vertexName], vertexName);
    }

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(`Could not link shader program: ${gl.getProgramInfoLog(program)}`);
    }
    return program;
}

function prepareMeshPositionAttribute(gl) {
    let meshPositionBufferData = new Float32Array(TRIANGLE_PAIR * TRIANGLE_VERTICIES * VEC2_COUNT);
    for (let triangle = 0; triangle < TRIANGLE_PAIR; ++triangle) {
        for (let vertex = 0; vertex < TRIANGLE_VERTICIES; ++vertex) {
            const quad = triangle + vertex;
            const index =
                  triangle * TRIANGLE_VERTICIES * VEC2_COUNT +
                  vertex * VEC2_COUNT;
            meshPositionBufferData[index + VEC2_X] = (2 * (quad & 1) - 1);
            meshPositionBufferData[index + VEC2_Y] = (2 * ((quad >> 1) & 1) - 1);
        }
    }

    let meshPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, meshPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, meshPositionBufferData, gl.STATIC_DRAW);

    const meshPositionAttrib = vertexAttribs['meshPosition'];
    gl.vertexAttribPointer(
        meshPositionAttrib,
        VEC2_COUNT,
        gl.FLOAT,
        false,
        0,
        0);
    gl.enableVertexAttribArray(meshPositionAttrib);
}


const vertexShaderSource = `#version 100
precision mediump float;

attribute vec2 meshPosition;

varying vec2 uv;

void main() {
    gl_Position = vec4(meshPosition, 0.0, 1.0);
    uv = (meshPosition + 1.0) / 2.0;
}
`;

const fragmentShaderSource = `#version 100

precision mediump float;

varying vec2 uv;

vec3 hsl2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);
    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}

void main() {
    vec4 rainbow = vec4(hsl2rgb(vec3((uv.x - uv.y) * 0.5, 1.0, 0.80)), 1.0);
    gl_FragColor = rainbow;
}
`;

function prepareShaders(gl) {
    let vertexShader = compileShaderSource(gl, vertexShaderSource, gl.VERTEX_SHADER);
    let fragmentShader = compileShaderSource(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    let id = linkShaderProgram(gl, [vertexShader, fragmentShader], vertexAttribs);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    gl.useProgram(id);
}
