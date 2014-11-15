/* variables */
var lab = {
	seed:Math.random(),
	graph:{
		"-1":[],
		"0":[],
		"1":[]
	},
	player:{
		location:{},
		visibility:9,
		litVisibility:7,
		treasure:0
	},
	clicked:0
};

var data = {
	nodes:{
		size:24,
		nodeTypes:{},
		floorTypes:{}
	}
}

/* setup */
function preload(){
	initialiseData();
}
function setup(){
	randomSeed(lab.seed);
	noiseSeed(lab.seed);
	
	lab.player.location = {
		y:0,
		x:0
	}
	for (var y=-1;y<=1;y++){
		for (var x=-1;x<=1;x++){
			generateNode(y,x,"open");
		}
	}
	explore();
	
	createCanvas(windowWidth,windowHeight);
	background(0);
}
function initialiseData(){
	lab.player.img = loadImage("spritePack/Sliced/creatures_24x24/oryx_16bit_fantasy_creatures_01.png")
	
	data.nodes.floorTypes.earth = new FloorType(
		"Earth",
		loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_65.png"),
		loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_179.png")
	);
	data.nodes.floorTypes.stone0 = new FloorType(
		"Stone",
		loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_1443.png"),
		loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_1440.png")
	);
	data.nodes.floorTypes.stone1 = new FloorType(
		"Stone",
		loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_1384.png"),
		loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_1381.png")
	);
	data.nodes.floorTypes.stone2 = new FloorType(
		"Stone",
		loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_1385.png"),
		loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_1382.png")
	);
	data.nodes.floorTypes.stone3 = new FloorType(
		"Stone",
		loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_1386.png"),
		loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_1383.png")
	);
	data.nodes.floorTypes.stone4 = new FloorType(
		"Stone",
		loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_1442.png"),
		loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_1439.png")
	);
	
	data.nodes.wallImages = [[
		/*[ //bright grey
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_125.png"), //single
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_126.png"), //right
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_127.png"), //left-right
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_128.png"), //left
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_129.png"), //down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_130.png"), //up-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_131.png"), //up
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_132.png"), //right-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_133.png"), //left-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_134.png"), //up-right
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_135.png"), //up-left
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_136.png"), //up-down-left-right
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_137.png"), //left-right-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_138.png"), //up-left-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_139.png"), //up-right-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_140.png")  //up-left-right
		],*/
		[ //dull yellow
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_695.png"), //single
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_696.png"), //right
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_697.png"), //left-right
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_698.png"), //left
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_699.png"), //down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_700.png"), //up-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_701.png"), //up
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_702.png"), //right-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_703.png"), //left-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_704.png"), //up-right
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_705.png"), //up-left
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_706.png"), //up-down-left-right
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_707.png"), //left-right-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_708.png"), //up-left-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_709.png"), //up-right-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_710.png")  //up-left-right
		],
		[ //bright grey
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_125.png"), //single
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_126.png"), //right
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_127.png"), //left-right
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_128.png"), //left
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_129.png"), //down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_130.png"), //up-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_131.png"), //up
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_132.png"), //right-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_133.png"), //left-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_134.png"), //up-right
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_135.png"), //up-left
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_136.png"), //up-down-left-right
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_137.png"), //left-right-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_138.png"), //up-left-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_139.png"), //up-right-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_140.png")  //up-left-right
		]
		/*[ //Bright yellow
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_182.png"), //single
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_183.png"), //right
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_184.png"), //left-right
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_185.png"), //left
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_186.png"), //down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_187.png"), //up-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_188.png"), //up
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_189.png"), //right-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_190.png"), //left-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_191.png"), //up-right
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_192.png"), //up-left
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_193.png"), //up-down-left-right
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_194.png"), //left-right-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_195.png"), //up-left-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_196.png"), //up-right-down
			loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_197.png")  //up-left-right
		]*/
	]]

	data.nodes.treasure = loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_261.png");
	data.nodes.treasureOpened = loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_264.png");
	
	data.nodes.nodeTypes.open = new NodeType(true,data.nodes.floorTypes.earth,false);
	data.nodes.nodeTypes.stone0 = new NodeType(true,data.nodes.floorTypes.stone0,false);
	data.nodes.nodeTypes.stone1 = new NodeType(true,data.nodes.floorTypes.stone1,false);
	data.nodes.nodeTypes.stone2 = new NodeType(true,data.nodes.floorTypes.stone2,false);
	data.nodes.nodeTypes.stone3 = new NodeType(true,data.nodes.floorTypes.stone3,false);
	data.nodes.nodeTypes.stone4 = new NodeType(true,data.nodes.floorTypes.stone4,false);
	data.nodes.nodeTypes.wall = new NodeType(false,false,0);
}

/* constructors */
function Node(location,nodeType,contains){
	this.location = location;
	this.nodeType = nodeType;
	this.contains = contains;
}
function NodeType(traversable,floor,wall){
	this.traversable = traversable;
	this.floor = floor;
	this.wall = wall;
}
function FloorType(name,img,imgVisible){
	this.name = name;
	this.img = img;
	this.imgVisible = imgVisible;
}

/* drawing */
function draw(){
	//clear
	fill(0);
	rect(0,0,windowWidth,windowHeight);
	
	drawGraph();
	drawVisible();
	drawPlayer();
	drawScore();
}
function drawGraph(){
	for (var row in lab.graph){
		for (var node in lab.graph[row]){
			drawNode(lab.graph[row][node]);
		}
	}
}
function drawNode(node){
	var offsetY = node.location.y - lab.player.location.y,
		offsetX = node.location.x - lab.player.location.x;
		
	if (node.nodeType.floor){
		image(node.nodeType.floor.img,windowWidth/2 + offsetX*data.nodes.size,windowHeight/2 + offsetY*data.nodes.size);
	} else if (node.nodeType.wall !== false){
		image(getWallImg(node.location.y,node.location.x,0),windowWidth/2 + offsetX*data.nodes.size,windowHeight/2 + offsetY*data.nodes.size);
	}
}
function drawVisible(){
	for (var i=(lab.player.litVisibility * -1) + lab.player.location.y; i<=lab.player.litVisibility + lab.player.location.y; i++){
		for (var j=(lab.player.visibility * -1) + lab.player.location.x; j<=lab.player.visibility + lab.player.location.x; j++){
			if (Math.floor(Math.sqrt(Math.pow(i - lab.player.location.y,2) + Math.pow(j - lab.player.location.x,2))) < lab.player.litVisibility){
				var node = lab.graph[i][j];
				var offsetY = node.location.y - lab.player.location.y,
					offsetX = node.location.x - lab.player.location.x;
					
				if (node.nodeType.floor){
					image(node.nodeType.floor.imgVisible,windowWidth/2 + offsetX*data.nodes.size,windowHeight/2 + offsetY*data.nodes.size);
				} else if (node.nodeType.wall !== false){
					image(getWallImg(node.location.y,node.location.x,1),windowWidth/2 + offsetX*data.nodes.size,windowHeight/2 + offsetY*data.nodes.size);
				}
				
				if (node.contains && node.contains.length > 0){
					for (var thing in node.contains){
						if (node.contains[thing] == "treasure") image(data.nodes.treasure,windowWidth/2 + offsetX*data.nodes.size,windowHeight/2 + offsetY*data.nodes.size)
						if (node.contains[thing] == "treasureOpened") image(data.nodes.treasureOpened,windowWidth/2 + offsetX*data.nodes.size,windowHeight/2 + offsetY*data.nodes.size)
					}
				}
			}
		}
	}
}
function drawPlayer(){
	image(lab.player.img,windowWidth/2,windowHeight/2);
}
function drawScore(){
	stroke(255);
	fill(255);
	textSize(18);
	text("Treasure: " + lab.player.treasure,20,38)
}

function getWallImg(y,x,set){
	var node = lab.graph[y][x];
	var wallType = 0;
	if (isWall(y-1,x)){ //up
		if (isWall(y,x+1)){ //right
			if (isWall(y+1,x)){ //down
				if (isWall(y,x-1)){ //left
					wallType = 11; //=up-right-down-left
				} else {
					wallType = 14; //=up-right-down
				}
			} else if (isWall(y,x-1)){
				wallType = 15; //up-right-left
			} else {
				wallType = 9; //up-right
			}
		} else if (isWall(y+1,x)){ //down
			if (isWall(y,x-1)){ //left
				wallType = 13; //=up-down-left
			} else {
				wallType = 5; //=up-down
			}
		} else if (isWall(y,x-1)){ //left
			wallType = 10; //=up-left
		} else {
			wallType = 6; //=up
		}
	} else if (isWall(y,x+1)){ //right
		if (isWall(y+1,x)){ //down
			if (isWall(y,x-1)){ //left
				wallType = 12; //=right-down-left
			} else {
				wallType = 7; //=right-down
			}
		} else if (isWall(y,x-1)){ //left
			wallType = 2; //=right-left
		} else {
			wallType = 1; //=right
		}
	} else if (isWall(y+1,x)){ //down
		if (isWall(y,x-1)){ //left
			wallType = 8; //=down-left
		} else {
			wallType = 4; //=down
		}
	} else if (isWall(y,x-1)){ //left
		wallType = 3; //=left
	}
	return data.nodes.wallImages[node.nodeType.wall][set][wallType];
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        move(-1,0);
    } else if (keyCode === DOWN_ARROW) {    
        move(1,0);
    } else if (keyCode === LEFT_ARROW) {
        move(0,-1);
    } else if (keyCode === RIGHT_ARROW) {
        move(0,1);
    }
	return false;
}
function mouseClicked(){
	var w = windowWidth;
	var h = windowHeight;
	var y = mouseY;
	var x = mouseX;

	if (y < h/2){
		if (x < w/2){
			if (x/w < y/h){
				move(0,-1);
			} else {
				move(-1,0);
			}
		} else {
			if ((w-x)/w < y/h){
				move(0,1);
			} else {
				move(-1,0);
			}
		}
	} else {
		if (x < w/2){
			if (x/w < (h-y)/h){
				move(0,-1);
			} else {
				move(1,0);
			}
		} else {
			if ((w-x)/w < (h-y)/h){
				move(0,1);
			} else {
				move(1,0);
			}
		}
	}
}

function move(dy,dx){
	if (!isWall(lab.player.location.y + dy,lab.player.location.x + dx)){
		lab.player.location.y += dy;
		lab.player.location.x += dx;
		explore();
		
		var c = lab.graph[lab.player.location.y][lab.player.location.x].contains;
		if (c.indexOf("treasure") > -1){
			c[c.indexOf("treasure")] = "treasureOpened";
			lab.player.treasure += 100;
		}
	}
}
function isWall(y,x){
	if (typeof lab.graph[y] == "undefined" || typeof lab.graph[y][x] == "undefined" || typeof lab.graph[y][x].nodeType == "undefined") return false;
	if (lab.graph[y][x].nodeType.wall === false) return false;
	return true;
}
function explore(){
	for (var i=(lab.player.visibility * -1) + lab.player.location.y; i<=lab.player.visibility + lab.player.location.y; i++){
		if (typeof lab.graph[i] == "undefined") lab.graph[i] = [];
		for (var j=(lab.player.visibility * -1) + lab.player.location.x; j<=lab.player.visibility + lab.player.location.x; j++){
			if (Math.floor(Math.sqrt(Math.pow(i - lab.player.location.y,2) + Math.pow(j - lab.player.location.x,2))) < lab.player.visibility){
				if (typeof lab.graph[i][j] == "undefined"){
					generateNode(i,j,false);
				}
			}
		}
	}
}

function generateNode(y,x,force){
	lab.graph[y][x] = new Node({y:y,x:x},data.nodes.nodeTypes[getNodeType(y,x,force)],[]);
	lab.graph[y][x].contains = generateContents(y,x);
}
function getNodeType(y,x,force){
	if (force == "open") return getOpenSpace();
	if (force == "wall") return getWall();
	
	if (noise(y, x) < 0.3) return getWall();
	return getOpenSpace();
}
function getOpenSpace(){
	var arr = [
		"stone0","stone0","stone0","stone0",
		"stone0","stone0","stone0","stone0",
		"stone0","stone0","stone0","stone0",
		"stone1","stone2","stone3","stone4"
	];
	var index = Math.floor(random() * arr.length);
	return arr[index];
}
function getWall(){
	return "wall";
}
function generateContents(y,x){
	if (isWall(y,x)){
		return [];
	} else {
		var contents = [];
		
		var r = random();
		if (r < 0.005) contents.push("treasure");
		
		return contents;
	}
}