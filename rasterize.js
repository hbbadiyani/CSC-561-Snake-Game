const WIN_Z = 0;  // default graphics window z coord in world space
const WIN_LEFT = 0;
const WIN_RIGHT = 1;  // default left and right x coords in world space
const WIN_BOTTOM = 0;
const WIN_TOP = 1;  // default top and bottom y coords in world space
const INPUT_TRIANGLES_URL = "https://ncsucgclass.github.io/prog2/triangles.json"; // triangles file loc
const INPUT_SPHERES_URL = "https://ncsucgclass.github.io/prog2/spheres.json"; // spheres file loc

//var defaultLight = new vec3.fromValues(-1.0, 3.0, -0.5); // default light position in world space
var defaultLight = new vec3.fromValues(2,2,-3);
/* webgl globals */
var gl = null; // the all powerful gl object. It's all here folks!
var vertexBuffer; // this contains vertex coordinates in triples
var triangleBuffer; // this contains indices into vertexBuffer in triples
var normalBuffer;

var triBufferSize = 0; // the number of indices in the triangle buffer
var vertexPositionAttrib; // where to put position for vertex shader

var vertexAmbiAttrib, vertexDiffAttrib;
var vertexSpecAttrib, vertexNormalAttrib, vertexNAttrib;

var ambi_buff;
var diff_Buff;
var spec_buff;
var nBuffer;

var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var nMatrix = mat4.create();
var mdMatrix = mat4.create();
var myMdMatrix = [];
var board = [];
var foodIndex=8;
var headIndex=foodIndex+2;

var score=-10;
var inputTriangles =  [
    
	//TOP START
	{
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0,1,0], "specular": [0.3,0.3,0.3], "n":17},
		"vertices": [[-0.75 , -0.75, 0.75],[ -0.65, -0.75, 0.75],[ -0.65 , 1.75 ,0.75],[-0.75  ,1.75 ,0.75]],
		"normals": [[0, 0, -1],[0, 0, -1],[0, 0, -1],[0, 0, -1]],
		"triangles": [[0,1,3],[1,2,3]],
		"centroid": [0,0]
	},
	{
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0,1,0], "specular": [0.3,0.3,0.3], "n":17},
		"vertices": [[-0.75 , -0.75, 0.75],[ 1.75, -0.75, 0.75],[1.75 ,-0.65  ,0.75],[-0.75  ,-0.65 ,0.75]],
		"normals": [[0, 0, -1],[0, 0, -1],[0, 0, -1],[0, 0, -1]],
		"triangles": [[0,1,3],[1,2,3]],
		"centroid": [0,0]
	},
	{
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0,1,0], "specular": [0.3,0.3,0.3], "n":17},
		"vertices": [[1.65 , -0.75, 0.75],[ 1.75, -0.75, 0.75],[ 1.75, 1.75 ,0.75],[ 1.65 ,1.75 ,0.75]],
		"normals": [[0, 0, -1],[0, 0, -1],[0, 0, -1],[0, 0, -1]],
		"triangles": [[0,1,3],[1,2,3]],
		"centroid": [0,0]
	},
	{
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0,1,0], "specular": [0.3,0.3,0.3], "n":17},
		"vertices": [[ -0.75, 1.65 , 0.75],[1.75 ,1.65 , 0.75],[1.75 , 1.75 ,0.75],[ -0.75 ,1.75 ,0.75]],
		"normals": [[0, 0, -1],[0, 0, -1],[0, 0, -1],[0, 0, -1]],
		"triangles": [[0,1,3],[1,2,3]],
		"centroid": [0,0]
	},
	//TOP END
	//WALLS
	{
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0,1,0], "specular": [0.3,0.3,0.3], "n":17},
		"vertices": [[-0.65 , -0.75 , 0.85],[-0.65 , -0.75 , 0.75],[-0.65 , 1.75 , 0.75],[-0.65 , 1.75 , 0.85]],
		"normals": [[1, 0, 0],[1, 0, 0],[1, 0, 0],[1, 0, 0]],
		"triangles": [[0,1,2],[2,3,0]],
		"centroid": [0,0]
	},
	{
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0,1,0], "specular": [0.3,0.3,0.3], "n":17},
		"vertices": [[-0.75 , -0.65, 0.85],[ 1.75, -0.65, 0.85],[1.75 ,-0.65  ,0.75],[-0.75  ,-0.65 ,0.75]],
		"normals": [[0, 0, -1],[0, 0, -1],[0, 0, -1],[0, 0, -1]],
		"triangles": [[0,1,3],[1,2,3]],
		"centroid": [0,0]
	},
	{
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0,1,0], "specular": [0.3,0.3,0.3], "n":17},
		"vertices": [[1.65 , -0.75, 0.75],[ 1.65, -0.75, 0.85],[ 1.65, 1.75 ,0.85],[ 1.65 ,1.75 ,0.75]],
		"normals": [[-1, 0, 0],[-1, 0, 0],[-1, 0, 0],[-1, 0, 0]],
		"triangles": [[0,1,3],[1,2,3]],
		"centroid": [0,0]
	},
	{
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0,1,0], "specular": [0.3,0.3,0.3], "n":17},
		"vertices": [[ -0.75, 1.65 , 0.75],[1.75 ,1.65 , 0.75],[1.75 , 1.65 ,0.85],[ -0.75 ,1.65 ,0.85]],
		"normals": [[0, 0, -1],[0, 0, -1],[0, 0, -1],[0, 0, -1]],
		"triangles": [[0,1,3],[1,2,3]],
		"centroid": [0,0]
	},
	//WALLS END
	{
		//tasty food
        "material": {"ambient": [0.1,0.1,0.1], "diffuse": [1,0,0], "specular": [0.3,0.3,0.3], "n":17},
        "vertices": [[0.05, 0.15, 0.75],[0.05, 0.25, 0.75],[0.15,0.25,0.75],[0.15,0.15,0.75]],
        "normals": [[0, 0, -1],[0, 0, -1],[0, 0, -1],[0, 0, -1]],
        "triangles": [[0,1,2],[2,3,0]],
		"centroid": [0,0]
    },
	{   //NP Snake
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0,0,1], "specular": [1,0,0], "n":17},
		"vertices": [[0.55, 0.15, 0.75],[0.55, 0.25, 0.75],[0.65,0.25,0.75],[0.65,0.15,0.75]],
		"normals": [[0, 0, -1],[0, 0, -1],[0, 0, -1],[0, 0, -1]],
		"triangles": [[0,1,2],[2,3,0]],
		"centroid": [0,0],
		"dir":[0,0]
	},
    {
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.6,0.6,0.4], "specular": [1,0,0], "n":17},
		"vertices": [[0.05, 0.15, 0.75],[0.05, 0.25, 0.75],[0.15,0.25,0.75],[0.15,0.15,0.75]],
		"normals": [[0, 0, -1],[0, 0, -1],[0, 0, -1],[0, 0, -1]],
		"triangles": [[0,1,2],[2,3,0]],
		"centroid": [0,0],
		"dir":[0,0]
	}
	
];


createGrid();
function printxy(index)
{
	var sumx=0,sumy=0;
	
	for(var i=0;i<inputTriangles[index].vertices.length;i++)
	{
		sumx+=inputTriangles[index].vertices[i][0];
		sumy+=inputTriangles[index].vertices[i][1];
	}
			
	
	sumx=sumx/4;
	sumy=sumy/4;
	
	sumx.toPrecision(3);
	sumy.toPrecision(3);
	
	
	
	sumx = Math.round((sumx*1000))/1000;
	sumy = Math.round((sumy*1000))/1000;
	
	
	
}
function calCentroid(index)
{
	
	
	var sumx=0,sumy=0;
	
	for(var i=0;i<inputTriangles[index].vertices.length;i++)
	{
		sumx+=inputTriangles[index].vertices[i][0];
		sumy+=inputTriangles[index].vertices[i][1];
	}
			
	
	sumx=sumx/4;
	sumy=sumy/4;
	
	
	
	sumx.toPrecision(3);
	sumy.toPrecision(3);
	
	
	
	sumx = Math.round((sumx*1000))/1000;
	sumy = Math.round((sumy*1000))/1000;
	
	

	inputTriangles[index].centroid[0]=sumx;
	inputTriangles[index].centroid[1]=sumy;
	
}
function keyPressed(dire)
{
	curi = (inputTriangles[headIndex].centroid[0]-0.1) / 0.1;
	curj = (inputTriangles[headIndex].centroid[1]-0.1) / 0.1;
	curi=Math.round(curi)+500;
	curj=Math.round(curj)+500;
	
	
	//console.log(dir+"*"+curi+" "+curj);
	//console.log(inputTriangles[headIndex].dir[0]+" "+inputTriangles[headIndex].dir[1]);
	if(dire==0)
	{
		board[curi][curj].x=1;
		board[curi][curj].y=0;
		
		
	}
	if(dire==1)
	{
		board[curi][curj].x=-1;
		board[curi][curj].y=0;
		
	}
	if(dire==2)
	{
		board[curi][curj].y=1;
		board[curi][curj].x=0;
		
	}
	if(dire==3)
	{
		board[curi][curj].y=-1;
		board[curi][curj].x=0;
		
	}
	//console.log(inputTriangles[headIndex].dir[0]+" "+inputTriangles[headIndex].dir[1]);
	inputTriangles[headIndex].dir[0]=board[curi][curj].x;
	inputTriangles[headIndex].dir[1]=board[curi][curj].y;
	board[curi][curj].length=inputTriangles.length-1-foodIndex;
	//console.log(inputTriangles[headIndex].dir[0]+" "+inputTriangles[headIndex].dir[1]);
	
	
	
}
function createGrid()
{
	
	for(var k=0; k<1000; k++){
		board[k] = [];
	}

	for(var i=0;i<1000;i++)
	{
		for(var j=0;j<1000;j++)
		{
			board[i][j] = [
			{
			"x":0,
			"y":0,
			"length":0
			}
			];
		}
	}
}
function printij(i)
{
	curi = (inputTriangles[i].centroid[0]-0.1) / 0.1;
	curj = (inputTriangles[i].centroid[1]-0.1) / 0.1;
	
	curi=Math.round(curi)+500;
	curj=Math.round(curj)+500;
	
}
function addTail()
{
	
	myMdMatrix[inputTriangles.length-foodIndex-1] = mat4.create();
	console.log(inputTriangles.length-foodIndex-1+" ADD");
	var temp =
	{
		"material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.6,0.6,0.4], "specular": [0.3,0.3,0.3], "n":17},
		"vertices": [[0.05, 0.15, 0.75],[0.05, 0.25, 0.75],[0.15,0.25,0.75],[0.15,0.15,0.75]],
		"normals": [[0, 0, -1],[0, 0, -1],[0, 0, -1],[0, 0, -1]],
		"triangles": [[0,1,2],[2,3,0]],
		"centroid": [0,0],
		"dir":[inputTriangles[inputTriangles.length-1].dir[0],inputTriangles[inputTriangles.length-1].dir[1]]
	};
	
	var x=0,y=0,w=0.05;
	
	x=inputTriangles[inputTriangles.length-1].dir[0];
	y=inputTriangles[inputTriangles.length-1].dir[1];
	//console.log(x+" "+y);
	var cxloc = inputTriangles[inputTriangles.length-1].centroid[0];
	var cyloc = inputTriangles[inputTriangles.length-1].centroid[1];
	
	cxloc=Math.round(cxloc*100)/100;
	cyloc=Math.round(cyloc*100)/100;
	
	cxloc-=0.05;	cyloc-=0.05;
	var cx=0.1*x, cy=0.1*y;
	
	console.log(cxloc+" "+cyloc+" "+cx+" "+cy);
	if(x==1)
	{
		cx=0.3;	cy=0.1;
	}
	else if(x==-1)
	{
		cx=-0.1;	cy=0.1;
	}
	else if(y==1)
	{
		cy=-0.1;	cx=0.1;
	}
	else if(y==-1)
	{
		cy=0.3;	cx=0.1;
	}
	//cx=cy=0;
	var arr1= [cxloc -0.1 +cx ,cyloc + cy  ,0.75];
    var arr2= [cxloc  +cx   ,cyloc    +cy   ,0.75];
    var arr3= [cxloc  +cx    ,cyloc-0.1  +cy ,0.75];
    var arr4= [cxloc-0.1  +cx ,cyloc-0.1 +cy ,0.75];
	
	temp.vertices = [arr1,arr2,arr3,arr4];
	
	inputTriangles[inputTriangles.length] = temp;
	
	console.log(inputTriangles[headIndex].vertices);
	console.log(inputTriangles[headIndex+1].vertices);
	
	calCentroid(inputTriangles.length-1);
	
	triMatrix.push(mat4.create());
    rotMat.push(mat4.create());
    inputTriangles[inputTriangles.length-1].lightModel = 0;
	//console.log(myMdMatrix[inputTriangles.length-foodIndex-1]);
	myMdMatrix[inputTriangles.length-foodIndex-1] = mat4.multiply(mat4.create(),
					mat4.fromTranslation(mat4.create(), [-0.1,0,0]),
					myMdMatrix[inputTriangles.length-2-foodIndex]);
		
	
	
	
}
function loop()
{
	for(var i=headIndex;i<inputTriangles.length;i++)
	{
		//console.log(inputTriangles[headIndex].dir[0]+" "+inputTriangles[headIndex].dir[1]);
		if(i==headIndex)
		{
			var fi,fj,hi,hj;
			
			
			fi = (inputTriangles[foodIndex].centroid[0]-0.1) / 0.1;
			fj = (inputTriangles[foodIndex].centroid[1]-0.1) / 0.1;
			
			fi =Math.round(fi)+500;
			fj =Math.round(fj)+500;
			
			hi = (inputTriangles[headIndex].centroid[0]-0.1) / 0.1;
			hj = (inputTriangles[headIndex].centroid[1]-0.1) / 0.1;
			
			hi=Math.round(hi)+500;
			hj=Math.round(hj)+500;
			
			
			printxy(1);
			
			if(fi==hi && fj==hj)
			{
				getFood();
				addTail();
				
				
			}
		}
		
		curi = (inputTriangles[i].centroid[0]-0.1) / 0.1;
		curj = (inputTriangles[i].centroid[1]-0.1) / 0.1;
		
		curi=Math.round(curi)+500;
		curj=Math.round(curj)+500;
		

		
		if(curi<493|| curj<493 || curi>515 || curj>515)
		{
			alert(" --  Game ends  -- \n Boundary touch!! Please Refresh\n       Score = "+score);
			
			
		}
		
		if(board[curi][curj].length!=0 && board[curi][curj].x!=undefined && board[curi][curj].y!=undefined)
		{
			//console.log("*"+board[curi][curj].x+" "+board[curi][curj].y);
			if(board[curi][curj].x!=0)
			{
				//console.log("*"+inputTriangles[i].dir[0]+" "+inputTriangles[i].dir[1]);
				inputTriangles[i].dir[0]=board[curi][curj].x;
				inputTriangles[i].dir[1]=0;
			}
			else if(board[curi][curj].y!=0)
			{
				inputTriangles[i].dir[0]=0;
				inputTriangles[i].dir[1]=board[curi][curj].y;
			}
			board[curi][curj].length--;
		}
	}
}

function getFood()
 {
	var x= Math.floor(4*Math.random())*0.5;
	var y= Math.floor(4*Math.random())*0.5;
	 console.log(x+"_"+y);
    var w= 0.05;
    score+=10;
	
	 
    var arr1= [x-w,y+w,0.75];
    var arr2= [x-w,y-w,0.75];
    var arr3= [x+w,y+w,0.75];
    var arr4= [x+w,y-w,0.75];

    inputTriangles[foodIndex].vertices = [arr1,arr2,arr3,arr4];
	
	calCentroid(foodIndex);
 }


   // getJSONFile(INPUT_TRIANGLES_URL, "triangles"); // ////get the triangles

var triMatrix = [];
var rotMat = [];

var currTri = headIndex;

// ASSIGNMENT HELPER FUNCTIONS

// get the JSON file from the passed URL
function getJSONFile(url,descr) {
    try {
        if ((typeof(url) !== "string") || (typeof(descr) !== "string"))
            throw "getJSONFile: parameter not a string";
        else {
            var httpReq = new XMLHttpRequest(); // a new http request
            httpReq.open("GET",url,false); // initializeScene the request
            httpReq.send(null); // send the request
            var startTime = Date.now();
            while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
                if ((Date.now()-startTime) > 3000)
                    break;
            } // until its loaded or we time out after three seconds
            if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE))
                throw "Unable to open "+descr+" file!";
            else
                return JSON.parse(httpReq.response);
        } // end if good params
    } // end try

    catch(e) {
        console.log(e);
        return(String.null);
    }
} // end get json file

// set up the webGL environment
function setupWebGL() {

    // Get the canvas and context
    var canvas = document.getElementById("myWebGLCanvas"); // create a js canvas
    gl = canvas.getContext("webgl"); // get a webgl object from it

    try {
        if (gl == null) {
            throw "unable to create gl context -- is your browser gl ready?";
        } else {
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
            gl.clearColor(0.0, 0.0, 0.0, 1.0); // use black when we clear the frame buffer
            gl.clearDepth(1.0); // use max when we clear the depth buffer
            gl.enable(gl.DEPTH_TEST); // use hidden surface removal (with zbuffering)
        }
    } // end try

    catch(e) {
        console.log(e);
    } // end catch

} // end setupWebGL



// read triangles in, load them into webgl buffers
function loadTriangles() {

    if (inputTriangles != String.null) {
        var whichSetVert; // index of vertex in current triangle set
        var whichSetTri; // index of triangle in current triangle set

        for (var whichSet = 0; whichSet < inputTriangles.length; whichSet++) {
            var coordArray = []; // 1D array of vertex coords for WebGL
            var indexArray = []; // 1D array of vertex indices for WebGL
            var vtxBufferSize = 0; // the number of vertices in the vertex buffer
            var vtxToAdd = []; // vtx coords to add to the coord array
            var indexOffset = vec3.create(); // the index offset for the current set
            var triToAdd = vec3.create(); // tri indices to add to the index array

            var normalArr = [];
            var normalToAdd = [];

            var ambintArr = [];
            var diffuseArr = [];
            var specularArr = [];



            var normArr = [];
            var currColor = [];

            var triCenter = vec3.create();

            vec3.set(indexOffset, vtxBufferSize, vtxBufferSize, vtxBufferSize); // update vertex offset
            triBufferSize = 0;


            // set up the vertex coord array
            for (whichSetVert = 0; whichSetVert < inputTriangles[whichSet].vertices.length; whichSetVert++) {
                vtxToAdd = inputTriangles[whichSet].vertices[whichSetVert];
                coordArray.push(vtxToAdd[0], vtxToAdd[1], vtxToAdd[2]);

                currColor = inputTriangles[whichSet].material.diffuse;
                //console.log("currColor :" + currColor);

                diffuseArr.push(currColor[0], currColor[1], currColor[2]);
                currColor = inputTriangles[whichSet].material.specular;
                //console.log("currColor :" + currColor);

                specularArr.push(currColor[0], currColor[1], currColor[2]);
                //console.log("currColor :" + currColor);

                currColor = inputTriangles[whichSet].material.ambient;
                //console.log("currColor :" + currColor);


                ambintArr.push(currColor[0], currColor[1], currColor[2]);
                normArr.push(inputTriangles[whichSet].material.n);

                normalToAdd = inputTriangles[whichSet].normals[whichSetVert];
                normalArr.push(normalToAdd[0], normalToAdd[1], normalToAdd[2]);

                vec3.add(triCenter, triCenter, vtxToAdd);
                //console.log("Triangle Center :" + triCenter);
            } // end for vertices in set
            vec3.scale(triCenter, triCenter, 1.0 / inputTriangles[whichSet].vertices.length);

            // set up the triangle index array, adjusting indices across sets
            for (whichSetTri = 0; whichSetTri < inputTriangles[whichSet].triangles.length; whichSetTri++) {
                vec3.add(triToAdd, indexOffset, inputTriangles[whichSet].triangles[whichSetTri]);
                indexArray.push(triToAdd[0], triToAdd[1], triToAdd[2]);
            } // end for triangles in set

            vtxBufferSize += inputTriangles[whichSet].vertices.length; // total number of vertices
            triBufferSize += inputTriangles[whichSet].triangles.length; // total number of tris

            triBufferSize *= 3; // now total number of indices

            // send the vertex coords to webGL
            vertexBuffer = gl.createBuffer(); // initializeScene empty vertex coord buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // activate that buffer
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordArray), gl.STATIC_DRAW); // coords to that buffer

            // send the triangle indices to webGL
            triangleBuffer = gl.createBuffer(); // initializeScene empty triangle index buffer
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer); // activate that buffer
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW); // indices to that buffer

            // send the ambient
            ambi_buff = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, ambi_buff);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ambintArr), gl.STATIC_DRAW);

            //send the diffuse
            diff_Buff = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, diff_Buff);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(diffuseArr), gl.STATIC_DRAW);

            nBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normArr), gl.STATIC_DRAW);

            normalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalArr), gl.STATIC_DRAW);

            spec_buff = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, spec_buff);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(specularArr), gl.STATIC_DRAW);

			if(whichSet>foodIndex)
            {
				
				mdMatrix = myMdMatrix[whichSet-foodIndex-1];
				

				//console.log(inputTriangles[headIndex].dir[0]+" "+inputTriangles[headIndex].dir[1]);
				mdMatrix = mat4.multiply(mat4.create(),
					mat4.fromTranslation(mat4.create(), vec3.scale(vec3.create(), triCenter, -1)),
					mdMatrix);
				mat4.multiply(mdMatrix, rotMat[whichSet], mdMatrix);
				mdMatrix = mat4.multiply(mat4.create(),
					mat4.fromTranslation(mat4.create(), triCenter),
					mdMatrix);
				
				mat4.multiply(mdMatrix, triMatrix[whichSet], mdMatrix);
				gl.uniform1i(shaderProgram.lightModelUniform, inputTriangles[whichSet].lightModel);
				//console.log(myMdMatrix[whichSet-foodIndex-1]);
				
				//myMdMatrix[whichSet-foodIndex-1]=mdMatrix;
			}
			
	
			loop();
            render();
			mdMatrix = mat4.create();
        } // end for each triangle set
		mdMatrix = mat4.create();
    } // end if triangles found
} // end load triangles



// setup the webGL shaders
function setupShaders() {

    // define fragment shader in essl using es6 template strings
    var fShaderCode = `
        precision mediump float;
        
        varying vec3 ambiFrag;
         varying float NLDotProd;
         varying float specFrag;
         varying vec3 fragDiffColor;
         varying vec3 fragSpecColor;       
          
    
         
         void main(void) {           
            gl_FragColor = vec4(ambiFrag +
                      NLDotProd * fragDiffColor +
                      specFrag * fragSpecColor, 1.0);
            
         }
    `;

    // define vertex shader in essl using es6 template strings
    var vShaderCode = `
    
         uniform int uLightModel;
         
         attribute vec3 vertexPosition;
         attribute vec3 vtxAmbi;         
         attribute vec3 vertexSpec;         
         attribute vec3 vertexDiff;         
         attribute vec3 vertexNormal;
         attribute float VertexN;
         
         uniform mat4 uMVMatrix;
         uniform mat4 uPMatrix;
         uniform mat4 uNMatrix;
         uniform mat4 uMDMatrix;
         uniform vec3 uLightPos;
         
         varying vec3 ambiFrag;
         varying float NLDotProd;
         varying float specFrag;
         varying vec3 fragDiffColor;
         varying vec3 fragSpecColor;
         
                  
          void main(void) {
             gl_Position = uPMatrix * uMVMatrix * uMDMatrix * vec4(vertexPosition, 1.0);
             
             vec4 vertPos4 = uMVMatrix * uMDMatrix * vec4(vertexPosition, 1.0);           
             vec3 vPosition = vec3(vertPos4) / vertPos4.w;             
             vec3 vTransformedNormal = vec3(uNMatrix * vec4(vertexNormal,0.0));           
             vec3 vLight = vec3(uMVMatrix * vec4(uLightPos,1.0));             

             
            vec3 N = normalize(vTransformedNormal);
            vec3 V = normalize( vec3(0,0,0) - vPosition );
            vec3 L = normalize( vLight - vPosition );
            if(dot(N,V) < 0.0) N = -N;
         
            float NdotL = max(dot(N,L), 0.0);
            
            float specularLoc = 0.0;         
         
            if(NdotL>0.0){
                if(uLightModel == 0){
                    vec3 H = normalize(V + L);
                    float NdotH = max(dot(H, N), 0.0);
                    specularLoc = pow(NdotH, VertexN);
                }
                if(uLightModel == 1){
                    vec3 R = normalize(2.0 * N * NdotL - L);
                    float RdotV = max(dot(R, V), 0.0);
                    specularLoc = pow(RdotV, VertexN);
                }
                
            }            
             
             ambiFrag       = vtxAmbi; 
             NLDotProd      = NdotL;
             fragDiffColor  = vertexDiff;
             specFrag       = specularLoc;
             fragSpecColor  = vertexSpec;         
       

                    
          }
    `;

    try {
        // console.log("fragment shader: "+fShaderCode);
        var fShader = gl.createShader(gl.FRAGMENT_SHADER); // create frag shader
        gl.shaderSource(fShader, fShaderCode); // attach code to shader
        gl.compileShader(fShader); // compile the code for gpu execution

        // console.log("vertex shader: "+vShaderCode);
        var vShader = gl.createShader(gl.VERTEX_SHADER); // create vertex shader
        gl.shaderSource(vShader, vShaderCode); // attach code to shader
        gl.compileShader(vShader); // compile the code for gpu execution

        if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) { // bad frag shader compile
            throw "error during fragment shader compile: " + gl.getShaderInfoLog(fShader);
            gl.deleteShader(fShader);
        } else if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) { // bad vertex shader compile
            throw "error during vertex shader compile: " + gl.getShaderInfoLog(vShader);
            gl.deleteShader(vShader);
        } else { // no compile errors
            shaderProgram = gl.createProgram(); // create the single shader program
            gl.attachShader(shaderProgram, fShader); // put frag shader in program
            gl.attachShader(shaderProgram, vShader); // put vertex shader in program
            gl.linkProgram(shaderProgram); // link program into gl context

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) { // bad program link
                throw "error during shader program linking: " + gl.getProgramInfoLog(shaderProgram);
            } else { // no shader program link errors
                gl.useProgram(shaderProgram); // activate shader program (frag and vert)
                vertexPositionAttrib = // get pointer to vertex shader input
                    gl.getAttribLocation(shaderProgram, "vertexPosition");
                gl.enableVertexAttribArray(vertexPositionAttrib); // input to shader from array

                vertexAmbiAttrib = gl.getAttribLocation(shaderProgram, "vtxAmbi");
                gl.enableVertexAttribArray(vertexAmbiAttrib);

                vertexSpecAttrib = gl.getAttribLocation(shaderProgram, "vertexSpec");
                gl.enableVertexAttribArray(vertexSpecAttrib);

                vertexDiffAttrib = gl.getAttribLocation(shaderProgram, "vertexDiff");
                gl.enableVertexAttribArray(vertexDiffAttrib);

                vertexNormalAttrib = gl.getAttribLocation(shaderProgram, "vertexNormal");
                gl.enableVertexAttribArray(vertexNormalAttrib);

                vertexNAttrib = gl.getAttribLocation(shaderProgram, "VertexN");
                gl.enableVertexAttribArray(vertexNAttrib);

                shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
                shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
                shaderProgram.lightVecUniform = gl.getUniformLocation(shaderProgram, "uLightPos");
                shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
                shaderProgram.mdMatrixUniform = gl.getUniformLocation(shaderProgram, "uMDMatrix");
                shaderProgram.lightModelUniform = gl.getUniformLocation(shaderProgram, "uLightModel");
            } // end if no shader program link errors
        } // end if no compile errors
    } // end try

    catch (e) {
        console.log(e);
    } // end catch
} // end setup shaders

var currDir = [0.1, 0, 0];
var dirCheck ;

var dirArr = [[0.1, 0, 0], [-0.1, 0, 0], [0, 0.1, 0], [0.0, -0.1, 0] ];

function keyStroke(event) {

    var selection = event.key;
	//right = 0, left = 1, up = 2,  down = 3
    if(selection == 'a' && dirCheck != 'd')
    {
		keyPressed(1);
        dirCheck = 'a';
        currDir = dirArr[0];
    }

    if(selection == 'd' && dirCheck != 'a')
    {
		keyPressed(0);
        dirCheck = 'd';
        currDir = dirArr[1];
    }

    if(selection == 'w' && dirCheck != 's')
    {
		keyPressed(2);
        dirCheck = 'w';
        currDir = dirArr[2];
    }

    if(selection == 's' && dirCheck != 'w')
    {
		keyPressed(3);
        dirCheck = 's';
        currDir = dirArr[3];
    }
}



 var continuPlay =
    setInterval('incessantMove(currDir)', 300);

function incessantMove(currDir){
	mat4.multiply(triMatrix[headIndex-1], mat4.fromTranslation(mat4.create(), currDir), triMatrix[headIndex-1]);
	var inde = Math.round(3*Math.random());
	//console.log(inde);
		inputTriangles[headIndex-1].centroid[0]+=0.1;
		inputTriangles[headIndex-1].centroid[1]+=0;
		drawTriangles();
	for(var i=headIndex;i<inputTriangles.length;i++)	
    {
		mat4.multiply(triMatrix[i], mat4.fromTranslation(mat4.create(), currDir), triMatrix[i]);
		
		inputTriangles[i].centroid[0]+=currDir[0];
		inputTriangles[i].centroid[1]+=currDir[1];
		console.log(inputTriangles[i].dir[0]+" "+inputTriangles[i].dir[1]);
		/*inputTriangles[i].centroid[0]+=currDir[0]*inputTriangles[i].dir[0];
		inputTriangles[i].centroid[1]+=currDir[1]*inputTriangles[i].dir[1];*/
		drawTriangles();
	}
}



//event listner javascript

//random snake collides the wall
//snakeDir = dirArr[(prevRand+1)/4];

//MySnake touches the wall
// game over reload


function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    gl.uniformMatrix4fv(shaderProgram.mdMatrixUniform, false, mdMatrix);
    gl.uniform3fv(shaderProgram.lightVecUniform, defaultLight);
    mat4.invert(nMatrix, mat4.multiply(nMatrix, mvMatrix, mdMatrix));
    mat4.transpose(nMatrix, nMatrix);
    

    gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, nMatrix);
}


// render the loaded model
function render() {
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clear frame/depth buffers
    setMatrixUniforms();

    // vertex buffer: activate and feed into vertex shader
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // activate
    gl.vertexAttribPointer(vertexPositionAttrib, 3, gl.FLOAT, false, 0, 0); // feed

    gl.bindBuffer(gl.ARRAY_BUFFER, ambi_buff);
    gl.vertexAttribPointer(vertexAmbiAttrib, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, diff_Buff);
    gl.vertexAttribPointer(vertexDiffAttrib, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, spec_buff);
    gl.vertexAttribPointer(vertexSpecAttrib, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(vertexNormalAttrib, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.vertexAttribPointer(vertexNAttrib, 1, gl.FLOAT, false, 0, 0);

    // triangle buffer: activate and render
    //console.log("Triangle buffer size : " + triBufferSize);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer); // activate
    //console.log("Triangle buffer size : " + triBufferSize);
    gl.drawElements(gl.TRIANGLES, triBufferSize, gl.UNSIGNED_SHORT, 0); // render
	
	

} // end render triangles



function drawTriangles() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    loadTriangles();

}


/* MAIN -- HERE is where execution begins after window load */

function main() {
    
	getFood();
	createGrid();
	calCentroid(headIndex);
	
	console.log(inputTriangles[headIndex].dir);
	myMdMatrix[0] = mat4.create();
	myMdMatrix[1] = mat4.create();
	
	setupWebGL(); // set up the webGL environment
    setupShaders(); // setup the webGL shaders

    mat4.lookAt(mvMatrix, [0.5, 0.5, -0.5], [0.5, 0.5, 1], [0, 1, 0]);
    mat4.multiply(mvMatrix, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], mvMatrix);
    mat4.perspective(pMatrix, Math.PI / 2, gl.viewportWidth / gl.viewportHeight, 0.5, 3.0);

    for (var i = 0; i < inputTriangles.length; i++) {
        triMatrix.push(mat4.create());
        rotMat.push(mat4.create());
        inputTriangles[i].lightModel = 0;
    }

    drawTriangles();

    document.onkeydown = keyStroke;
} // end main