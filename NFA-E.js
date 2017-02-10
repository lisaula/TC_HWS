import Automata, {State, Arrow} from "./automata.js"
import {StateAlreadyExistError} from "./errors.js"

export default class AFNE extends Automata{
  constructor(){
    super()
  }

  addState(stateName, stateId, isInitial = false, isFinal = false){
    if(this.stateExist(stateName, stateId)){
      throw new StateAlreadyExistError(stateName)
    }
    this.states.push(new State(stateName, stateId, isInitial, isFinal));
  }

  addArrowToStates(name, id, fromStateId, toStateId){
    const fromState = this.states.filter(e => e.id == fromStateId)[0]
    const toState = this.states.filter(e => e.id == toStateId)[0]

    if(!fromState)
      throw new StateNotFoundError(fromStateName)

    if(!toState)
      throw new StateNotFoundError(toStateName)

    if(this.arrowNameExistInAlphabet(name)){
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

  editState(stateName,stateId, isInitial = false, isFinal =false){
    console.log(`${stateName} ${stateId} ${isInitial} ${isFinal}`)
    if(!this.stateExist(stateName, stateId)){
      var temp_state = this.states.filter(e=> e.id ===stateId)[0]
      temp_state.setValues(stateName,isInitial, isFinal);
    }else{
      throw new StateAlreadyExistError(stateName)
    }
  }

  editArrowName(name, id){
    let temp = this.edges.filter(e=> e.id == id)[0]
    let state = temp.from
    if(this.arrowNameExistInAlphabet(name)){
        temp.name = name
        let temp2 = temp.from.arrows.filter(e => e.id = id)[0]
        temp2.name = name
    }
  }

  clausura(state){
    let array = []
    array.push(state)
    let arrows = state.arrows.filter(e=>e.validateEpsilon());
    if(arrows){
      for(let a of arrows){
        array.push.apply(array,this.clausura(a.to))
      }
    }
    return this.removeDuplicates(array);
  }

  consume(w, states){
    if(w.length>0){
      let a = w.charAt(0)
      let arrows =[]
      states.forEach( e => {
        arrows.push.apply(arrows, e.arrows.filter(e => e.validate(a)));
      })
      if(arrows){
        let transitionStates = []
        for(let arrow of arrows){
          transitionStates.push(arrow.to)
        }
        if(transitionStates){
          let statesWithClosing = []
          transitionStates.forEach(ts => {
            statesWithClosing.push.apply(statesWithClosing,this.clausura(ts))
          })
          statesWithClosing= this.removeDuplicates(statesWithClosing)
          return this.consume(w.substring(1, w.length),statesWithClosing)
        }
      }else{
        return false
      }
    }else{
      return this.evaluateIfFinals(states)
    }
  }

  removeDuplicates(states){
    let nuevo =[]
    states.forEach( x => nuevo.indexOf(x) < 0? nuevo.push(x): null);
    return nuevo
  }

  evaluateIfFinals(states){
    for(let s of states){
      if(s.isFinal)
        return true
    }
    return false
  }

  getInitialState(){
    return this.states.filter(e => e.isInitial)[0]
  }
}
