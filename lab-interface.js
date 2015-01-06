function checkInputs(){
	if (keyIsDown(UP_ARROW)) {
        move(-1,0);
    } else if (keyIsDown(DOWN_ARROW)) {    
        move(1,0);
    } else if (keyIsDown(LEFT_ARROW)) {
        move(0,-1);
    } else if (keyIsDown(RIGHT_ARROW)) {
        move(0,1);
    }
	return false;
}
function keyPressed(){
	if (keyCode === RETURN) handlePause();
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

function createPattern(){
	data.pattern = createElement("div");
	data.pattern.attribute("id","patternContainer");
	var minSize = Math.min(windowHeight,windowWidth);
	var pattMargin = (minSize - 150)/8;
	var lock = new PatternLock("#patternContainer",{
		margin:pattMargin,
		onDraw:function(){
			completeSigil(lock.getPattern());
			lock.reset();
		},
	});
	data.pattern.position((windowWidth - minSize)/2,(windowHeight - minSize)/2);
	data.pattern.hide();
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
		
		data.pattern.show();
	}
}
function unPause(){
	lab.running = true;
	data.pattern.hide();
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