function completeSigil(sigil){
	for (var spell in data.spells){
		var s = data.spells[spell];
		if (s.sigil == sigil){
			console.log(s.name); //debugging
			addToCastList(s);
			return true;
		};
	}
}

function addToCastList(spell){
	lab.castList.push(spell);
	if (lab.castList.length > 2){
		cast();
	}
}

function cast(){
	//calculate mana cost
	var cost = 0;
	if (lab.castList[0]) cost += lab.castList[0].cost;
	if (lab.castList[1]) cost += lab.castList[1].cost;
	if (lab.castList[2]) cost += lab.castList[2].cost;
	
	var c = "";
	for (var s in lab.castList){
		c += " " + lab.castList[s].name;
	}
	console.log("Cast" + c);
	
	if (cost <= lab.player.mana){
		//cast the spell
		lab.player.mana -= cost;
	} else {
		//player can't afford to cast spell
		console.log("Player Mana: " + lab.player.mana + " Spell cost: " + cost);
	}
	
	lab.castList = [];//reset castList
	//updateCastList(); Used to update the list the player sees
}