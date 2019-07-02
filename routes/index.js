var express = require('express');
var http = require('http');
var hanzi = require('hanzi');
hanzi.start();

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/about', function(req, res, next){
	res.render('about');
});

router.get('/contact', function(req, res, next){
	res.render('contact');
});

/* GET a character page. */
router.get('/character', function(req, res, next) {
	var character = req.query.character;
	var obj = {"name": character};
	obj.definition = hanzi.definitionLookup(character);
	obj.decomp = decompose(character);
	// var sound = hanzi.determinePhoneticRegularity(character);
	// var soundObj = {};
	// for(var key in sound){
		// soundObj = sound[key];
	// }
	// obj.decomp = phonetic(soundObj, obj.decomp);
	obj.alt = hanzi.decompose(character);
	res.render('character', {character: req.query.character, data: obj});
});

// router.get('/*.json', function(req, res, next){
	// //get character
	// url = req.url;
	// url = url.replace('/', '');
	// url = url.replace('.json', '');
	// var ch = decodeURIComponent(url);
	// var obj = decompose(ch);
	// res.send(obj);
// });

function requestSynonym(comp){
	var word = comp.meaning;
	var jsonObj = {};
	var options = {
		host: 'http://words.bighugelabs.com',
		path: '/api/2/aacec2c3c6b952976c6953ea71e1003a/' + word + '/json'
	}
	callback = function(response){
		var str = '';

		//another chunk of data has been recieved, so append it to `str`
		response.on('data', function (chunk) {
			str += chunk;
		});

		//the whole response has been recieved, so we just print it out here
		response.on('end', function () {
			jsonObj = JSON.parse(str);
		});
	}
	
	http.request(options, callback).end();
	return jsonObj;
}

function phonetic(character, comp){
	var sound = hanzi.determinePhoneticRegularity(character);
	var regularity = 0;
	if(sound != undefined){
		var sound1 = {};
		for(x in sound){
			sound1 = sound[x];
			var i = 0;
			sound1.component.forEach(function(comp2){
				if(comp == comp2){
					var regularity1 = sound1.regularity[i];
					if((regularity==0)){
						regularity = regularity1;
					}
					if((regularity1 != 0) && (regularity1 < regularity)){
						regularity = regularity1;
					}
				}
				i++;
			});
		}
		
	}
	return regularity;
}

function decompose(character){
	var decomp1 = hanzi.decompose(character, 1);
	var decomp2 = hanzi.decompose(character, 2);
	var obj = {};
	//obj.meaning = hanzi.getRadicalMeaning(character);
	//obj.sound = sound;
	var extra = {};
	var used = [];
	//first row of children
	if(decomp1.components.length > 1){
		obj.name = character;
		obj.definition = hanzi.definitionLookup(character);
		obj.children = [];
		decomp1.components.forEach(function(comp){
			if(comp!='No glyph available'){
				var compObj = componentInfo(character, comp);
				compObj.inner = allComponents(comp);
				obj.children.push(compObj);
			} else{
				obj.children.push({name: 'Ø'});
			}
		})
	}
	//second row of children
	if(decomp2.components.length > 1){
		
		obj.children.forEach(function(comp){
			if(comp.name!='Ø'){
				decomp2.components.forEach(function(innerComp){
					if(innerComp == comp.name){
						used.push(innerComp);
					} else if(comp.inner.indexOf(innerComp)!=-1){
						if(comp.children != undefined){
							comp.children.push(componentInfo(character, innerComp));
						} else{
							comp.children = [componentInfo(character, innerComp)];
						}
						used.push(innerComp);
					}
				});
			} else{
				extra = comp;
			}
		});
		
	}
	//find unused components
	if(obj.children != undefined){
		obj.children.forEach(function(comp){
			if(comp == extra){
				decomp2.components.forEach(function(innerComp){
					if(used.indexOf(innerComp)==-1){
						if(comp.children != undefined){
							comp.children.push(componentInfo(character, innerComp));
						} else{
							
							comp.children = [componentInfo(character, innerComp)];
						}
					}
				});
			}
		});
	}
	
	return obj;
}

function componentInfo(character, component){
	var compObj = {};
	compObj.name = component;
	compObj.pinyin = hanzi.getPinyin(component);
	compObj.sound = phonetic(character, component);
	compObj.meaning = hanzi.getRadicalMeaning(component);
	compObj.others = hanzi.getCharactersWithComponent(component);
	return compObj;
}

function allComponents(character){
	var decomp = hanzi.decompose(character);
	var components = [];
	decomp.components1.forEach(function(x){
		components.push(x);
	});
	decomp.components2.forEach(function(x){
		components.push(x);
	});
	return components;
}
	

// function decompose(character){
	// var decomp = hanzi.decompose(character,2);
	// var obj = {};
	// if(decomp.components.length > 1){
		// obj.name = character;
		// obj.depth = 1;
		// obj.definition = hanzi.definitionLookup(character);
		// obj.children = [];
		// var max = 0;
		// decomp.components.forEach(function(comp){
			// if(comp!='No glyph available'){
				// child = decompose(comp);
				// obj.children.push(child);
				// if(child.depth > max){
					// max = child.depth;
				// }
			// } else{
				// obj.children.push({name: 'Ø'});
			// }
			
		// });
		// obj.depth += max;
		// return obj;
	// }
	// return {"name": character};
// }


module.exports = router;
