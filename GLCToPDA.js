import PDA from "./PDA.js"

export function ToPDA(productions){
		let ret = new PDA();
		let productors = parseProductions(productions);
		if (productors.length == 0)
			return ret
		//console.log("productors", productors);

		ret.addState("q0","q0",true);
    ret.addState("q1","q1");
    ret.addState("q2","q2", false, true);

    let nuevoTerminales=[]
		for (let prod of productors)
			for (let value of prod.returns){
        let label = "e,"+prod.name+"/"
        for(let val of value){
          if(!isProductor(productors,val))
            nuevoTerminales.push(val)
        }
        label += value.join(",");
      //  console.log(label);
      	ret.addArrowToStates(label,label, "q1", "q1")
      }
    nuevoTerminales =removeDuplicates(nuevoTerminales)
		for (let term of nuevoTerminales){
      let label = term+","+term+"/e"
      ret.addArrowToStates(label, label, "q1","q1")
    }
		//ret.type = "Empty Stack";
		//ret.stack_head = productors[0].name;
    let label = "e,Z0/"+productors[0].name+",Z0"
    ret.addArrowToStates(label,label,"q0","q1")
    label = "e,Z0/e"
    ret.addArrowToStates(label,label,"q1","q2")
    return ret;
}

function removeDuplicates(array){
  let nuevo = [];
	array.forEach( x => nuevo.indexOf(x) < 0 ? nuevo.push(x) : null);
  return nuevo;
}

function isProductor(productors,name){
  for(let prod of productors){
    if(prod.name==name)
      return true
  }
  return false
}


 function parseProductions(productions) {
		let productors = [];
		let productionsSplitted = productions.split("\n");
		for (let prod of productionsSplitted) {
			if (prod.includes("->")) {
				let temp = prod.split("->");
				if(!productors.map(x => x.name).includes(temp[0].trim(" "))){
					productors.push({ name: temp[0].trim(" ") , returns: []});
				}
        for (let i = 1; i < temp.length; i++) {
					let productorIndex = productors.map(x  => x.name).indexOf(temp[0]);

          if (temp[i].length == 1) {
						productors[productorIndex].returns.push([temp[i]]);
					} else {
						let values = [];

						for (let j = 0; j < temp[i].length; j++) {
              let c = temp[i].charAt(j)
              if(c!="[" && c!=']'){
                values.push(c)
              }else{
                //console.log("Entro else");
                let produccion =""
                for(let index = j; j<temp[i].length;index++){
                  //console.log("TEmp[i][index]");
                  if(temp[i][index] !="]"){
                    produccion+=temp[i][index]
                  }else{
                    produccion+="]"
                    j=index
                    break;
                  }
                }
                //console.log("Pusheo "+produccion);
                values.push(produccion)
              }
            }
						productors[productorIndex].returns.push(values);
					}
				}
			} else {

				let produced = prod.replace("|", "").split("\n");
				for (let produ of produced) {
          let values = [];
					for (let i = 0; i < produ.length; i++) {
                  if(produ[i]!="[" && produ[i]!="]"){
                    values.push(produ[i])
                  }else{
                    let produccion =""
                    for(let index = i; index<produ.length;index++){
                      if(produ[index] !="]")
                        produccion+=produ[index]
                      else{
                        produccion+="]"
                        i=index
                        break;
                      }
                    }
                    //console.log("Pusheo 2"+produccion);
                    values.push(produccion)
                  }
					}
          productors[productors.length - 1].returns.push(values);
				}
			}
		}
		return productors;
}
