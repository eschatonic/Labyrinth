function completeSigil(sigil){
	for (var spell in data.spells){
		var s = data.spells[spell];
		if (s.sigil == sigil){
			console.log(s.name); //debugging
		};
	}
}