var character = local_data.decomp.name;
var definition= local_data.decomp.definition[0].definition;
tree = local_data.decomp;
var possible = [];
definition.split(' ').forEach(function(word){
	word.replace(/[^a-zA-Z]/g, '');
	if(word.length>3){
		possible.push(word);
	}
});


if(possible.length>0){
	var s = document.createElement("script"); 
	s.src = "http://thesaurus.altervista.org/service.php?word="+ possible[0] +"&language=en_US&output=json&key=KqSo4sLMQ8SNlQjYjFO0&callback=process";
	document.getElementsByTagName("head")[0].appendChild(s); 	
}


function process(result) { 
	output = ""; 
	for (key in result.response) { 
		list = result.response[key].list; 
		output += list.synonyms+"<br>"; 
	} 
	if (output){
		definition += JSON.stringify(output);
	}
	if(tree.children != undefined){
		tree.children.forEach(function(component){
			if(definition.indexOf(component.meaning)!= -1){
				var nodes = document.getElementsByTagName("text");
				nodes.forEach(function(text){
					if(text.innerHTML == component.name){
						text.previousSibling.setAttribute("class", "meaning");
					}
				})
			}
		});
	}
}