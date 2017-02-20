import Automata, {State, Arrow} from "./automata.js"
import {StateAlreadyExistError} from "./errors.js"
import DFAre from "./DFA-re.js"
export default class AFN extends Automata{
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

  consume(w, state){
    console.log(`W: ${w} - len: ${w.length} state: ${state.name}`)
    if(w.length>0){
        let a = w.charAt(0)
        if(this.arrowNameExistInAlphabet(a)){
          let arrows = state.arrows.filter(e => e.validate(a))
          if(arrows){
            let transitionStates = []
            for(let arrow of arrows){
              transitionStates.push(arrow.to)
            }
            if(transitionStates){
              let returnValue =false;
              for(let t_s of transitionStates){
                if(!returnValue)
                  returnValue = this.consume(w.substring(1, w.length),t_s)
              }
              return returnValue;
            }
          }else {
            return false;
          }
        }
      }
      return state.isFinal;
  }

  getInitialState(){
    return this.states.filter(e => e.isInitial)[0]
  }
}
