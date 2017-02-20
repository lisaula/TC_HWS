import Automata, {State, Arrow} from "./automata.js"
import {StateAlreadyExistError, StateNotFoundError, CharNotFoundError, AFDError, noArrowError} from "./errors.js"

export default class DFAre extends Automata{
  constructor(alphabet){
    super(alphabet)
  }
  addState(stateName,stateId='nada', isInitial = false, isFinal =false){
    //console.log(`${stateName} ${stateId} ${isInitial} ${isFinal}`)
    if(!this.stateExist(stateName, stateId)){
      this.states.push(new State(stateName, stateName,isInitial, isFinal))
    }else{
      throw new StateAlreadyExistError(stateName)
    }
  }
  addArrowToStates(name, id, fromStateId, toStateId){

    const fromState = this.states.filter(e => e.id == fromStateId)[0]
    const toState = this.states.filter(e => e.id == toStateId)[0]
    //console.log(`adding ${name} from ${fromStateId} to ${toStateId}`)

    if(!fromState)
      throw new StateNotFoundError(fromStateId)

    if(!toState)
      throw new StateNotFoundError(toStateId)

    //if(this.arrowNameExistInAlphabet(name)){
        //if(this.arrowExistInState(fromState, name)){
          //throw new AFDError(fromState, name)
        //}
        //console.log(`added ${name} from ${fromStateName} to ${toStateName}`)
        const arrow = new Arrow(name, id, fromState, toState)
        fromState.addRow(arrow)
        this.edges.push(arrow)

  }

  getRegex(){
		let oneState = (this.states.filter(x => x.isInitial && x.isFinal).length > 0)?true:false

		if (oneState) {
			return this.edges[0].name
		}else{
			let initialState = this.states.find(x => x.isInitial)
			let finalState = this.states.find(x => x.isFinal)
			let R = initialState.arrows.find(x => x.to.name == initialState.name)
			let S = initialState.arrows.find(x => x.to.name == finalState.name)
			let T = finalState.arrows.find(x => x.to.name == finalState.name)
			let U = finalState.arrows.find(x => x.to.name == initialState.name)

			R = R?'('+R.name+')*':''
			S = S?S.name:''

			T = T?'('+T.name+')*':''
			U = U?U.name:''

			return R + (R && S?'.':'') + S + (S && T || S && U?'.':'') + T + (T && U?'.':'') + U
		}
	}
}
