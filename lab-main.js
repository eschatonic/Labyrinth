/* setup */
function preload(){
	loadGame();
	initialiseData();
	lab.canvas = createCanvas(windowWidth,windowHeight);
	background(0);
	createPattern();
}
function setup(level,wentDown){
	randomSeed(lab.seed * lab.player.level);
	noiseSeed(lab.seed * lab.player.level);
	textAlign(LEFT);
	imageMode(CENTER);
	handleLevel(level,wentDown);
}

/* main loop */
function draw(){
	if (lab.running){
		checkInputs();
	
		clearScreen();
		drawGraph();
		drawVisible();
		drawPlayer();
		drawEnemies();
		drawParticles();
		drawInterface();
		
		if (lab.player.health <= 0){
			gameOver();
		}
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