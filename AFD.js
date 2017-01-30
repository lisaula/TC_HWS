import Automata, {State, Arrow} from "./automata.js"
import {StateAlreadyExistError, StateNotFoundError, CharNotFoundError, AFDError, noArrowError} from "./errors.js"
export default class AFD extends Automata{
  states = []
  constructor(alphabet){
    super(alphabet)
  }

  addState(stateName,stateId, isInitial = false, isFinal =false){
    console.log(`${stateName} ${stateId} ${isInitial} ${isFinal}`)
    if(!this.stateExist(stateName)){
      this.states.push(new State(stateName, stateId,isInitial, isFinal))
    }else{
      throw new StateAlreadyExistError(stateName)
    }
  }

  editState(stateName,stateId, isInitial = false, isFinal =false){
    console.log(`${stateName} ${stateId} ${isInitial} ${isFinal}`)
    if(!this.stateExist(stateName)){
      var temp_state = this.states.filter(e=> e.id ===stateId)[0]
      temp_state.setValues(stateName,isInitial, isFinal);
    }else{
      throw new StateAlreadyExistError(stateName)
    }
  }

  addArrowToStates(name, id, fromStateName, toStateName){

    const fromState = this.states.filter(e => e.name == fromStateName)[0]
    const toState = this.states.filter(e => e.name == toStateName)[0]
    //console.log(`adding ${name} from ${fromStateName} to ${toStateName}`)

    if(!fromState)
      throw new StateNotFoundError(fromStateName)

    if(!toState)
      throw new StateNotFoundError(toStateName)

    if(this.arrowNameExistInAlphabet(name)){
        if(!this.arrowNotExistInState(fromState, name)){
          throw new AFDError(fromState, name)
        }
        //console.log(`added ${name} from ${fromStateName} to ${toStateName}`)
        const arrow = new Arrow(name, id, fromState, toState)
        fromState.addRow(arrow)
        this.edges.push(arrow)
    }
  }

  removeStateFromArray(id){
    const array = this.states.filter(e => e.name !==id)
    this.states = array;
  }

  removeEdgeFromArray(id){
    let s = this.edges.filter(e=> e.id == id)[0].from;
    const temp_edges =this.edges.filter(e => e.id !== id);
    this.edges = temp_edges;
    const state = this.states.filter(e => e.name == s.name)[0]
    const temp_array = state.arrows.filter(e=> e.id !==id )
    state.arrows=temp_array;
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
    for(let s of this.states){
      if(s.name === stateName)
        return true;
    }
    return false
  }
}
