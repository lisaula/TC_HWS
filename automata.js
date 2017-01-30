export default class Automata{
  states = []
  alphabet = undefined
  constructor(alphabet){
    this.setAlphabet(alphabet)
  }

  setAlphabet(alphabet){
    this.alphabet = new Set()
    for(let a of alphabet){
      if(a !== ',' || a !== '{' || a !== '}')
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
}

export class State {
  arrows=[]
  constructor(name, isInitial = false, isFinal = false ){
    this.name = name
    this.isInitial = isInitial
    this.isFinal = isFinal
  }

  addRow(arrow){
    console.log(`arrow ${arrow.name} added to ${this.name}`)
    console.log(`arrow from ${arrow.from.name} to ${arrow.to.name}`)
    this.arrows.push(arrow)
  }
}

export class Arrow{
  constructor(name, from, to){
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
}
