import AFD from "./AFD.js"
export function unionAutomaton(dfa0,dfa1){
	let fusedAutomaton = fuseAutomatons(dfa0,dfa1)
	return setFinalStatesForUnion(fusedAutomaton,dfa0,dfa1)
}

export function intersectionAutomaton(dfa0,dfa1){
	let fusedAutomaton = fuseAutomatons(dfa0,dfa1)
	return setFinalStatesForIntersection(fusedAutomaton,dfa0,dfa1)
}

export function differenceAutomaton(dfa0,dfa1){
	let fusedAutomaton = fuseAutomatons(dfa0,dfa1)
	return setFinalStatesForDifference(fusedAutomaton,dfa0,dfa1)
}

export function complementAutomaton(dfa){
  console.log(dfa);
	let complemented = changeFinalStates(dfa)
	return lookForSink(complemented)
}

//operaciones con automatas
function getStateLabel(state0,state1){
	return state0.name+'-a,'+state1.name+'-b'
}

function getStateForSymbol(state,dfa0,dfa1,a){
	let statesCmb = state.name.split(',')
	let states = []
	for(let s of statesCmb){
		let fromState = undefined
		let toState = undefined
		let fromIdentifier = s.split('-')
    //console.log("from identifier");
    //console.log(fromIdentifier);
		if (fromIdentifier[1]=='a') {
			fromState = dfa0.states.find(x => x.name == fromIdentifier[0])
		}else{
			fromState = dfa1.states.find(x => x.name == fromIdentifier[0])
		}
		if (fromState) {toState = fromState.arrows.find(x => x.validate(a))}
		if (toState) {states.push(toState.to.name+'-'+fromIdentifier[1])}
	}
  let returnValue =states.sort().join(',');
  //console.log(`return value ${returnValue}`);
	return returnValue
}
var transId=0;
function newID(){
  let id = Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  transId++
  id += "-"+transId
  return id
}

function fuseAutomatons(dfa0,dfa1){
	let newAlphabet = new Set(Array.from(dfa0.alphabet).concat(Array.from(dfa0.alphabet),Array.from(dfa1.alphabet)))
	let fusedAutomaton = new AFD(newAlphabet)

	let initialState0 = dfa0.getInitialState()
	let initialState1 = dfa1.getInitialState()
  let stateLabel = getStateLabel(initialState0,initialState1)
	fusedAutomaton.addState(stateLabel,stateLabel,true, false, initialState0.name, initialState1.name)


	for(let state of fusedAutomaton.states){
		for(let a of Array.from(newAlphabet)){
			let newState = getStateForSymbol(state,dfa0,dfa1,a)
      //console.log('new state');
      //console.log(newState);
			if (!fusedAutomaton.states.find(x => x.name==newState)) {
				fusedAutomaton.addState(newState, newState)
			}
			fusedAutomaton.addArrowToStates(a,newID(),state.name,newState)
		}
	}

	return fusedAutomaton
}

function setFinalStatesForUnion(fusedAutomaton,dfa0,dfa1){
	let finalStates0 = dfa0.states.filter(x => x.isFinal).map(x => x.name+'-a')
	let finalStates1 = dfa1.states.filter(x => x.isFinal).map(x => x.name+'-b')
	let finalStates = finalStates0.concat(finalStates0,finalStates1)

	for(let finalState of finalStates){
		fusedAutomaton.states.filter(x => x.name.indexOf(finalState)!=-1).forEach(state => {
			state.setFinal()
		})
	}
	return fusedAutomaton
}

function setFinalStatesForIntersection(fusedAutomaton,dfa0,dfa1){
	let finalStates0 = dfa0.states.filter(x => x.isFinal).map(x => x.name+'-a')
	let finalStates1 = dfa1.states.filter(x => x.isFinal).map(x => x.name+'-b')

	fusedAutomaton.states.filter(x => {
		let state = finalStates0.filter(fs0 => x.name.indexOf(fs0)!=-1).length>0
		if (!state) return false
		return finalStates1.filter(fs1 => x.name.indexOf(fs1)!=-1).length>0
	}).forEach(state => {
		state.setFinal()
	})
	return fusedAutomaton
}

function setFinalStatesForDifference(fusedAutomaton,dfa0,dfa1){
	let finalStates0 = dfa0.states.filter(x => x.isFinal).map(x => x.name+'-a')
	let finalStates1 = dfa1.states.filter(x => x.isFinal).map(x => x.name+'-b')

	fusedAutomaton.states.filter(x => {
		let state = finalStates0.filter(fs0 => x.name.indexOf(fs0)!=-1).length>0
		if (!state) return false
		return finalStates1.filter(fs1 => x.name.indexOf(fs1)!=-1).length==0
	}).forEach(state => {
		state.setFinal()
	})
	return fusedAutomaton
}

function changeFinalStates(dfa){
	let complement = new AFD(dfa.alphabet)

	dfa.states.forEach(state => complement.addState(state.name,state.name,state.isInitial,!state.isFinal))
	dfa.states.forEach(state => state.arrows.forEach(t => complement.addArrowToStates(t.name,newID(),t.from.name,t.to.name)))
	return complement
}

function lookForSink(dfa){
  console.log(dfa);
	let sink = 'sumidero'
	let addedSink = false
	for(let state of dfa.states){
		for(let a of dfa.alphabet){
			if(!state.hasTransition(a)){
				if (!addedSink) {
					dfa.addState(sink, sink,false,true)
          let label = Array.from(dfa.alphabet).join('|')
					dfa.addArrowToStates(label, newID(),sink,sink)
					addedSink = true
				}
				dfa.addArrowToStates(a,newID(),state.name,sink)
			}
		}
	}
	return dfa
}
