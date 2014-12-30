var lab = {
	running:true,
	autoSave:0,
	seed:Math.random(),
	caveGen:true,
	graph:{"-1":[],"0":[],"1":[]},
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
	hud:{},
	pattern:{}
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