data = local_data;
treeData = data.decomp;
var definition= ''; 
if(data.decomp.definition != undefined)
data.decomp.definition.forEach(function(def){
	definition += def.definition + '';
});
//var depth = parseInt(treeData.depth);


var component = document.getElementById('comp');
component.innerHTML = treeData.name;
var definitionParagraph = document.getElementById('def');
definitionParagraph.innerHTML += 'Traditional: ' + treeData.definition[0].traditional;
definitionParagraph.innerHTML += ' - Simplified: ' + treeData.definition[0].simplified;
if(treeData.definition.length > 1){
	definitionParagraph.innerHTML += ' - Pinyin: ' 
	treeData.definition.forEach(function(def){
		definitionParagraph.innerHTML += def.pinyin + ' ';
	});
} else{
	definitionParagraph.innerHTML += ' - Pinyin: ' + treeData.definition[0].pinyin;
}
//definition.innerHTML += '<br>Sound: ' + d.sound;
definitionParagraph.innerHTML += '<br>';
definitionParagraph.innerHTML += 'Definition: ';
if(treeData.definition.length > 1){
	var i = 1;
	treeData.definition.forEach(function(def){
		definitionParagraph.innerHTML += '<br><b>' + i + ')</b>';
		var myDef = def.definition.replace(/\//g, ', ');
		definitionParagraph.innerHTML += myDef;
		i++;
	});
}else{
	var myDef = treeData.definition[0].definition.replace(/\//g, ', ');
	definitionParagraph.innerHTML += myDef;
}
//document.getElementById('def').innerHTML += JSON.stringify(data.decomp);

var margin = {top: 40, right: 120, bottom: 20, left: 120},
	width = 960 - margin.right - margin.left,
	height = 270 - margin.top- margin.bottom;
	
var i = 0;

var tree = d3.layout.tree()
	.size([height, width]);

var diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.x, d.y]; });

var svg = d3.select("#body").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
    .append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData;
  
update(root);

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
	  links = tree.links(nodes);

  //Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 70; });

  // Declare the nodes…
  var node = svg.selectAll("g.node")
	  .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) { 
		  return "translate(" + d.x + "," + d.y + ")"; })
	  .on("click", function(d) { 
		var component = document.getElementById('comp');
		component.innerHTML = d.name;
		var definition = document.getElementById('def');
		definition.innerHTML = '';
		//definition.innerHTML = 'Definition: ' + JSON.stringify(d.definition) + '<br>';
		if(d.definition != undefined){
			definition.innerHTML += 'Traditional: ' + d.definition[0].traditional;
			definition.innerHTML += ' - Simplified: ' + d.definition[0].simplified;
			if(treeData.definition.length > 1){
				definitionParagraph.innerHTML += ' - Pinyin: ' 
				treeData.definition.forEach(function(def){
					definitionParagraph.innerHTML += def.pinyin + ' ';
				});
			} else{
				definitionParagraph.innerHTML += ' - Pinyin: ' + treeData.definition[0].pinyin;
			}
			//definition.innerHTML += '<br>Sound: ' + d.sound;
			definition.innerHTML += '<br>';
			definition.innerHTML += 'Definition: ';
			if(d.definition.length > 1){
				var i = 1;
				d.definition.forEach(function(def){
					definition.innerHTML += '<br><b>' + i + ')</b>';
					var myDef = def.definition.replace(/\//g, ', ');
					definition.innerHTML += myDef;
					i++;
				});
			} else{
				var myDef = d.definition[0].definition.replace(/\//g, ', ');
				definition.innerHTML += myDef;
			}
		} else{
			if(d.pinyin != '_stroke'){
				definition.innerHTML += 'Pinyin: ' + d.pinyin;
			}
			//definition.innerHTML += '<br>Sound: ' + d.sound;
			if(d.meaning != 'N/A'){
				definition.innerHTML += '<br>Meaning: ' + d.meaning;
			}
			if(d.others.length > 0){
				definition.innerHTML += '<br>Some other characters with this component:'
				var i = 0;
				d.others.forEach(function(character){
					if(i<25){
						var link = document.createElement("a"); 
						link.setAttribute("href", "/character?character=" + character);
						var text = document.createTextNode(character + '  ');
						link.appendChild(text);
						definition.appendChild(link);
					}
					i++;
				});
			}
		}
	});

  nodeEnter.append("circle")
	  .attr("r", 10)
	  .attr("class", function(d){
		  if(definition.indexOf(d.meaning) != -1){
			  return 'meaning';
		  } else if(d.sound == 1){
			  return 'sound1';
		  } else if(d.sound == 2){
			  return 'sound2';
		  } else if(d.sound == 3){
			  return 'sound3';
		  } else if(d.sound == 4){
			  return 'sound4';
		  } else{
			  return 'normal';
		  }
	  });
	  

  nodeEnter.append("text")
	  .attr("y", function(d) { 
		  return d.children})
	  .attr("dy", ".35em")
	  .attr("text-anchor", "middle")
	  .text(function(d) { return d.name; })
	  .attr("class", function(d){
		  if(d.name == treeData.name){
			  return "root";
		  }
	  })
	  .style("fill-opacity", 1);

  // Declare the links…
  var link = svg.selectAll("path.link")
	  .data(links, function(d) { return d.target.id; });

  // Enter the links.
  link.enter().insert("path", "g")
	  .attr("class", "link")
	  .attr("d", diagonal);
	  
	
}