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