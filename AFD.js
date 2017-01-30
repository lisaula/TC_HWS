import Automata, {State, Arrow} from "./automata.js"
import {StateAlreadyExistError, StateNotFoundError, CharNotFoundError, AFDError, noArrowError} from "./errors.js"
export default class AFD extends Automata{
  states = []
  constructor(alphabet){
    super(alphabet)
  }

  addState(stateName, isInitial = false, isFinal =false){
    if(!this.stateExist(stateName)){
      this.states.push(new State(stateName, isInitial, isFinal))
    }else{
      throw new StateAlreadyExistError(stateName)
    }
  }

  addArrowToStates(name, fromStateName, toStateName){
    const fromState = this.states.filter(e => e.name == fromStateName)[0]
    const toState = this.states.filter(e => e.name == toStateName)[0]
    console.log(`adding ${name} from ${fromStateName} to ${toStateName}`)
    if(!fromState)
      throw new StateNotFoundError(fromStateName)

    if(!toState)
      throw new StateNotFoundError(toStateName)

    if(this.arrowNameExistInAlphabet(name)){
        if(!this.arrowNotExistInState(fromState, name)){
          throw new AFDError(fromState, name)
        }
        console.log(`added ${name} from ${fromStateName} to ${toStateName}`)
        fromState.addRow(new Arrow(name, fromState, toState))
    }
  }

  consume(w){
    let currentState = this.states.filter(e => e.isInitial)[0]

    for(let a of w){
      let arrow = currentState.arrows.filter(e => e.validate(a))[0]

      if(!arrow)
        throw new noArrowError(currentState.name, a)
      else {
        currentState = arrow.to
      }
    }
    return currentState.isFinal
  }

  arrowNotExistInState(state, arrowName){
    return !state.arrows.filter(a => {
      if(a.name ==arrowName)
        return true
        
      return false
    }).length
  }
  arrowNameExistInAlphabet(name){
    name.split("|").forEach(c => {
      if(!this.alphabet.has(c))
        throw new CharNotFoundError(c)
    })
    return true
  }

  stateExist(stateName){
    this.states.forEach(e => {
      if(e.name == stateName)
        return true
    })
    return false
  }
}
