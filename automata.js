import {CharNotFoundError} from "./errors.js"
export default class Automata{
  states = []
  edges=[]
  alphabet = undefined
  constructor(){}

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
}

export class State {
  arrows=[]
  constructor(name, id, isInitial = false, isFinal = false ){
    this.id = id
    this.name = name
    this.isInitial = isInitial
    this.isFinal = isFinal
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

  validateEpsilon(a){
    for(let n of this.name.split("|")){
      if(a == n || n =="e")
        return true;
    }
    return false;
  }
}
