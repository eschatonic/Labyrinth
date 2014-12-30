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