import AFNE from "./NFA-E.js"
import Parser from "./regular-expression-parser/regular-expression"
var seed = 0
var steps = 0
var transId=0
var epsilon = "e"

function newID(){
  let id = Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  transId++
  id += "-"+transId
  return id
}
function newQ(){
	let tmp = seed
	seed++
	return tmp
}

function nextStep(){
	let tmp = steps
	steps++
	return tmp
}

export function regexToNFAe(regex){
  seed = 0
	let stepByStep = regexToNFAe_STEPS(regex)
  console.log(stepByStep)
	return stepByStep[stepByStep.length-1]
}

export function regexToNFAe_STEPS(regex){
  seed = 0
	let grammarTree = Parser.parse(regex)
	let stepByStep = getStepByStepRegexToNFAE(grammarTree)
	return stepByStep
}

function getStepByStepRegexToNFAE(node){
	let stepByStep = []

	if (node.name == "character") {
		stepByStep.push(getNFAEcharacter(node.value))
	}else if (node.name == "kleene") {
		let stepsToKleene = getStepByStepRegexToNFAE(node.expression)
		stepsToKleene.push(getNFAEkleene(stepsToKleene[stepsToKleene.length-1]))
		stepByStep = stepsToKleene
	}else{
		let leftSteps = []
		let rightSteps = []
		let currentNFAE = null
		if (node.left) {
			leftSteps = getStepByStepRegexToNFAE(node.left)
		}
		if (node.right) {
			rightSteps = getStepByStepRegexToNFAE(node.right)
		}

		if (leftSteps.length>0 && rightSteps.length>0) {
			let leftStep = leftSteps[leftSteps.length-1]
			let rightStep = rightSteps[rightSteps.length-1]

			if (node.name == "pipe") {
				currentNFAE = getNFAEpipe(leftStep,rightStep)
			}else if (node.name == "concat") {
				currentNFAE = getNFAEconcat(leftStep,rightStep)
			}
			stepByStep = stepByStep.concat(leftSteps,rightSteps)
			if (currentNFAE != null) {
				stepByStep.push(currentNFAE)
			}
		}
	}
	return stepByStep
}

function getNFAEcharacter(character){
  let alphabet = new Set()
  alphabet.add(character);
	let nfae = new AFNE(alphabet)
	let newInitialStateLabel = ''+newQ()
	let newFinalStateLabel = ''+newQ()

	nfae.addState(newInitialStateLabel,newInitialStateLabel,true)
	nfae.addState(newFinalStateLabel,newFinalStateLabel,false,true)
  let transName = newID();
	nfae.addArrowToStates(character,transName,newInitialStateLabel,newFinalStateLabel)
	return nfae
}

function getNFAEpipe(nfae0,nfae1){
	let alphabet = new Set(Array.from(nfae0.alphabet)
		.concat(Array.from(nfae0.alphabet),Array.from(nfae1.alphabet)))
	let nfae = new AFNE(alphabet)

	let newInitialStateLabel = ''+newQ()
	let newFinalStateLabel = ''+newQ()

	nfae.addState(newInitialStateLabel,newInitialStateLabel,true)
	nfae.addState(newFinalStateLabel,newFinalStateLabel,false,true)

	let initialState0 = nfae0.states.find(x => x.isInitial)
	let finalState0 = nfae0.states.find(x => x.isFinal)
	let initialState1 = nfae1.states.find(x => x.isInitial)
	let finalState1 = nfae1.states.find(x => x.isFinal)

	nfae0.states.forEach(state => nfae.addState(state.name,state.name))
	nfae0.states.forEach(state => {
		state.arrows.forEach(trans => nfae.addArrowToStates(trans.name,newID(),trans.from.name, trans.to.name))
	})
	nfae1.states.forEach(state => nfae.addState(state.name,state.name))
	nfae1.states.forEach(state => {
		state.arrows.forEach(trans => nfae.addArrowToStates(trans.name, newID(),trans.from.name, trans.to.name))
	})

	nfae.addArrowToStates(epsilon,newID(),newInitialStateLabel,initialState0.name)
	nfae.addArrowToStates(epsilon,newID(),newInitialStateLabel,initialState1.name)
	nfae.addArrowToStates(epsilon,newID(),finalState0.name,newFinalStateLabel)
	nfae.addArrowToStates(epsilon,newID(),finalState1.name,newFinalStateLabel)

	return nfae
}

function getNFAEkleene(nfaeIn){
	let nfae = new AFNE(nfaeIn.alphabet)

	let newInitialStateLabel = ''+newQ()
	let newFinalStateLabel = ''+newQ()

	nfae.addState(newInitialStateLabel,newInitialStateLabel,true)
	nfae.addState(newFinalStateLabel,newFinalStateLabel,false,true)

	let initialStateIn = nfaeIn.states.find(x => x.isInitial)
	let finalStateIn = nfaeIn.states.find(x => x.isFinal)

	nfaeIn.states.forEach(state => nfae.addState(state.name,state.name))
	nfaeIn.states.forEach(state => {
		state.arrows.forEach(trans => nfae.addArrowToStates(trans.name,newID(),trans.from.name, trans.to.name))
	})

	nfae.addArrowToStates(epsilon,newID(),finalStateIn.name,initialStateIn.name)
	nfae.addArrowToStates(epsilon,newID(),finalStateIn.name,newFinalStateLabel)
	nfae.addArrowToStates(epsilon,newID(),newInitialStateLabel,initialStateIn.name)
	nfae.addArrowToStates(epsilon,newID(),newInitialStateLabel,newFinalStateLabel)

	return nfae
}

function getNFAEconcat(nfae0,nfae1){
	let alphabet = new Set(Array.from(nfae0.alphabet)
		.concat(Array.from(nfae0.alphabet),Array.from(nfae1.alphabet)))
	let nfae = new AFNE(alphabet)

	let initialState0 = nfae0.states.find(x => x.isInitial)
	let finalState0 = nfae0.states.find(x => x.isFinal)
	let initialState1 = nfae1.states.find(x => x.isInitial)
	let finalState1 = nfae1.states.find(x => x.isFinal)

	nfae0.states.forEach(state => nfae.addState(state.name,state.name,state.name==initialState0.name))
	nfae0.states.forEach(state => {
		state.arrows.forEach(trans => nfae.addArrowToStates(trans.name,newID(),trans.from.name, trans.to.name))
	})
	nfae1.states.forEach(state => nfae.addState(state.name,state.name,false,state.name == finalState1.name))
	nfae1.states.forEach(state => {
		state.arrows.forEach(trans => nfae.addArrowToStates(trans.name, newID(),trans.from.name, trans.to.name))
	})
	nfae.addArrowToStates(epsilon,newID(),finalState0.name,initialState1.name)

	return nfae
}

function objectToArray(obj) {
	return Object.keys(obj).map(function (key) { return obj[key]; });
}

function getState(data, id) {
	return data.nodes._data[id]
}
