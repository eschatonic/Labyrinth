/* variables */
var lab = {
	running:true,
	autoSave:0,
	seed:Math.random(),
	caveGen:true,
	graph:{
		"-1":[],
		"0":[],
		"1":[]
	},
	graphStore:[],
	player:{
		location:{
			y:0,
			x:0
		},
		level:1,
		visibility:10,
		litVisibility:8,
		maxLitVisibility:10,
		treasure:0,
		health:5,
		healthMax:5
	},
	enemies:[
	],
	highScore:{
		treasure:0,
		level:0
	}
};

var data = {
	nodes:{
		size:24,
		nodeTypes:{},
		floorTypes:{}
	},
	enemies:{},
	hud:{}
}

/* setup */
function preload(){
	loadGame();
	initialiseData();
	createCanvas(windowWidth,windowHeight);
	background(0);
}
function setup(level,wentDown){
	randomSeed(lab.seed * lab.player.level);
	noiseSeed(lab.seed * lab.player.level);
	textAlign(LEFT);
	imageMode(CENTER);
	
	if (typeof level == "undefined" || level > lab.graphStore.length){
		if (typeof level == "undefined"){
			//reset player details
			lab.player.location = {
				y:0,
				x:0
			};
			lab.player.level = 1;
			lab.player.treasure = 0;
			lab.player.health = 5;
			lab.player.healthMax = 5;
			lab.player.visibility = 10;
			lab.player.litVisibility = 8;
		}
		
		lab.graph = [];
		lab.graph[lab.player.location.y-1] = [];
		lab.graph[lab.player.location.y] = [];
		lab.graph[lab.player.location.y+1] = [];
		
		lab.enemies = [];
		for (var y=-1;y<=1;y++){
			for (var x=-1;x<=1;x++){
				generateNode(y + lab.player.location.y,x + lab.player.location.x,"open");
			}
		}
		if (lab.player.level > 1){
			lab.graph[lab.player.location.y][lab.player.location.x].contains = ["stairsUp"];
		}
		explore();
	} else {
		lab.graph = lab.graphStore[level-1][0];
		lab.enemies = lab.graphStore[level-1][1];
		
		if (wentDown){
			if (typeof lab.graph[lab.player.location.y] == "undefined") lab.graph[lab.player.location.y] = [];
			if (typeof lab.graph[lab.player.location.y-1] == "undefined") lab.graph[lab.player.location.y-1] = [];
			if (typeof lab.graph[lab.player.location.y+1] == "undefined") lab.graph[lab.player.location.y+1] = [];		

			for (var y=-1;y<=1;y++){
					for (var x=-1;x<=1;x++){
						generateNode(y + lab.player.location.y,x + lab.player.location.x,"open");
					}
				}
			if (lab.player.level > 1){
				lab.graph[lab.player.location.y][lab.player.location.x].contains = ["stairsUp"];
			}
			explore();
		}
	}
}
function initialiseData(){
	lab.player.img = loadImage("spritePack/Sliced/creatures_24x24/oryx_16bit_fantasy_creatures_01.png")
	
	//parchment = loadImage("parchment_alpha.png")
	
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
	]]

	data.nodes.treasure = loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_261.png");
	data.nodes.treasureOpened = loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_264.png");
	data.nodes.potion = loadImage("spritePack/Sliced/items_16x16/oryx_16bit_fantasy_items_09.png");
	data.nodes.lantern = loadImage("spritePack/Sliced/items_16x16/oryx_16bit_fantasy_items_148.png");
	data.nodes.lanternEmpty = loadImage("spritePack/Sliced/items_16x16/oryx_16bit_fantasy_items_147.png");
	
	data.nodes.rubble0 = loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_90.png");
	data.nodes.rubble1 = loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_91.png");
	data.nodes.rubble2 = loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_92.png");
	data.nodes.rubble3 = loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_93.png");
	data.nodes.rubble4 = loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_94.png");
	
	data.nodes.stairsDown = loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_67.png");
	data.nodes.stairsUp = loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_66.png");
	data.nodes.stairsDownVis = loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_181.png");
	data.nodes.stairsUpVis = loadImage("spritePack/Sliced/world_24x24/oryx_16bit_fantasy_world_180.png");
	
	data.nodes.nodeTypes.open = new NodeType(true,data.nodes.floorTypes.earth,false);
	data.nodes.nodeTypes.stone0 = new NodeType(true,data.nodes.floorTypes.stone0,false);
	data.nodes.nodeTypes.stone1 = new NodeType(true,data.nodes.floorTypes.stone1,false);
	data.nodes.nodeTypes.stone2 = new NodeType(true,data.nodes.floorTypes.stone2,false);
	data.nodes.nodeTypes.stone3 = new NodeType(true,data.nodes.floorTypes.stone3,false);
	data.nodes.nodeTypes.stone4 = new NodeType(true,data.nodes.floorTypes.stone4,false);
	data.nodes.nodeTypes.wall = new NodeType(false,false,0);
	
	data.enemies.zombie = {
		name:"Zombie",
		img:loadImage("spritePack/Sliced/creatures_24x24/oryx_16bit_fantasy_creatures_307.png"),
		health:3,
		treasure:25,
		move:function(){
			if (this.location.y == lab.player.location.y && this.location.x - lab.player.location.x >= -1 && this.location.x - lab.player.location.x <= 1){
				lab.player.health--;
			} else if (this.location.x == lab.player.location.x && this.location.y - lab.player.location.y >= -1 && this.location.y - lab.player.location.y <= 1){
				lab.player.health--;
			} else {
				var dir = Math.random();
				if (dir < 0.25){
					if (!isWall(this.location.y-1,this.location.x)){
						this.location.y--;
					}
				} else if (dir < 0.5){
					if (!isWall(this.location.y,this.location.x+1)){
						this.location.x++;
					}
				} else if (dir < 0.75){
					if (!isWall(this.location.y+1,this.location.x)){
						this.location.y++;
					}
				} else {
					if (!isWall(this.location.y,this.location.x-1)){
						this.location.x--;
					}
				}
			}
		}
	}
	data.enemies.skeleton = {
		name:"Skeleton",
		img:loadImage("spritePack/Sliced/creatures_24x24/oryx_16bit_fantasy_creatures_291.png"),
		health:4,
		treasure:50,
		move:function(){
			if (this.location.y == lab.player.location.y && this.location.x - lab.player.location.x >= -1 && this.location.x - lab.player.location.x <= 1){
				lab.player.health--;
			} else if (this.location.x == lab.player.location.x && this.location.y - lab.player.location.y >= -1 && this.location.y - lab.player.location.y <= 1){
				lab.player.health--;
			} else {
				var deltaY = lab.player.location.y - this.location.y;
				var deltaX = lab.player.location.x - this.location.x;
				var dest = {};
				if (Math.abs(deltaY) > Math.abs(deltaX)){
					dest.dy = deltaY / Math.abs(deltaY);
					dest.dx = 0;
				} else if (Math.abs(deltaY) == Math.abs(deltaX)) {
					var r = Math.random();
					if (r < 0.5){
						dest.dy = deltaY / Math.abs(deltaY);
						dest.dx = 0;
					} else {
						dest.dy = 0;
						dest.dx = deltaX / Math.abs(deltaX);
					}
				} else {
					dest.dy = 0;
					dest.dx = deltaX / Math.abs(deltaX);
				}
				
				if (!isWall(this.location.y + dest.dy, this.location.x + dest.dx)){
					this.location.y += dest.dy;
					this.location.x += dest.dx;
				} else {
					var dir = Math.random();
					if (dir < 0.25){
						if (!isWall(this.location.y-1,this.location.x)){
							this.location.y--;
						}
					} else if (dir < 0.5){
						if (!isWall(this.location.y,this.location.x+1)){
							this.location.x++;
						}
					} else if (dir < 0.75){
						if (!isWall(this.location.y+1,this.location.x)){
							this.location.y++;
						}
					} else {
						if (!isWall(this.location.y,this.location.x-1)){
							this.location.x--;
						}
					}
				}
			}
		}
	}
	data.enemies.ghost = {
		name:"Ghost",
		img:loadImage("spritePack/Sliced/creatures_24x24/oryx_16bit_fantasy_creatures_295.png"),
		health:2,
		treasure:75,
		move:function(){
			if (this.location.y == lab.player.location.y && this.location.x - lab.player.location.x >= -1 && this.location.x - lab.player.location.x <= 1){
				lab.player.health -= 2;
			} else if (this.location.x == lab.player.location.x && this.location.y - lab.player.location.y >= -1 && this.location.y - lab.player.location.y <= 1){
				lab.player.health -= 2;
			} else {
				var r = Math.random();
				if (r < 0.5){
					var dir = Math.random();
					if (dir < 0.25){
						this.location.y--;
					} else if (dir < 0.5){
						this.location.x++;
					} else if (dir < 0.75){
						this.location.y++;
					} else {
						this.location.x--;
					}
				} else {
					var deltaY = lab.player.location.y - this.location.y;
					var deltaX = lab.player.location.x - this.location.x;
					var dest = {};
					if (Math.abs(deltaY) > Math.abs(deltaX)){
						dest.dy = deltaY / Math.abs(deltaY);
						dest.dx = 0;
					} else if (Math.abs(deltaY) == Math.abs(deltaX)) {
						var r = Math.random();
						if (r < 0.5){
							dest.dy = deltaY / Math.abs(deltaY);
							dest.dx = 0;
						} else {
							dest.dy = 0;
							dest.dx = deltaX / Math.abs(deltaX);
						}
					} else {
						dest.dy = 0;
						dest.dx = deltaX / Math.abs(deltaX);
					}
					this.location.y += dest.dy;
					this.location.x += dest.dx;
				}
			}
		}
	}
	data.enemies.wraith = {
		name:"Wraith",
		img:loadImage("spritePack/Sliced/creatures_24x24/oryx_16bit_fantasy_creatures_294.png"),
		health:2,
		treasure:100,
		move:function(){
			if (this.location.y == lab.player.location.y && this.location.x - lab.player.location.x >= -1 && this.location.x - lab.player.location.x <= 1){
				lab.player.health -= 1;
				if (Math.random() < lab.player.litVisibility/lab.player.maxLitVisibility && lab.player.litVisibility >=0){
					lab.player.visibility--;
					lab.player.litVisibility--;
				}
			} else if (this.location.x == lab.player.location.x && this.location.y - lab.player.location.y >= -1 && this.location.y - lab.player.location.y <= 1){
				lab.player.health -= 1;
			} else {
				var r = Math.random();
				if (r < 0.5){
					var dir = Math.random();
					if (dir < 0.25){
						this.location.y--;
					} else if (dir < 0.5){
						this.location.x++;
					} else if (dir < 0.75){
						this.location.y++;
					} else {
						this.location.x--;
					}
				} else {
					var deltaY = lab.player.location.y - this.location.y;
					var deltaX = lab.player.location.x - this.location.x;
					var dest = {};
					if (Math.abs(deltaY) > Math.abs(deltaX)){
						dest.dy = deltaY / Math.abs(deltaY);
						dest.dx = 0;
					} else if (Math.abs(deltaY) == Math.abs(deltaX)) {
						var r = Math.random();
						if (r < 0.5){
							dest.dy = deltaY / Math.abs(deltaY);
							dest.dx = 0;
						} else {
							dest.dy = 0;
							dest.dx = deltaX / Math.abs(deltaX);
						}
					} else {
						dest.dy = 0;
						dest.dx = deltaX / Math.abs(deltaX);
					}
					this.location.y += dest.dy;
					this.location.x += dest.dx;
				}
			}
		}
	}
	
	data.hud.coin = loadImage("spritePack/Sliced/items_16x16/oryx_16bit_fantasy_items_75.png");
	data.hud.heart = loadImage("spritePack/Sliced/items_16x16/oryx_16bit_fantasy_items_85.png");
	data.hud.heartEmpty = loadImage("spritePack/Sliced/items_16x16/oryx_16bit_fantasy_items_87.png");
}

/* constructors */
function Node(location,nodeType,contains){
	this.location = location;
	this.nodeType = nodeType;
	this.contains = contains;
	this.explored = false;
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
function Enemy(model,y,x){
	this.name = model.name;
	this.img = model.img;
	this.health = model.health;
	this.treasure = model.treasure;
	this.move = model.move;
	this.location = {
		y:y,
		x:x
	}
}

/* drawing */
function draw(){
	if (lab.running){		
		//clear
		fill(0);
		stroke(0);
		rect(0,0,windowWidth,windowHeight);
		
		drawGraph();
		drawVisible();
		drawPlayer();
		drawEnemies();
		drawInterface();
		
		if (lab.player.health <= 0){
			gameOver();
		}
	}
}
function drawGraph(){
	for (var row in lab.graph){
		for (var node in lab.graph[row]){
			drawNode(lab.graph[row][node]);
		}
	}
}
function drawNode(node){
	if (node.explored){
		var offsetY = node.location.y - lab.player.location.y,
			offsetX = node.location.x - lab.player.location.x;
			
		if (node.nodeType.floor){
			image(node.nodeType.floor.img,windowWidth/2 + offsetX*data.nodes.size,windowHeight/2 + offsetY*data.nodes.size);
		} else if (node.nodeType.wall !== false){
			image(getWallImg(node.location.y,node.location.x,0),windowWidth/2 + offsetX*data.nodes.size,windowHeight/2 + offsetY*data.nodes.size);
		}
		
		if (node.contains && node.contains.length > 0){
			for (var thing in node.contains){
				if (node.contains[thing] == "stairsDown") image(data.nodes.stairsDown,windowWidth/2 + offsetX*data.nodes.size,windowHeight/2 + offsetY*data.nodes.size);
				if (node.contains[thing] == "stairsUp") image(data.nodes.stairsUp,windowWidth/2 + offsetX*data.nodes.size,windowHeight/2 + offsetY*data.nodes.size);
			}
		}
	}
}
function drawVisible(){
	var vis = Math.min(Math.max(lab.player.litVisibility - lab.player.level,0),lab.player.maxLitVisibility);
	for (var i=(vis * -1) + lab.player.location.y; i<=vis + lab.player.location.y; i++){
		for (var j=(vis * -1) + lab.player.location.x; j<=vis + lab.player.location.x; j++){
			if (isVisible(i,j)){
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
						if (node.contains[thing]) image(data.nodes[node.contains[thing]],windowWidth/2 + offsetX*data.nodes.size,windowHeight/2 + offsetY*data.nodes.size);
					}
				}
				
				if (node.explored == false) node.explored = true;
			}
		}
	}
}
function isVisible(nodeY,nodeX){
	if (Math.floor(Math.sqrt(Math.pow(nodeY - lab.player.location.y,2) + Math.pow(nodeX - lab.player.location.x,2))) < Math.min(Math.max(lab.player.litVisibility - lab.player.level,0),lab.player.maxLitVisibility)){
		
		var dy = nodeY - lab.player.location.y;
		var dx = nodeX - lab.player.location.x;
		if (dx == 0){
			var i = 0;
			var mag = dy / Math.abs(dy);
			while (i < Math.abs(dy)){
				if (isWall(lab.player.location.y + (i * mag),lab.player.location.x)){
					return false;
				}
				i++;
			}
		} else if (dy == 0){
			var i = 0;
			var mag = dx / Math.abs(dx);
			while (i < Math.abs(dx)){
				if (isWall(lab.player.location.y,lab.player.location.x + (i * mag))){
					return false;
				}
				i++;
			}
		} else {
			var sc = Math.abs(dy) + Math.abs(dx);
			var inY = 0;
			var inX = 0;
			var slY = dy/sc;
			var slX	= dx/sc;
			var sigY = slY / Math.abs(slY);
			var sigX = slX / Math.abs(slX);
			var ret = false;
			while (Math.abs(inY) < Math.abs(dy) && Math.abs(inX) < Math.abs(dx)){
				inY += slY;
				inX += slX;
				if (ret) return false;
				if (isWall(
					lab.player.location.y + sigY * Math.floor(Math.abs(inY)),
					lab.player.location.x + sigX * Math.floor(Math.abs(inX))
				)){
					ret = true;
				}
			}
		}
		return true;
	} else {
		return false;
	}
}
function drawPlayer(){
	image(lab.player.img,windowWidth/2,windowHeight/2);
}
function drawEnemies(){
	for (var enemy in lab.enemies){
		var e = lab.enemies[enemy];
		if (isVisible(e.location.y,e.location.x)){
			var offsetY = e.location.y - lab.player.location.y,
				offsetX = e.location.x - lab.player.location.x;
			image(lab.enemies[enemy].img,windowWidth/2 + offsetX*data.nodes.size,windowHeight/2 + offsetY*data.nodes.size);
		}
	}
}
function drawInterface(){
	stroke(255);
	fill(255);
	textSize(18);
	textAlign(LEFT);
	image(data.hud.coin,data.nodes.size,data.nodes.size/2 + 20);
	text(lab.player.treasure,20 + data.nodes.size,38);
	for (var i=1;i<=lab.player.healthMax;i++){
		if (i <= lab.player.health){
			image(data.hud.heart,windowWidth - 28 - (data.nodes.size * (i-1)),data.nodes.size/2 + 20);
		} else {
			image(data.hud.heartEmpty,windowWidth - 28 - (data.nodes.size * (i-1)),data.nodes.size/2 + 20);
		}
	}
	for (var i=1;i<=Math.ceil(lab.player.maxLitVisibility/2);i++){
		if (i <= Math.min(lab.player.litVisibility-lab.player.level,lab.player.maxLitVisibility)/2){
			image(data.nodes.lantern,windowWidth - 28 - (data.nodes.size * (i-1)),data.nodes.size * 1.5 + 20);
		} else {
			image(data.nodes.lanternEmpty,windowWidth - 28 - (data.nodes.size * (i-1)),data.nodes.size * 1.5 + 20);
		}
	}
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
    if (keyCode === UP_ARROW || keyCode === 87) {
        if (lab.running) move(-1,0);
    } else if (keyCode === DOWN_ARROW || keyCode === 83) {    
        if (lab.running) move(1,0);
    } else if (keyCode === LEFT_ARROW || keyCode === 65) {
        if (lab.running) move(0,-1);
    } else if (keyCode === RIGHT_ARROW || keyCode === 68) {
        if (lab.running) move(0,1);
    } else if (keyCode === RETURN) {
		handlePause();
	}
	return false;
}
function mouseClicked(){
	var w = windowWidth;
	var h = windowHeight;
	var y = mouseY;
	var x = mouseX;
	
	if (y < h/2 + data.nodes.size && y > h/2 - data.nodes.size && x < w/2 + data.nodes.size && x > w/2 - data.nodes.size){
		handlePause();
	} else {
		if (lab.running){
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
	}
}
function handlePause(){
	if (lab.running){
		pause(true);
	} else {
		if (lab.player.health > 0){
			unPause();
		} else {
			lab.seed = Math.random();
			setup();
			unPause();
		}
	}
}

function move(dy,dx){
	var e = isEnemy(lab.player.location.y + dy,lab.player.location.x + dx);
	if (e){
		e.health--;
		if (e.health <= 0){
			lab.player.treasure += e.treasure * lab.player.level;
			lab.enemies.splice(lab.enemies.indexOf(e),1);
		}
	} else if (!isWall(lab.player.location.y + dy,lab.player.location.x + dx)){
		lab.player.location.y += dy;
		lab.player.location.x += dx;
		explore();
		
		var c = lab.graph[lab.player.location.y][lab.player.location.x].contains;
		if (c.indexOf("treasure") > -1){
			c[c.indexOf("treasure")] = "treasureOpened";
			lab.player.treasure += 100 * lab.player.level;
		}
		if (c.indexOf("lantern") > -1){
			c[c.indexOf("lantern")] = "lanternEmpty";
			lab.player.visibility++;
			lab.player.litVisibility++;
		}
		if (c.indexOf("potion") > -1){
			c.splice(c.indexOf("potion"),1);
			lab.player.health = lab.player.healthMax;
		}
		if (c.indexOf("stairsUp") > -1){
			lab.graphStore[lab.player.level - 1] = [
				lab.graph,
				lab.enemies
			]
			lab.player.level--
			setup(lab.player.level,false);
		}
		if (c.indexOf("stairsDown") > -1){
			lab.graphStore[lab.player.level - 1] = [
				lab.graph,
				lab.enemies
			]
			lab.player.level++;
			setup(lab.player.level,true);
		}
	}
}
function isWall(y,x){
	if (typeof lab.graph[y] == "undefined" || typeof lab.graph[y][x] == "undefined" || typeof lab.graph[y][x].nodeType == "undefined") return false;
	if (lab.graph[y][x].nodeType.wall === false) return false;
	return true;
}
function isEnemy(y,x){
	for (var enemy in lab.enemies){
		if (y == lab.enemies[enemy].location.y && x == lab.enemies[enemy].location.x) return lab.enemies[enemy];
	}
	return false;
}

function explore(){
	var vis = Math.min(Math.max(lab.player.visibility - lab.player.level,0),lab.player.maxLitVisibility+2);
	for (var i=(vis * -1) + lab.player.location.y; i<=vis + lab.player.location.y; i++){
		if (typeof lab.graph[i] == "undefined") lab.graph[i] = [];
		for (var j=(vis * -1) + lab.player.location.x; j<=vis + lab.player.location.x; j++){
			if (Math.floor(Math.sqrt(Math.pow(i - lab.player.location.y,2) + Math.pow(j - lab.player.location.x,2))) < vis){
				if (typeof lab.graph[i][j] == "undefined"){
					generateNode(i,j,false);
				}
			}
		}
	}
}

function generateNode(y,x,force){
	var nodeType = getNodeType(y,x,force);
	lab.graph[y][x] = new Node({y:y,x:x},data.nodes.nodeTypes[nodeType[0]],[nodeType[1]]);
	lab.graph[y][x].contains = generateContents(lab.graph[y][x].contains,y,x);
}
function getNodeType(y,x,force){
	if (force == "open") return [getOpenSpace()];
	if (force == "wall") return [getWall()];
	
	if (lab.caveGen){
		//cave generation
		var square = caveGen(y,x);
		if (square[0] === "wall"){
			return [getWall()]
		} else {
			return [getOpenSpace(square[0]),square[1]];
		};
	} else {
		//noise generation
		if (noise(y, x) < 0.3) return [getWall()];
	}
	return [getOpenSpace()];
}

function caveGen(y,x){
	var output;
	var contains;
	var scaleFactor = 6;
	var n = noise(y/scaleFactor,x/scaleFactor);
	if (n > 0.44 && n < 0.5){ //midbands in heightmap -> walls
		if (random() > 0.1){ //add breaks in walls for traversability
			output = "wall";
		}
	} else {
		if ((n < 0.2) || (n >= 0.8)){ //peaks of heightmap -> centres of spaces
			output = "centre";
		} else if (n < 0.51 && n > 0.43){ //next to a wall
			output = "edge";
			contains = getRubble();
		} else {
			output = "none";
		}
	}
	if (contains){
		return [output,contains];
	} else {
		return [output];
	}
}

function getOpenSpace(spaceType){
	var arr = [
		"stone0","stone0","stone0","stone0",
		"stone0","stone0","stone0","stone0",
		"stone0","stone0","stone0","stone0",
		"stone1","stone2","stone3","stone4"
	];
	var index = Math.floor(random() * arr.length);
	return arr[index];
}
function getRubble(){
	var arr = ["rubble0","rubble1","rubble2","rubble3","rubble4"];
	var index = Math.floor(random() * arr.length);
	return arr[index];
}
function getWall(){
	return "wall";
}
function generateContents(contents,y,x){
	if (isWall(y,x)){
		return contents;
	} else {
		var r = random();
		if (r < 0.005){
			contents.push("treasure");
		} else if (r < 0.01){
			contents.push("potion");
		} else if (r < 0.02){
			createEnemy(y,x);
		} else if (r < 0.0205){
			contents.push("lantern");
		}
		
		var stairs = random();
		if (stairs < 0.0002 + (0.0002 / lab.player.level)){
			contents = ["stairsDown"];
		}
		
		return contents;
	}
}

function createEnemy(y,x){
	var r = Math.random();
	if (lab.player.level >= 2){
		if (lab.player.level >= 3){
			if (lab.player.level >= 4){
				if (r < 1/4){
					lab.enemies.push(new Enemy(data.enemies.zombie,y,x));
				} else if (r < 2/4){
					lab.enemies.push(new Enemy(data.enemies.skeleton,y,x));
				} else if (r < 3/4){
					lab.enemies.push(new Enemy(data.enemies.ghost,y,x));
				} else {
					lab.enemies.push(new Enemy(data.enemies.wraith,y,x));
				}
			} else {
				if (r < 1/3){
					lab.enemies.push(new Enemy(data.enemies.zombie,y,x));
				} else if (r < 2/3){
					lab.enemies.push(new Enemy(data.enemies.skeleton,y,x));
				} else {
					lab.enemies.push(new Enemy(data.enemies.ghost,y,x));
				}
			}
		} else {
			if (r < 0.5){
				lab.enemies.push(new Enemy(data.enemies.zombie,y,x));
			} else {
				lab.enemies.push(new Enemy(data.enemies.skeleton,y,x));
			}
		}
	} else {
		lab.enemies.push(new Enemy(data.enemies.zombie,y,x));
	}
}

window.setInterval(function(){
	if (lab.running){
		for (var enemy in lab.enemies){
			lab.enemies[enemy].move();
		}
	}
	lab.autoSave++
	if (lab.autoSave >= 60){
		lab.autoSave = 0;
		saveGame("auto");
	}
},1000);

function pause(message){
	lab.running = false;
	
	if (message){
		//var scalingFactor = Math.min(windowWidth * 0.8 / parchment.width, windowHeight * 0.8 / parchment.height);
		//image(parchment,windowWidth/2,windowHeight/2,parchment.width * scalingFactor,parchment.height * scalingFactor);
		
		noStroke();
		fill(0,155);
		rect(0,windowHeight/2 - 70,windowWidth,120);
		
		stroke(255);
		fill(255);
		textSize(40);
		textAlign(CENTER);
		text("PAUSED",windowWidth/2,windowHeight/2);
	}
}
function unPause(){
	lab.running = true;
}
function gameOver(){
	pause(false);
	
	var hs = false;
	if (lab.player.treasure > lab.highScore.treasure){
		lab.highScore.treasure = lab.player.treasure;
		lab.highScore.level = lab.player.level;
		hs = true;
	} else if (lab.player.treasure == lab.highScore.treasure){
		if (lab.player.level > lab.highScore.level){
			lab.highScore.level = lab.player.level;
			hs = true;
		}
	}
	
	noStroke();
	fill(0,155);
	rect(0,windowHeight/2 - 90,windowWidth,160);
	
	stroke(255);
	fill(255);
	textSize(40);
	textAlign(CENTER);
	text("YOU DIED",windowWidth/2,windowHeight/2 - 30);
	textSize(20);
	text("Level: " + lab.player.level + "  Treasure: " + lab.player.treasure,windowWidth/2,windowHeight/2 + 10);
	
	if (hs){
		text("NEW HIGH SCORE!",windowWidth/2,windowHeight/2 + 40);
	} else {
		text("High Score  -  Level: " + lab.highScore.level + "  Treasure: " + lab.highScore.treasure,windowWidth/2,windowHeight/2 + 40);
	}
	
	saveGame(false);
}

function saveGame(saveType){
	var save = lab.highScore;
	localStorage.setItem("Labyrinth",JSON.stringify(save));
}
function loadGame(){
	var save = JSON.parse(localStorage.getItem("Labyrinth"));
	if (typeof save !== "undefined" && save) lab.highScore = save;
}