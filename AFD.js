import Automata, {State, Arrow} from "./automata.js"
import {StateAlreadyExistError, StateNotFoundError, CharNotFoundError, AFDError, noArrowError} from "./errors.js"
import DFAre from "./DFA-re.js"
export default class AFD extends Automata{
  constructor(alphabet){
    super(alphabet)
  }

  addState(stateName,stateId, isInitial = false, isFinal =false, label1=undefined, label2=undefined){
    console.log(`${stateName} ${stateId} ${isInitial} ${isFinal}`)
    if(!this.stateExist(stateName, stateId)){
      let newstate = new State(stateName, stateId,isInitial, isFinal)
      newstate.setLabels(label1, label2);
      this.states.push(newstate)
    }else{
      throw new StateAlreadyExistError(stateName)
    }
  }
  getInitialState(){
    return this.states.filter(e => e.isInitial)[0];
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

  addArrowToStates(name, id, fromStateId, toStateId){

    const fromState = this.states.filter(e => e.id == fromStateId)[0]
    const toState = this.states.filter(e => e.id == toStateId)[0]
    console.log(`adding ${name} from ${fromStateId} to ${toStateId}`)

    if(!fromState)
      throw new StateNotFoundError(fromStateId)

    if(!toState)
      throw new StateNotFoundError(toStateId)

    if(this.arrowNameExistInAlphabet(name)){
        if(this.arrowExistInState(fromState, name)){
          throw new AFDError(fromState, name)
        }
        //console.log(`added ${name} from ${fromStateName} to ${toStateName}`)
        const arrow = new Arrow(name, id, fromState, toState)
        fromState.addRow(arrow)
        this.edges.push(arrow)
    }
  }

  editArrowName(name, id){
    let temp = this.edges.filter(e=> e.id == id)[0]
    let state = temp.from
    if(this.arrowNameExistInAlphabet(name)){
      if(!this.arrowExistInState(state, name)){
        temp.name = name
        let temp2 = temp.from.arrows.filter(e => e.id = id)[0]
        temp2.name = name
      }else{
        throw new AFDError(state, name);
      }
    }
  }
  generateDFA(state){
		let dfa = new DFAre(this.alphabet)
		this.states.forEach(s => {
			dfa.addState(s.name,s.id, s.isInitial,s.name == state.name)
		})
		this.states.forEach(s => {
			s.arrows.forEach(t => dfa.addArrowToStates(t.name,t.id,t.from.name,t.to.name))
		})
		return dfa
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

  arrowExistInState(state, arrowName){
    for(let a of state.arrows){
      console.log(`name: ${a.name} - arrowname: ${arrowName}`)
      if(a.name === arrowName)
        return true
    }
    return false
  }

}
