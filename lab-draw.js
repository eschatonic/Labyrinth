/* drawing */
function clearScreen(){
	fill(0);
	stroke(0);
	rect(0,0,windowWidth,windowHeight);
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

function drawParticles(){
	for (var particle in lab.particles){
		var p = lab.particles[particle];
		var animation = data.particles[p.animType];
		if (isVisible(p.location.y,p.location.x)){
			var offsetY = p.location.y - lab.player.location.y,
				offsetX = p.location.x - lab.player.location.x;
			image(animation.images[animationFrame(animation,p)],windowWidth/2 + offsetX*data.nodes.size,windowHeight/2 + offsetY*data.nodes.size);
		}
		p.timer++;
		if (p.timer > animation.limits[animation.limits.length-1]) lab.particles.splice(lab.particles.indexOf(p),1);
	}
}
function animationFrame(animation,particle){
	for (var i=0,j=animation.limits.length;i<j;i++){
		if (particle.timer < animation.limits[i]) return i;
	}
	return 0;
}

function drawInterface(){
	stroke(255);
	fill(255);
	textSize(18);
	textAlign(LEFT);
	image(data.hud.coin,data.nodes.size,data.nodes.size/2 + 20);
	text(lab.player.treasure.toString(),20 + data.nodes.size,38);
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