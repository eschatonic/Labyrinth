/* variables */
var lab = {
	seed:Math.random(),
	graph:[[]],
	player:{
		location:{},
		visibility:11,
		litVisibility:7
	}
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
	
	for (var i=-1; i<=1; i++){
		lab.graph[i] = [];
		for (var j=-1; j<=1; j++){
			lab.graph[i][j] = new Node({y:i,x:j},data.nodes.nodeTypes.open,[])
		}
	}
	lab.player.location = {
		y:0,
		x:0
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

	data.nodes.nodeTypes.open = new NodeType(true,data.nodes.floorTypes.earth)
	data.nodes.nodeTypes.wall = new NodeType(false,null);
}

/* constructors */
function Node(location,nodeType,contains){
	this.location = location;
	this.nodeType = nodeType;
	this.contains = contains;
}
function NodeType(traversable,floor){
	this.traversable = traversable;
	if (traversable) this.floor = floor;
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
				}
			}
		}
	}
}
function drawPlayer(){
	image(lab.player.img,windowWidth/2,windowHeight/2);
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
function mousePressed(){
	if (mouseY < windowHeight/2){
		if (mouseX < windowWidth/2){
			if (mouseX/windowWidth < mouseY/windowHeight){
				move(0,-1);
			} else {
				move(-1,0);
			}
		} else {
			if ((windowWidth-mouseX)/windowWidth < mouseY/windowHeight){
				move(0,1);
			} else {
				move(-1,0);
			}
		}
	} else {
		if (mouseX < windowWidth/2){
			if (mouseX/windowWidth < (windowHeight-mouseY)/windowHeight){
				move(0,-1);
			} else {
				move(1,0);
			}
		} else {
			if ((windowWidth-mouseX)/windowWidth < (windowHeight-mouseY)/windowHeight){
				move(0,1);
			} else {
				move(1,0);
			}
		}
	}
}
function move(dy,dx){
	lab.player.location.y += dy;
	lab.player.location.x += dx;
	explore();
}
function explore(){
	for (var i=(lab.player.visibility * -1) + lab.player.location.y; i<=lab.player.visibility + lab.player.location.y; i++){
		if (typeof lab.graph[i] == "undefined") lab.graph[i] = [];
		for (var j=(lab.player.visibility * -1) + lab.player.location.x; j<=lab.player.visibility + lab.player.location.x; j++){
			if (Math.floor(Math.sqrt(Math.pow(i - lab.player.location.y,2) + Math.pow(j - lab.player.location.x,2))) < lab.player.visibility){
				if (typeof lab.graph[i][j] == "undefined"){
					generateNode(i,j);
				}
			}
		}
	}
}
function generateNode(y,x){
	lab.graph[y][x] = new Node({y:y,x:x},data.nodes.nodeTypes.open,[])
}