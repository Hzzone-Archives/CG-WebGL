"use strict";

var canvas;
var gl;

var points = [];
var colors = [];

var NumTimesToSubdivide = 6;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];

    divideTriangle( vertices[0], vertices[1], vertices[2],
                    NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var aPosition = gl.getAttribLocation( program, "aPosition" );
    var aColor = gl.getAttribLocation( program, "aColor" );

    // Load the data into the GPU

    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(aPosition );

    var cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(aColor);

    render();
    var b1 = document.getElementById("btn1");
    var b2 = document.getElementById("btn2");
    var b3 = document.getElementById("btn3");
    var b4 = document.getElementById("btn4");
    var canvas_size = 5
    b2.innerHTML=canvas_size; 
    b1.onclick=function(){
        if(canvas_size<10){
           canvas_size++;
           b2.innerHTML=canvas_size; 
            canvas.setAttribute('width', 64*canvas_size);
            canvas.setAttribute('height', 64*canvas_size);
        }
        else{
            b2.innerHTML=10;
        }
   }
   b3.onclick=function(){
        if(canvas_size>0){
           canvas_size--;
            b2.innerHTML=canvas_size; 
            canvas.setAttribute('width', 64*canvas_size);
            canvas.setAttribute('height', 64*canvas_size);
        }
        else{
            b2.innerHTML=0;
        }
   }
   b4.onclick=function(){
        location.reload();
   }
};

function triangle( a, b, c )
{
    var color = vec4(Math.random(), Math.random(), Math.random(), 1.0);
    points.push( a, b, c );
    colors.push(color, color, color);
}

function divideTriangle( a, b, c, count )
{

    // check for end of recursion

    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // three new triangles

        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
