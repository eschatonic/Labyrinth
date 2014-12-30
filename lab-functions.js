function loadGame(){
	var save = JSON.parse(localStorage.getItem("Labyrinth"));
	if (typeof save !== "undefined" && save) lab.highScore = save;
}
function saveGame(saveType){
	var save = lab.highScore;
	localStorage.setItem("Labyrinth",JSON.stringify(save));
}

function handleLevel(level,wentDown){
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