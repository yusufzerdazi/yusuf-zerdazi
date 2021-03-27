// LectureHall.js (c) 2015 Yusuf Zerdazi

// Vertex shader program
var VSHADER_SOURCE =
   '#ifdef GL_ES\n' +
   'precision mediump float;\n' +  // Set to medium precision
   '#endif\n' +
   'attribute vec4 a_Position;\n' +  // Vertex location
   'attribute vec4 a_Color;\n' +  // Vertex Colour
   'attribute vec4 a_Normal;\n' +  // Vertex Normal
   'attribute vec2 a_TexCoord;\n' +  // Where in the texture this vertex corresponds to

   'uniform mat4 u_MvpMatrix;\n' +  // View projection matrix
   'uniform mat4 u_ModelMatrix;\n' +   // Model matrix
   'uniform mat4 u_NormalMatrix;\n' +  // Transformation matrix of the normal
   'uniform bool u_isTexture;\n' +  // Is the vertex on a textured object?

   'varying vec4 v_Color;\n' +  // Per fragment colour
   'varying vec2 v_TexCoord;\n' +  // Per fragment texture
   'varying vec3 v_Normal;\n' +  // Per fragment normal
   'varying vec3 v_Position;\n' +  // Per fragment position

   'void main() {\n' +
   '    gl_Position = u_MvpMatrix * a_Position;\n' +  // Calculate the vertex position in the world coordinate
   '    v_Position = vec3(u_ModelMatrix * a_Position);\n' +
   '    v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +  // Calculate the normal of the object at this specific point
   '    if(u_isTexture){\n' +  // If object is textured
   '        v_TexCoord = a_TexCoord;\n' +  // Set the per fragment texture
   '    }else{\n' +  //Otherwise
   '        v_Color = a_Color;\n' +  // Set it to a solid colour
   '    }\n' +
   '}\n';

// Fragment shader program
var FSHADER_SOURCE =
   '#ifdef GL_ES\n' +
   'precision mediump float;\n' +  // Set to medium precision
   '#endif\n' +

   'uniform vec3 u_AmbientLight;\n' +   // Ambient light color
   'uniform vec3 lightPositions[4];\n' +  // Light lightPositions
   'uniform vec3 lightColours[4];\n' +  // Light lightColours
   'uniform bool lightsOn[4];\n' +  // lightsOn on
   'uniform bool u_isTexture;\n' +  // Is there a texture?
   'uniform sampler2D u_Sampler;\n' +  // Texture sampler
   'uniform float u_Alpha;\n' +  // Transparency

   'varying vec3 v_Normal;\n' +  // Normal
   'varying vec3 v_Position;\n' +  // Position
   'varying vec4 v_Color;\n' +  // Colour
   'varying vec2 v_TexCoord;\n' +  // Texture coordinates

   'void main() {\n' +
   '    vec3 diffuse = vec3(0.0,0.0,0.0);\n' +  // Set the diffuse light
   '    for(int i=0; i<4; i++){\n' +  // For all lightsOn
   '        vec3 vect = lightPositions[i] - v_Position;\n' +  // Calculate the vector between the light and the object
   '        vec3 normVect = normalize(vect);\n' +  // Calculate the normalise vector
   '        float distance = 0.02 * length(vect);\n' +  // Calclulate the distance between the light and the object
   '        float dot = float(lightsOn[i]) * max(dot(normVect, v_Normal), 0.0);\n' +  // Dot product of light direction and the surface normal
   '        diffuse = diffuse + (1.0/(distance*distance))*(lightColours[i] * dot);\n' +  // Add up the total light
   '    }\n' +
   '    vec4 color;\n' +  // Color

   '    if(u_isTexture){\n' +  // If the object is textured
   '        color = texture2D(u_Sampler, v_TexCoord);\n' +  // Calculate the colour of the fragment from the texture
   '    }else{\n' +  // Otherwise
   '        color = v_Color;\n' +  // Set it to a solid colour
   '    }\n' +
   '    vec3 sum = diffuse + u_AmbientLight;\n' +  // Add the ambient lighting and the lightsOn
   '    vec3 final = vec3(sum[0]/(sum[0]+1.0),sum[1]/(sum[1]+1.0),sum[2]/(sum[2]+1.0));\n' +  // Modify this value so that it is not too intense
   '    gl_FragColor = vec4(final*color.rgb, color.a*u_Alpha);\n' +  // Set the colour of the fragment, taking transparency into account
   '}\n';

//Paths
var woodPath  = 'resources//wood.jpg';
var paintPath = 'resources//paint.jpg';
var floorPath = 'resources//carpet.jpg';
var brickPath = 'resources//brick.jpg';
var grassPath = 'resources//grass.jpg';
var blackboardPath = 'resources//blackboard.jpg';
var windowPath = 'resources//glass.jpg';
var doorPath = 'resources//door.jpg';
var tablePath = 'resources//table.jpg';
var roofPath = 'resources//roof.png';
var discoPath = 'resources//disco.jpg';
var snd = new Audio("resources//won.mp3"); // buffers automatically when created

//Camera variables
var lookSpeed=0.01;
var theta=Math.PI;  // Horizontal look angle
var phi=Math.PI/2;  // Vertical look angle

//Player variables
self = new Object();
self.velocity=[0,0,0];
self.position=[10,0,0];
self.terminal=1;
self.noclip=false;
self.look=[Math.cos(theta)*Math.sin(phi),Math.cos(phi),Math.sin(theta)*Math.sin(phi)];
self.lookXY=[Math.cos(theta),Math.sin(theta)];
self.strafe=[Math.cos(theta+Math.PI),Math.sin(theta+Math.PI)];
self.keys=[[87,83],[32,90],[68,65]];
self.height = 15;
self.canJump=true;

//Object variables
var fanAngle=0;
var types = ['sphere','cube'];
var isDisco=false;
var fanOn = false;
var doorOpen = false;
var doorAngle = 0;
var controlsShown = true;

//Light variables
var lightsOn = [true,false,false,false];
var lightColours = [1,1,0,  1,0,1,  0,1,1,  0,0,1];
var lightPositions = [20, 19.5, -20,   -20, 19.5, -20,   -20, 19.5, 20,   20, 19.5, 20];

var sunTime = 0;
var sunOn = true;
var sunBrightness = 0;

var randomLights=[0,0,0,0,0,0,0,0,0,0,0,0];
for(var i=0; i<12; i++){
    randomLights[i] = new Simple1DNoise();
}

var randomSun=[0,0,0];
for(var i=0; i<3; i++){
    randomSun[i] = new Simple1DNoise();
}

var xDisco=0;
var xSun=0;

//Entity/World variables
var entities = [];
var ground=[];
var velocityStep = 0.15;
var won=false;

//Matrix variables
var matrixStack = []; // Array for storing a matrix
var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();
var g_normalMatrix = new Matrix4();  // Coordinate transformation matrix for normals

function main() {
    /////////////////////////////////
    // Set up the view environment //
    /////////////////////////////////
    canvas = document.getElementById('webgl');  // Retrieve <canvas> element
    gl = getWebGLContext(canvas,false);  // Get the rendering context for WebGL
    if (!gl) { console.log('Failed to get the rendering context for WebGL'); return;}  // Detect errors
    program = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);  // Initialise shaders
    if (!program) { console.log('Failed to intialize shaders.'); return;}  // Detect errors
    gl.clearColor(0.0, 0.0, 1, 0.4);  // Set the clear color
    gl.enable(gl.DEPTH_TEST);  // enable the depth test
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);  // Set the type of blending us
    gl.enable(gl.BLEND);  // Enable blending (for transparency)

    //////////////////////////////////////////////////
    //Get the storage locations of uniform variables//
    //////////////////////////////////////////////////
    gl.useProgram(program);

    program.u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');  // Model matrix
    program.u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');  // View projection matrix
    program.u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');  // Normal matrix
    program.u_AmbientLight = gl.getUniformLocation(program, 'u_AmbientLight');  // Amount of ambient light
    program.u_isTexture = gl.getUniformLocation(program, 'u_isTexture');  // Position of point light
    program.u_Alpha = gl.getUniformLocation(program, 'u_Alpha');  // Position of point light

    program.a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');  // Texture Attribute variable for each vertex
    program.a_Color = gl.getAttribLocation(program,'a_Color');  // Color Attribute variable for each vertex
    program.a_Normal = gl.getAttribLocation(program, 'a_Normal');  // Position Attribute variable for each vertex
    program.a_Position = gl.getAttribLocation(program, 'a_Position');  // Position Attribute variable for each vertex

    program.lightPositions = gl.getUniformLocation(program, 'lightPositions');  // Positions of lights
    program.lightColours = gl.getUniformLocation(program, 'lightColours');  // Colours of lights
    program.lightsOn = gl.getUniformLocation(program, 'lightsOn');  // Lights that are on

    //Detect errors
    if (!program.u_ModelMatrix || !program.u_MvpMatrix || !program.u_NormalMatrix || !program.lightPositions　|| !program.u_AmbientLight  || !program.u_isTexture  || !program.u_Alpha || !program.lightColours || !program.lightsOn) {
        console.log('Failed to get the storage location');
        return;
    }

    ///////////////////////////////////////////////////////////////////
    //Set the shapes used in the world and spawn the initial entities//
    ///////////////////////////////////////////////////////////////////
    generateShapes(gl);
    spawnEntity('cube');
    spawnEntity('cube');
    spawnEntity('sphere');

    /////////////////////////////////////////
    //Detect mouse movement and key presses//
    /////////////////////////////////////////
    var map = [];
    onkeydown = onkeyup = function(e){  // Detect key down/key up
        e = e || event; // to deal with IE
        map[e.keyCode] = e.type == 'keydown';  // Save the key to an array
    }

    document.onkeydown = function (e){  // Detect a key press
        toggles(e.keyCode);
    }

    document.onmousemove = function (e) {  // Detect mouse movement
        dx = e.movementX ||  e.mozMovementX ||  e.webkitMovementX ||  0, // Pixels moved in x direction
  		dy = e.movementY ||  e.mozMovementY ||  e.webkitMovementY ||  0; // Pixels moved in y direction
        theta += lookSpeed*dx;
        if(phi+lookSpeed*dy<Math.PI && phi+lookSpeed*dy>0){
            phi += lookSpeed*dy;
        }
        if(theta>2*Math.PI){
            theta-(2*Math.PI);
        }
        if(theta<0){
            theta+=(2*Math.PI);
        }
    }

    //Detect mouse clicks
    document.body.onclick = document.body.requestPointerLock ||
                            document.body.mozRequestPointerLock ||
                            document.body.webkitRequestPointerLock;


    //////////////////
    //Draw the scene//
    //////////////////
    var tick = function() {   // Start drawing
        resize(gl);  // Resize the canvas if the window is resized
	    updateObjects(gl); // Update objects
	    updateEntities(); // Update entities
	    updatePlayer(map); // Update player based on key presses
	    updateLights(gl); // Update lighting
	    draw(gl); // Draw scene
        requestAnimationFrame(tick, canvas); // Refresh scene
    };
    tick();
}

// Resizes the canvas depending on if the window has been resized
// From http://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
function resize(gl) {
    // Get the canvas from the WebGL context
    var canvas = gl.canvas;

    // Lookup the size the browser is displaying the canvas.
    var displayWidth = canvas.clientWidth;
    var displayHeight = displayWidth * 0.5625;

    // Check if the canvas is not the same size.
    if (canvas.width != displayWidth ||
        canvas.height != displayHeight) {

        // Make the canvas the same size
        canvas.width = displayWidth;
        canvas.height = displayHeight;

        // Set the viewport to match
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
}

// Update the dynamic objects' variables
function updateObjects(gl){
    if(doorOpen && doorAngle<90){
        doorAngle += 5; // Update current rotation angle
    }else if(!doorOpen && doorAngle>0){
        doorAngle -=5;
    }
    if(fanOn){
        fanAngle += 1; // Update current rotation angle
    }
}

// Update the entities in the scene
function updateEntities(){
    var count=0;
	for(var j=0; j<entities.length; j++){ // Loop over all the entities
		detectCollision(entities[j]);  // See if the player has bumped into it
	}
    for(var i=0; i<entities.length; i++){
        updateEntity(entities[i]); // Upadte the velocities of the entity
        if(Math.abs(entities[i].position[0])<50 && Math.abs(entities[i].position[2])<50 && entities[i].position[1]>=30 && entities[i].velocity[0]==0&& entities[i].velocity[2]==0){ // If the entity is on the roof
            count+=1; // Add it th the count
        }
    }
    if(count==entities.length){ // If all the entities are on the roof
        won=true; // You win!
        snd.play(); // Play the music
    }else{
    	won=false; // You lost!
    }
}

//Update all the lighting
function updateLights(gl){
    if(isDisco){ // If disco mode is on
        xDisco+=1;
        for(var i=0; i<12; i++){
            lightColours[i]=randomLights[i].getVal(xDisco); // Randomise the lights
        }
    }else{
        for(var i=0; i<12; i++){
            lightColours[i]=1; // Set the lights to 1
        }
    }
    if(sunOn){
        if(sunTime+0.005>2*Math.PI){
            sunTime=0;
        }else{
            sunTime+=0.001;
        }if(won){ // If you got all the entities on the roof
            xSun+=1;
            gl.uniform3f(program.u_AmbientLight, randomSun[0].getVal(xSun), randomSun[1].getVal(xSun), randomSun[2].getVal(xSun)); // Randomise the ambient light
            gl.clearColor(randomSun[0].getVal(xSun), randomSun[1].getVal(xSun), randomSun[2].getVal(xSun),1); // Randomise the clear colour
        }else{
            sunBrightness=0.6+0.4*Math.sin(sunTime);
            gl.uniform3f(program.u_AmbientLight, sunBrightness, sunBrightness, sunBrightness); // Do the day/night cycle
            gl.clearColor(0,0,sunBrightness,1-0.6*sunBrightness);
        }
    }else{
        gl.uniform3f(program.u_AmbientLight, 0.7, 0.7, 0.7);
    }
    gl.uniform1iv(program.lightsOn, lightsOn); // Set whether the point lights are on
    gl.uniform3fv(program.lightColours, lightColours); // Set the point light colours
    gl.uniform3fv(program.lightPositions, lightPositions); // Set the point light positions

}

//Update an entity
function updateEntity(entity){
    if(entity.velocity[0]!=0 || entity.velocity[1]!=0 || entity.velocity[2]!=0){ // If the entity is moving
        speed = Math.sqrt(Math.pow(entity.velocity[0],2)+Math.pow(entity.velocity[1],2)+Math.pow(entity.velocity[2],2));
        direction = [entity.velocity[0]/speed,entity.velocity[1]/speed,entity.velocity[2]/speed];
        setEntityVelocity(entity,direction); // Slow it down
    }
    for(var i=0; i<3; i++){
        entity.position[i] += entity.velocity[i]; // Apply the velocity to the position
    }
}

//Update the player position
function updatePlayer(map){
    if(map[16]){ //Shift
        self.terminal=5;
    }else{
        self.terminal=1;
    }
    setPlayerVelocity(map); // Set the player velocity based on key presses
    self.look=[Math.cos(theta)*Math.sin(phi),Math.cos(phi),Math.sin(theta)*Math.sin(phi)]; // 3D Polar coordinates
    self.lookXY=[Math.cos(theta),Math.sin(theta)]; // 2D polar coordinates, for horizontal velocity
    self.strafe=[Math.cos(theta+Math.PI/2),Math.sin(theta+Math.PI/2)]; // Perpendicular, for strafing
    self.position[1]+=self.velocity[1]; // Set the vertical velocity
    self.position[0]+=self.velocity[0]*self.lookXY[0] + self.velocity[2]*self.strafe[0]; // Set the horizontal velocities
    self.position[2]+=self.velocity[0]*self.lookXY[1] + self.velocity[2]*self.strafe[1]; // Set the horizontal velocities
}

//Set the entity velocity
function setEntityVelocity(entity,direction){
    for(var i=0; i<3; i++){ // For each axis
        if(i==1){
            g=isOnGround(entity.position[0],entity.position[1],entity.position[2],entity); //Highest ground layer below the entity, or lowest ground layer
            if(entity.position[i] + entity.velocity[i]-velocityStep < g && entity.velocity[i]-velocityStep<0){ //If the entity is about to hit the ground
                if(entity.bounce){
                    entity.velocity[i] = -0.5*entity.velocity[i]; // Make it bounce
                }else{
                    entity.velocity[i] = 0;
                    entity.position[i] = g;
                }
            }else{
                entity.velocity[i] -= velocityStep; // Accelerate towards ground
            }
        }else if(entity.velocity[i] != 0){
            if(Math.abs(entity.velocity[i])<0.1){
                entity.velocity[i] = 0;
            }else{
                entity.velocity[i] -= direction[i]*0.075; // Air resistance
            }
        }
    }
}

//Set the player velocity
function setPlayerVelocity(map){
    if(!self.noclip){
		g=isOnGround(self.position[0],self.position[1],self.position[2],self);
		if(self.position[1]+self.velocity[1]-velocityStep<g && self.velocity[1]-velocityStep<0){ // If the player is on the ground
			self.position[1]=g; // Set height to ground level
            self.velocity[1]=0; // Set velocity to 0
            self.canJump=true; // Now able to jump
		}else{
			self.velocity[1]-=velocityStep; // Accelerate towards earth
		}
	}else{
		setVelocity(map[32],map[90],1); // Noclip mode
	}
	setVelocity(map[87],map[83],0); //W,S
	setVelocity(map[68],map[65],2); //A,D
	if(map[38]){ // Down
		if(phi-0.025>0){
            phi -= 0.025;
        }
	}
	if(map[40]){ // Up
		if(phi+0.025<Math.PI){
			phi+=0.025;
		}
	}
	if(map[37]){ // Left
		theta-=0.05;
        if(theta<0){
            theta+=(2*Math.PI);
        }
	}
	if(map[39]){ // Right
		theta+=0.05;
		if(theta>2*Math.PI){
            theta-(2*Math.PI);
        }
	}

}

//Set the velocity
function setVelocity(key1,key2,i){
	if(key1 && key2){
		if(Math.abs(self.velocity[i]-velocityStep)<0){
			self.velocity[i]=0;
		}else{
			self.velocity[i]-=(self.velocity[i]?self.velocity[i]<0?-1:1:0)*velocityStep;
		}
	}else if(key1){
		if(self.velocity[i]+velocityStep<self.terminal){
			self.velocity[i] += velocityStep;
		}else if(self.velocity[i]>self.terminal){
			if(Math.abs(self.velocity[i]-self.terminal)<velocityStep){
				self.velocity[i]=self.terminal;
			}else{
				self.velocity[i]-=(self.velocity[i]?self.velocity[i]<0?-1:1:0)*velocityStep;
			}
		}
	}else if(key2){
		if(self.velocity[i]+velocityStep>-self.terminal){
			self.velocity[i] -= velocityStep;
		}else if(self.velocity[i]<-self.terminal){
			if(Math.abs(self.velocity[i]-self.terminal)<velocityStep){
				self.velocity[i]=-self.terminal;
			}else{
				self.velocity[i]-=(self.velocity[i]?self.velocity[i]<0?-1:1:0)*velocityStep;
			}
		}
	}else{
		if(Math.abs(self.velocity[i])<velocityStep){
			self.velocity[i]=0;
		}else{
			self.velocity[i]-=(self.velocity[i]?self.velocity[i]<0?-1:1:0)*velocityStep;
		}
	}
}

//Add section of ground for bounced and floor collision
function setGround(h,x1,x2,z1,z2){
	g=new Object();
	g.xMin=x1;
	g.xMax=x2;
	g.zMin=z1;
	g.zMax=z2;
	g.height=h;
    ground.push(g);
}

//Get all the layers of ground at a specific coordinate
function getGround(x,z){
    var floors = [];
    for(var i=0; i<ground.length; i++){
    	if(x>ground[i].xMin && x<ground[i].xMax && z>ground[i].zMin && z<ground[i].zMax){
    		floors.push(ground[i].height);
    	}
    }
    for(var i=0; i<entities.length; i++){
        dist=[entities[i].position[0]-self.position[0],entities[i].position[1]-self.position[1],entities[i].position[2]-self.position[2]];
        if(Math.sqrt(Math.pow(dist[0],2)+Math.pow(dist[2],2))<2*entities[0].size){ // If above an entity
            floors.push(entities[i].position[1]+2*entities[i].size); // Add this height to the grounds
        }
    }
    return floors;
}

//Returns highest level of ground below entity/player
function isOnGround(x,y,z,entity){
    floors=getGround(x,z);
    m=0;
    for(var i=0; i<floors.length; i++){
    	if(floors[i]>m && entity.position[1]>=floors[i]){
    		m=floors[i];
    	}
    }
    return m;
}

//Detects whether a player has bumped into an object, and sets velocities accordingly
function detectCollision(entity){
	dist=[entity.position[0]-self.position[0],entity.position[1]-self.position[1],entity.position[2]-self.position[2]];
	speed=Math.sqrt(Math.pow(self.velocity[0],2)+Math.pow(self.velocity[2],2));
    if(Math.sqrt(Math.pow(dist[0],2)+Math.pow(dist[2],2))<entity.size && Math.abs(dist[1])<10){
        entity.velocity[0]=2*(self.velocity[0]*self.lookXY[0] + self.velocity[2]*self.strafe[0]);
        entity.velocity[2]=2*(self.velocity[0]*self.lookXY[1] + self.velocity[2]*self.strafe[1]);
        entity.velocity[1]=2*speed;
    }
}

//Spawn an entity. Type is either 'spehere' or 'cube'
function spawnEntity(type){
	var entity = new Object();
	entity.velocity=[0,0,0];
	entity.position=[100+300*Math.random(),0,300*(Math.random()-0.5)];
	entity.colour=[Math.random(),Math.random(),Math.random()];
	entity.bounce=true;
	entity.type=type;
	if(type=='cube'){
		entity.size=10*Math.random()+4;
		entity.height=1;
	}else if(type=='sphere'){
		entity.size=5*Math.random()+4;
		entity.height=entity.size;
	}

	entities.push(entity);
}

//Key toggles for all the toggleable variables
function toggles(e){
    switch(e){
    case 49: //1
        lightsOn[0] = !lightsOn[0];
        break;
    case 50: //2
        lightsOn[1] = !lightsOn[1];
        break;
    case 51: //3
        lightsOn[2] = !lightsOn[2];
        break;
    case 52: //4
        lightsOn[3] = !lightsOn[3];
        break;
    case 80: //p
        isDisco=!isDisco;
        break;
    case 79: //o
        fanOn=!fanOn;
        break;
    case 72:
        controlsShown ? (document.getElementById("overlay").style.display = "none", controlsShown = !1) : (document.getElementById("overlay").style.display = "block", controlsShown = !0);
        break;
    case 73: //i
        self.noclip=!self.noclip;
        break;
    case 32: //space
        if(!self.noclip){
        	if(self.canJump){
            	self.velocity[1] = 3.5;
            	self.canJump=false;
            }
        }
        break;
    case 69: //e
        doorOpen=!doorOpen;
        break;
    case 81: //q
        spawnEntity(types[Math.floor(Math.random()*(types.length))]);
        break;
    }
}

//Generate all the shapes used in the  lecture hall
function generateShapes(gl){
	cube = createCube(gl); // Plain cube
    sphere = createSphere(gl); // Plain sphere
    grass = createTexturedCube(gl,grassPath,50,50); // Grass
    wall = createTexturedCube(gl,brickPath,5,3/2); // Wall section
    wallbottom = createTexturedCube(gl,brickPath,5,1/2); // Wall section
    walldoor = createTexturedCube(gl,brickPath,2,1); // Wall section
    paintdoor = createTexturedCube(gl,paintPath,2,1); // Inner wall section
    paintwindow = createTexturedCube(gl,paintPath,1/2,1/2); // Inner wall section
    wallwindow = createTexturedCube(gl,brickPath,1/2,1/2); // Wall section
    paint = createTexturedCube(gl,paintPath,5,3/2); // Inner wall section
    paintroof = createTexturedCube(gl,roofPath,5,5); // Roof
    paintbottom = createTexturedCube(gl,paintPath,5,1/2); // Inner wall section
    floor = createTexturedCube(gl,floorPath,5,5); // Carpet
    blackboard = createTexturedCube(gl,blackboardPath,1,1); // Blackboard
    wind = createTexturedCube(gl,windowPath,4,1/2); // Windows
    door = createTexturedCube(gl,doorPath,1,1,initialiseTextureMapping(1,1,1)); // Door
    disco = createTexturedCube(gl,discoPath,50,50); // Disco floor

    leg=createTexturedCube(gl,woodPath,1,1,initialiseTextureMapping(1,5,1)); // Chair leg
    tableleg=createTexturedCube(gl,tablePath,1,1,initialiseTextureMapping(1,7.5,1)); // Table leg
    tablesurface=createTexturedCube(gl,tablePath,1,1,initialiseTextureMapping(8,1,8)); // Table surface
    back=createTexturedCube(gl,woodPath,1,1,initialiseTextureMapping(1,7,5)); // Chair back
    seat=createTexturedCube(gl,woodPath,1,1,initialiseTextureMapping(5,1,5)); // Chair seat
}

//Function for drawing a sphere. From Shadow_highp_sphere.js in Chapter 10.
function createSphere(gl){
    var SPHERE_DIV = 15;

    var i, ai, si, ci;
    var j, aj, sj, cj;
    var p1, p2;

    var vertices = [];
    var indices = [];

    // Generate coordinates
    for (j = 0; j <= SPHERE_DIV; j++) {
        aj = j * Math.PI / SPHERE_DIV;
        sj = Math.sin(aj);
        cj = Math.cos(aj);
        for (i = 0; i <= SPHERE_DIV; i++) {
            ai = i * 2 * Math.PI / SPHERE_DIV;
            si = Math.sin(ai);
            ci = Math.cos(ai);

            vertices.push(si * sj);  // X
            vertices.push(cj);       // Y
            vertices.push(ci * sj);  // Z
        }
    }

    // Generate indices
    for (j = 0; j < SPHERE_DIV; j++) {
        for (i = 0; i < SPHERE_DIV; i++) {
            p1 = j * (SPHERE_DIV+1) + i;
            p2 = p1 + (SPHERE_DIV+1);

            indices.push(p1);
            indices.push(p2);
            indices.push(p1 + 1);

            indices.push(p1 + 1);
            indices.push(p2);
            indices.push(p2 + 1);
        }
    }

    var s = []; // Utilize Object object to return multiple buffer objects together
    // Write vertex information to buffer object
    s.isTexture=false;
    s.vertexBuffer = initArrayBufferForLaterUse(gl, new Float32Array(vertices), 3, gl.FLOAT);
    s.normalBuffer = initArrayBufferForLaterUse(gl, new Float32Array(vertices), 3, gl.FLOAT);
    s.indexBuffer = initElementArrayBufferForLaterUse(gl, new Uint8Array(indices), gl.UNSIGNED_BYTE);
    if (!s.vertexBuffer || !s.normalBuffer || !s.indexBuffer) return null;

    s.num_vertices = indices.length;
    s.drawtype = gl.TRIANGLES;

    return s;
}

//Function for drawing a cube. Modified from BlendedCube.js in chapter 10
function createCube(gl) {
    var cube = [];
    // Coordinates Cube which length of one side is 1 with the origin on the center of the bottom)
    var vertices = new Float32Array([
        0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5,  0.5, 0.0, 0.5, // v0-v1-v2-v3 front
        0.5, 1.0, 0.5,  0.5, 0.0, 0.5,  0.5, 0.0,-0.5,  0.5, 1.0,-0.5, // v0-v3-v4-v5 right
        0.5, 1.0, 0.5,  0.5, 1.0,-0.5, -0.5, 1.0,-0.5, -0.5, 1.0, 0.5, // v0-v5-v6-v1 up
       -0.5, 1.0, 0.5, -0.5, 1.0,-0.5, -0.5, 0.0,-0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
       -0.5, 0.0,-0.5,  0.5, 0.0,-0.5,  0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
        0.5, 0.0,-0.5, -0.5, 0.0,-0.5, -0.5, 1.0,-0.5,  0.5, 1.0,-0.5  // v4-v7-v6-v5 back
    ]);

    // Normal
    var normals = new Float32Array([
        0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
       -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
    ]);

    // Indices of the vertices
    var indices = new Uint8Array([
         0, 1, 2,   0, 2, 3,    // front
         4, 5, 6,   4, 6, 7,    // right
         8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
    ]);

    cube.vertexBuffer = initArrayBufferForLaterUse(gl,vertices,3,gl.FLOAT);
    cube.normalBuffer = initArrayBufferForLaterUse(gl,normals,3,gl.FLOAT);
    cube.indexBuffer = initElementArrayBufferForLaterUse(gl,indices,gl.STATIC_DRAW);
    cube.num_vertices = indices.length;
    cube.drawtype = gl.TRIANGLES;

    return cube;
}

//Function for drawing a textured cube. Modified from FramebufferObject.js in chapter 10
function createTexturedCube(gl,imagepath,xScale,yScale,shape) {
    var cube = createCube(gl);
    cube.isTexture=true;
    if(shape){
        var temp=shape;
    }else{
        var temp=[1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
                  0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
                  1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
                  1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
                  0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
                  0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0]     // v4-v7-v6-v5 back
    }
    for (var i=0;i<temp.length;i++){
        if (i%2==0){
            temp[i]*=xScale;
        }
        if (i%2==1){
            temp[i]*=yScale;
        }
    }
    texCoords = new Float32Array(temp);
    cube.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
    cube.texture = initTextures(gl,imagepath);// Set texture
    return cube;
}

//Initialise textures
function initTextures(gl, path) {
    var texture = gl.createTexture();  // Create a texture object

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,new Uint8Array([255, 0, 0, 255])); // red

    if (!texture) { console.log('Failed to create the texture object'); return false;}

    var image = new Image(); // Create the image object
    if (!image) { console.log('Failed to create the image object'); return false;}

    image.onload = function(){  // Tell the browser to load an image
        loadTexture(gl, texture, image);  // Register the event handler to be called on loading an image
    };

    image.src = path;
    return texture;
}

//Load texture
function loadTexture(gl, texture, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    gl.activeTexture(gl.TEXTURE0);  // Enable texture unit0
    gl.bindTexture(gl.TEXTURE_2D, texture); // Bind the texture object to the target
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);  // Set the texture parameters
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);  // Set the texture image
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.uniform1i(program.u_Sampler, 0);  // Set the texture unit 0 to the sampler
}

//Map the textures so that no distortion occurs to the texture when the object is scaled
function initialiseTextureMapping(x,y,z){
    xtop=x/Math.max(x,y,z);
    ytop=y/Math.max(x,y,z);
    ztop=z/Math.max(x,y,z);
    return [xtop,ytop,    0,ytop,      0,0,      xtop,0,  // v0-v1-v2-v3 front
            0,ytop,      0,0,      ztop,0,    ztop,ytop,  // v0-v3-v4-v5 right
            xtop,0,    xtop,ztop,  0,ztop,    0,0,    // v0-v5-v6-v1 up
            0,ytop,    ztop,ytop,      ztop,0,      0,0,  // v1-v6-v7-v2 left
            0,0,      xtop,0,    xtop,ztop,  0,ztop,  // v7-v4-v3-v2 down
            0,0,      xtop,0,    xtop,ytop,    0,ytop];
}

//Initialise a buffer
function initAttributeVariable(gl, a_attribute, buffer) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
}

//Initialise a buffer
function initElementArrayBufferForLaterUse(gl, data, type) {
    var buffer = gl.createBuffer();　  // Create a buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    buffer.type = type;
    return buffer;
}

//Initialise a buffer
function initArrayBufferForLaterUse(gl, data, num,type) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    buffer.num = num;
    buffer.type = type;
    return buffer;
}

function pushMatrix(m) { // Store the specified matrix to the array
    var m2 = new Matrix4(m);
    matrixStack.push(m2);
}

function popMatrix() { // Retrieve the matrix from the array
    return matrixStack.pop();
}

//Draw the scene
function draw(gl) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(program.u_Alpha,1);
    g_modelMatrix.setIdentity();

    drawEntities(gl);
    drawGrass(gl);
    drawObjectsInRoom(gl);
    drawBuilding(gl);
    drawGlass(gl);
}

//Chair
function drawChair(gl,x,y){
    pushMatrix(g_modelMatrix);
        g_modelMatrix.setTranslate(x,0,y);

        pushMatrix(g_modelMatrix);
            g_modelMatrix.scale(1,5,1);
            pushMatrix(g_modelMatrix);
                g_modelMatrix.translate(2, 0,-2);
                drawObject(gl, leg);
            g_modelMatrix = popMatrix();

            pushMatrix(g_modelMatrix);
                g_modelMatrix.translate(2, 0,2);
                drawObject(gl, leg);
            g_modelMatrix = popMatrix();

            pushMatrix(g_modelMatrix);
                g_modelMatrix.translate(-2, 0,2);
                drawObject(gl, leg);
            g_modelMatrix = popMatrix();

            pushMatrix(g_modelMatrix);
                g_modelMatrix.translate(-2, 0,-2);
                drawObject(gl, leg);
            g_modelMatrix = popMatrix();
        g_modelMatrix = popMatrix();

        pushMatrix(g_modelMatrix);
            g_modelMatrix.translate(0, 5,0);
            g_modelMatrix.scale(5,1,5);
            drawObject(gl, seat);
        g_modelMatrix = popMatrix();

        pushMatrix(g_modelMatrix);
            g_modelMatrix.translate(2,6,0);
            g_modelMatrix.scale(1,7,5);
            drawObject(gl, back);
        g_modelMatrix = popMatrix();

    g_modelMatrix = popMatrix();
}

//Table
function drawTable(gl,x,y){
    pushMatrix(g_modelMatrix);
        g_modelMatrix.setTranslate(x, 0,y);

        pushMatrix(g_modelMatrix);
            g_modelMatrix.scale(1, 7.5, 1);
            g_modelMatrix.translate(3.5, 0,3.5);
            drawObject(gl,tableleg);
        g_modelMatrix = popMatrix();

        pushMatrix(g_modelMatrix);
            g_modelMatrix.scale(1, 7.5, 1);
            g_modelMatrix.translate(-3.5, 0,3.5);
            drawObject(gl,tableleg);
        g_modelMatrix = popMatrix();

        pushMatrix(g_modelMatrix);
            g_modelMatrix.scale(1, 7.5, 1);
            g_modelMatrix.translate(3.5, 0,-3.5);
            drawObject(gl,tableleg);
        g_modelMatrix = popMatrix();

        pushMatrix(g_modelMatrix);
            g_modelMatrix.scale(1, 7.5, 1);
            g_modelMatrix.translate(-3.5, 0,-3.5);
            drawObject(gl,tableleg);
        g_modelMatrix = popMatrix();

        pushMatrix(g_modelMatrix);
            g_modelMatrix.scale(8, 1, 8);
            g_modelMatrix.translate(0, 7.5,0);
            drawObject(gl,tablesurface);
        g_modelMatrix = popMatrix();

    g_modelMatrix = popMatrix();
}

//Fan
function drawFan(gl){
    pushMatrix(g_modelMatrix);

        pushMatrix(g_modelMatrix);
            g_modelMatrix.rotate(fanAngle,0,1,0);
            g_modelMatrix.translate(0, 28.8,0);
            g_modelMatrix.scale(2,2,2);
            drawObject(gl, cube);
        g_modelMatrix=popMatrix();

        pushMatrix(g_modelMatrix);
            g_modelMatrix.rotate(fanAngle,0,1,0);
            g_modelMatrix.translate(5, 29,0);
            g_modelMatrix.rotate(45,1,0,0);
            g_modelMatrix.scale(10,1,0.2);
            drawObject(gl, cube);
        g_modelMatrix=popMatrix();

        pushMatrix(g_modelMatrix);
            g_modelMatrix.rotate(fanAngle,0,1,0);
            g_modelMatrix.translate(-5, 29,0);
            g_modelMatrix.rotate(-45,1,0,0);
            g_modelMatrix.scale(10,1,0.2);
            drawObject(gl, cube);
        g_modelMatrix=popMatrix();

        pushMatrix(g_modelMatrix);
            g_modelMatrix.rotate(fanAngle,0,1,0);
            g_modelMatrix.translate(0, 29,5);
            g_modelMatrix.rotate(45,0,0,1);
            g_modelMatrix.scale(0.2,1,10);
            drawObject(gl, cube);
        g_modelMatrix=popMatrix();

        pushMatrix(g_modelMatrix);
            g_modelMatrix.rotate(fanAngle,0,1,0);
            g_modelMatrix.translate(0, 29,-5);
            g_modelMatrix.rotate(-45,0,0,1);
            g_modelMatrix.scale(0.2,1,10);
            drawObject(gl, cube);
        g_modelMatrix=popMatrix();
    g_modelMatrix=popMatrix();

    pushMatrix(g_modelMatrix);
            g_modelMatrix.setTranslate(50.5, 0,0);
            g_modelMatrix.translate(0, 0,-8.25);
            g_modelMatrix.rotate(doorAngle,0,1,0);
            g_modelMatrix.translate(0,0,8.25);
            g_modelMatrix.scale(0.5,20,16.5);
            drawObject(gl, door);
    g_modelMatrix=popMatrix();
}

//Grass
function drawGrass(gl){
	pushMatrix(g_modelMatrix);
        g_modelMatrix.scale(5000,0.01,5000);
        setGround(0,-500,500,-500,500);
        if(won){
        	drawObject(gl, disco);
        }else{
        	drawObject(gl, grass);
        }
    g_modelMatrix=popMatrix();
}

//Chairs, blackboard, tables, fan
function drawObjectsInRoom(gl){
	gl.vertexAttrib3f(program.a_Color,0.7,0.7,0.7);
    drawFan(gl);
    // Draw blackboard
    pushMatrix(g_modelMatrix);
        g_modelMatrix.setTranslate(-49.5, 5,0);
        g_modelMatrix.scale(0.5,20,28.75);
        drawObject(gl, blackboard);
    g_modelMatrix = popMatrix();
    //Draw tables and chairs
    for(var i = -1; i <= 2; i++){
        for(var j = -3; j <= 3; j++){
            if(j!=0){
                drawChair(gl,20*i,12*j);
                drawTable(gl,20*i-3.5,12*j);
            }
        }
    }
}

//Walls and floors of building
function drawBuilding(gl){
	//Draw floor and roof
    pushMatrix(g_modelMatrix);
        g_modelMatrix.setTranslate(0, 0.01,0);
        g_modelMatrix.scale(101,0.01,101);
        drawObject(gl, floor);
    g_modelMatrix = popMatrix();
    pushMatrix(g_modelMatrix);
        g_modelMatrix.setTranslate(0, 30,0);
        g_modelMatrix.scale(101,0.01,101);
        setGround(30,-50.5,50.5,-50.5,50.5);
        drawObject(gl, paintroof);
    g_modelMatrix = popMatrix();

    //Draw walls
    pushMatrix(g_modelMatrix);
        g_modelMatrix.setTranslate(50.5, 0,-29.5);
        g_modelMatrix.scale(0.5, 20, 42.5);
        drawObject(gl, walldoor);

        g_modelMatrix.setTranslate(50.5, 0,29.5);
        g_modelMatrix.scale(0.5, 20, 42.5);
        drawObject(gl, walldoor);

        g_modelMatrix.setTranslate(50, 0,-29.25);
        g_modelMatrix.scale(0.5, 20, 42);
        drawObject(gl, paintdoor);

        g_modelMatrix.setTranslate(50, 0,29.25);
        g_modelMatrix.scale(0.5, 20, 42);
        drawObject(gl, paintdoor);

        g_modelMatrix.setTranslate(-50.5, 0,0);
        g_modelMatrix.scale(0.5, 30, 101.5);
        drawObject(gl, wall);

        g_modelMatrix.setTranslate(-50, 0,0);
        g_modelMatrix.scale(0.5, 30, 100.5);
        drawObject(gl, paint);

        g_modelMatrix.setTranslate(45,10,50.5);
        g_modelMatrix.scale(10.5,10,0.5);
        drawObject(gl, wallwindow);

        g_modelMatrix.setTranslate(44.75,10,50);
        g_modelMatrix.scale(10,10,0.5);
        drawObject(gl, paintwindow);

        g_modelMatrix.setTranslate(-45,10,50.5);
        g_modelMatrix.scale(10.5,10,0.5);
        drawObject(gl, wallwindow);

        g_modelMatrix.setTranslate(-44.75,10,50);
        g_modelMatrix.scale(10,10,0.5);
        drawObject(gl, paintwindow);

        g_modelMatrix.setTranslate(45,10,-50.5);
        g_modelMatrix.scale(10.5,10,0.5);
        drawObject(gl, wallwindow);

        g_modelMatrix.setTranslate(44.75,10,-50);
        g_modelMatrix.scale(10,10,0.5);
        drawObject(gl, paintwindow);

        g_modelMatrix.setTranslate(-45,10,-50.5);
        g_modelMatrix.scale(10.5,10,0.5);
        drawObject(gl, wallwindow);

        g_modelMatrix.setTranslate(-44.75,10,-50);
        g_modelMatrix.scale(10,10,0.5);
        drawObject(gl, paintwindow);

        g_modelMatrix.setTranslate(0,0,50.5);
        g_modelMatrix.scale(100.5,10,0.5);
        drawObject(gl, wallbottom);

        g_modelMatrix.setTranslate(0,0,50);
        g_modelMatrix.scale(99.5,10,0.5);
        drawObject(gl, paintbottom);

        g_modelMatrix.setTranslate(0,0,-50.5);
        g_modelMatrix.scale(100.5,10,0.5);
        drawObject(gl, wallbottom);

        g_modelMatrix.setTranslate(0,0,-50);
        g_modelMatrix.scale(99.5,10,0.5);
        drawObject(gl, paintbottom);

        g_modelMatrix.setTranslate(50.5, 20,0);
        g_modelMatrix.scale(0.5, 10, 101.5);
        drawObject(gl, wallbottom);

        g_modelMatrix.setTranslate(50, 20,0);
        g_modelMatrix.scale(0.5, 10, 100.5);
        drawObject(gl, paintbottom);

        g_modelMatrix.setTranslate(0,20,50.5);
        g_modelMatrix.scale(100.5,10,0.5);
        drawObject(gl, wallbottom);

        g_modelMatrix.setTranslate(0,20,50);
        g_modelMatrix.scale(99.5,10,0.5);
        drawObject(gl, paintbottom);

        g_modelMatrix.setTranslate(0,20,-50.5);
        g_modelMatrix.scale(100.5,10,0.5);
        drawObject(gl, wallbottom);

        g_modelMatrix.setTranslate(0,20,-50);
        g_modelMatrix.scale(99.5,10,0.5);
        drawObject(gl, paintbottom);
    g_modelMatrix = popMatrix();
}

//Entities
function drawEntities(gl){
	for(var i=0; i<entities.length; i++){
		gl.vertexAttrib3f(program.a_Color,entities[i].colour[0],entities[i].colour[1],entities[i].colour[2]);
		pushMatrix(g_modelMatrix);
	        g_modelMatrix.translate(entities[i].position[0],entities[i].position[1]+entities[i].height,entities[i].position[2]);
	        g_modelMatrix.scale(entities[i].size,entities[i].size,entities[i].size);
	        if(entities[i].type=='sphere'){
	        	drawObject(gl,sphere);
	        }else{
	        	drawObject(gl,cube);
	        }
	    g_modelMatrix=popMatrix();
	}
}

//Since drawing order is important with transparency, sometimes one window is drawn first, sometimes the other one
function drawGlass(gl){
    gl.uniform1f(program.u_Alpha,0.5);
    pushMatrix(g_modelMatrix);
        if(self.position[2]>0){
            g_modelMatrix.translate(0,10,-50.5);
            g_modelMatrix.scale(79.5,10,0.5);
            drawObject(gl,wind);
            g_modelMatrix.setTranslate(0,10,50.5);
            g_modelMatrix.scale(79.5,10,0.5);
            drawObject(gl,wind);
        }else{
            g_modelMatrix.translate(0,10,50.5);
            g_modelMatrix.scale(79.5,10,0.5);
            drawObject(gl,wind);
            g_modelMatrix.setTranslate(0,10,-50.5);
            g_modelMatrix.scale(79.5,10,0.5);
            drawObject(gl,wind);
        }
    g_modelMatrix=popMatrix();
    gl.uniform1f(program.u_Alpha,1);
}

//Method for drawing objects
function drawObject(gl, shape) {
    initAttributeVariable(gl, program.a_Normal, shape.normalBuffer);
    initAttributeVariable(gl, program.a_Position, shape.vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shape.indexBuffer);

    g_mvpMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 2000.0);
    g_mvpMatrix.lookAt(self.position[0], self.position[1]+self.height, self.position[2], self.position[0]+self.look[0], self.position[1]+self.height+self.look[1], self.position[2]+self.look[2], 0, 1, 0);
    g_mvpMatrix.multiply(g_modelMatrix);var g_normalMatrix = new Matrix4();  // Coordinate transformation matrix for normals
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();

    gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
    gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);

    if (shape.isTexture) {
        gl.uniform1i(program.u_isTexture, true);
        initAttributeVariable(gl, program.a_TexCoord, shape.texCoordBuffer);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, shape.texture);
    }
    gl.drawElements(shape.drawtype, shape.num_vertices, gl.UNSIGNED_BYTE, 0);
    gl.disableVertexAttribArray(program.a_TexCoord);
    gl.uniform1i(program.u_isTexture, false);
}

// From http://www.michaelbromley.co.uk/blog/90/simple-1d-noise-in-javascript
function Simple1DNoise() {
    var MAX_VERTICES = 256;
    var MAX_VERTICES_MASK = MAX_VERTICES -1;
    var amplitude = 1;
    var scale = 0.08;

    var r = [];

    for ( var i = 0; i < MAX_VERTICES; ++i ) {
        r.push(Math.random());
    }

    var getVal = function( x ){
        var scaledX = x * scale;
        var xFloor = Math.floor(scaledX);
        var t = scaledX - xFloor;
        var tRemapSmoothstep = t * t * ( 3 - 2 * t );

        /// Modulo using &
        var xMin = xFloor & MAX_VERTICES_MASK;
        var xMax = ( xMin + 1 ) & MAX_VERTICES_MASK;

        var y = lerp( r[ xMin ], r[ xMax ], tRemapSmoothstep );

        return y * amplitude;
    };

    /**
    * Linear interpolation function.
    * @param a The lower integer value
    * @param b The upper integer value
    * @param t The value between the two
    * @returns {number}
    */
    var lerp = function(a, b, t ) {
        return a * ( 1 - t ) + b * t;
    };

    // return the API
    return {
        getVal: getVal,
        setAmplitude: function(newAmplitude) {
            amplitude = newAmplitude;
        },
        setScale: function(newScale) {
            scale = newScale;
        }
    };
};
