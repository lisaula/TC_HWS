import {CharNotFoundError} from "./errors.js"
export default class Automata{
  states = []
  edges=[]
  alphabet = undefined

  constructor(alphabet){
    this.alphabet = alphabet;
  }

  setAlphabet(alphabet){
    this.alphabet = null;
    this.alphabet = new Set()
    for(let a of alphabet.split(",")){
        this.alphabet.add(a)
    }
  }
  findState(stateName) {
		return this.states.find(e => e.name == stateName)
	}

  setInitialState(stateName){
    this.states = this.states.map(n => {
      if(n.name == stateName){
        n.isInitial = true
        return n
      }
    })
  }

  setFinalState(stateName){
    this.states = this.states.map(n => {
      if(n.name == stateName){
        n.isFinal = true
        return n
      }
    })
  }
  findState(name){
    return this.states.filter(x=>x.name ==name)[0]
  }
  removeByAttr(arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i]
           && arr[i].hasOwnProperty(attr)
           && (arguments.length > 2 && arr[i][attr] === value ) ){
           arr.splice(i,1);
       }
    }
    return arr;
  }

  stateExist(stateName, stateId){
    for(let s of this.states){
      if(s.name === stateName && s.id !== stateId)
        return true;
    }
    return false
  }

  stateNameExist(stateName){
    for(let s of this.states){
      if(s.name === stateName)
        return true;
    }
    return false
  }

  arrowNameExistInAlphabet(name){
    name.split("|").forEach(c => {
      if(!this.alphabet.has(c))
        throw new CharNotFoundError(c)
    })
    return true
  }

  toDataSet(){
		let nodes = []
		let edges = []
		this.states.map(state => {
			nodes.push({id:state.id, label:state.name, color: this.getColor(state.isInitial, state.isFinal)})
			state.arrows.map(e => {
				edges.push({from:e.from.id, to:e.to.id,label:e.name, id:e.id })
			})
		})
		return {nodes: nodes, edges: edges}
	}

  getColor(initial, final){
    if(initial && final){
      return 'orange'
    }else if(initial){
      return 'lime'
    }else if(final){
      return 'red'
    }else{
      return null
    }
  }

  toData(){
		let nodes = []
		let edges = []
		this.states.map(x => {
			nodes.push({isInitial: x.isInitial, isFinal: x.isFinal, label: x.name})
			x.arrows.map(t => {
				edges.push({from: t.from.name, to: t.to.name, label: t.name})
			})
		})
		return {nodes: nodes, edges: edges}
	}
}

export class State {
  arrows=[]
  constructor(name, id, isInitial = false, isFinal = false ){
    this.id = id
    this.name = name
    this.isInitial = isInitial
    this.isFinal = isFinal
  }
  touched(){
    this.touch = true;
  }
  hasTransition(a){
    return this.arrows.filter(x=> x.validate(a)).length>0
  }
  setLabels(label1,label2){
    this.label1 = label1;
    this.label2 = label2;
    console.log(`label1 ${this.label1} label2 ${this.label2}`);
  }
  setFinal(){
    this.isFinal = true
  }
  setValues(name,isInitial, isFinal){
    this.name = name
    this.isInitial = isInitial
    this.isFinal = isFinal
  }
  addRow(arrow){
    //console.log(`arrow ${arrow.name} added to ${this.name}`)
    //console.log(`arrow from ${arrow.from.name} to ${arrow.to.name}`)
    this.arrows.push(arrow)
  }

  removeByAttr(attr, value){
    var i = this.arrows.length;
    while(i--){
       if( this.arrows[i]
           && this.arrows[i].hasOwnProperty(attr)
           && (arguments.length > 2 && this.arrows[i][attr] === value ) ){
           this.arrows.splice(i,1);
       }
    }
    this.arrows =this.arrows;
  }
}

export class Arrow{
  constructor(name, id, from, to){
    console.log(id)
    this.id = id
    this.name =name
    this.from = from
    this.to = to
    this.touched = false
  }

  validate(a){
    for(let n of this.name.split("|")){
      if(a == n)
        return true;
    }
    return false;
  }

  validatePDA(a, top){
    let labelInfo = this.getLabelInfo(this.name)
    for(let n of labelInfo[0].split("|")){
      //console.log("evaluando a "+a+" top "+top+" li[1]"+labelInfo[1]);
      if(n == a){
        return true
      }else if(n=="e" && (top =="z0" || labelInfo[1]==top)){
        return true
      }
    }
    return false
  }

  getLabelInfo(name){
    let array = name.split(",")
    let returnArray =[]
    if(array.length>0){
      returnArray.push(array[0].trim())
      let array2 = array[1].split("/")
      if(array2.length>0){
        returnArray.push(array2[0].trim())
        returnArray.push(array2[1].trim())
      }
    }
    return returnArray;
  }

  validateEpsilon(){
    for(let n of this.name.split("|")){
      if(n =="e")
        return true;
    }
    return false;
  }

  match(a) {
		let setOfa = a.split(/,|\//)
		for(let e of this.name.split(/,|\//))
		{
			for(let c of setOfa)
			{
				if (c == e) return true
			}
		}
		return false
	}

	ableToPop(symbol,popvalue){
		let values = this.name.split('/')
		let leftValue = values[0].split(',')
		let rightValue = values[1].split(',')
		return leftValue[0] ==  symbol && leftValue[1] == popvalue && !this.touched
	}

  validateEpsilonPDA(){
    let labelInfo = this.getLabelInfo(this.name)
    for(let n of labelInfo[0].split("|")){
      if(n =="e")
        return true;
    }
    return false;
  }
}
