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
			let R = initialState.arrows.filter(x => x.to.name == initialState.name)
			let S = initialState.arrows.filter(x => x.to.name == finalState.name)
			let T = finalState.arrows.filter(x => x.to.name == finalState.name)
			let U = finalState.arrows.filter(x => x.to.name == initialState.name)
      if(R.length>0){
        R = R.map(x=> x.name)
        for(let x=0; x<R.length;x++){
          R[x] =this.needsParenthesis(R[x])
        }
        R = R.join("+")
        R="("+R+")*";
      }else{
        R=''
      }

      if(S.length>0){
        S = S.map(x=> x.name)
        for(let x=0; x<S.length;x++){
          S[x] =this.needsParenthesis(S[x])
        }
        S = S.join("+")+""
      }else{
        S=''
      }
      if(T.length>0){
  			T = T.map(x=>x.name)
        for(let x=0; x<T.length;x++){
          T[x] =this.needsParenthesis(T[x])
        }
        T=T.join("+")
        T="("+T+")*"
      }else{
        T=''
      }
      if(U.length>0){
        console.log("u");
        console.log(U);
        U = U.map(x=>x.name)
        console.log("u maped");
        console.log(U);
        for(let x=0; x<U.length;x++){
          U[x] =this.needsParenthesis(U[x])
        }
        U=U.join("+")+""
      }else{
        U=''
      }
      let array = []
      if(R!=''){
        array.push(R)
      }
      if(S!=''){
        array.push(S)
      }
      if(T!=''){
        array.push(T)
      }
      if(U){
        array.push(U)
      }
      let array2 =[]
      if(R!=''){
        array2.push(R)
      }
      if(S!=''){
        array2.push(S)
      }
      if(T!=''){
        array2.push(T)
      }
			return '('+array.join(".")+')*'+array2.join(".")//(R==''?'':R+'.') + (S==''?'':S+'.') + (T==''?'':T+'.') + U
		}
	}

  needsParenthesis(label){
    if(label.length>1){
      console.log("yes");
      let returnvalue ='('+label+')'
      return returnvalue;
    }
    return label
  }
}
