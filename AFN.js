import Automata, {State, Arrow} from "./automata.js"
import {StateAlreadyExistError} from "./errors.js"
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
            return state.isFinal;
          }
        }
      }
      return state.isFinal;
  }

  getInitialState(){
    return this.states.filter(e => e.isInitial)[0]
  }
}
