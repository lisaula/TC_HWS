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
  }

  validate(a){
    for(let n of this.name.split("|")){
      if(a == n)
        return true;
    }
    return false;
  }

  validateEpsilon(){
    for(let n of this.name.split("|")){
      if(n =="e")
        return true;
    }
    return false;
  }
}
