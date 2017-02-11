import AFNE from "./NFA-E.js"
import {getStateInfo,getAllTransitionsStates, stateNameExist,removeDuplicates} from "./Utils.js"

var stateTable = []
var newStates = []
var finalStates = []
var statesInfo=[]
const INITIAL = 0
const FINAL = 1
const REGULAR = 2
const BOTH = 3
function setEpsilonStateTable(afne){
  finalStates = afne.states.filter(x=> x.isFinal);
  let state = afne.getInitialState()
  let clousuredStates = afne.clausura(state)
  let cStateName = clousuredStates.map(x=> x.name).sort().join(",")
  newStates.push(cStateName)
  statesInfo.push(getStateInfo(cStateName)==FINAL? BOTH:INITIAL);
  let i = 0
  for(let s of newStates){
    stateTable.push(new Array(afne.alphabet.size))
    let x = 0
    for(let a of afne.alphabet){
      let transitionsState = getAllTransitionsStates(afne,s,a)
      let newName = ""
      if(transitionsState !=""){
        let statesClousure =[]
        for(let s of transitionsState.split(",")){
          let state = afne.findState(s)
          statesClousure.push.apply(statesClousure, afne.clausura(state))
        }
        newName = statesClousure.map(x => x.name).sort().join(",")
        newName = removeDuplicates(newName)
        if(!stateNameExist(newStates,newName)){
        //  console.log(`not exist ${transitionsState}`)
          newStates.push(newName);
          let info = getStateInfo(newName)
          //console.log(`info : ${info}`)
          statesInfo.push(info)
        }
      }else {
        newName="null"
      }
      stateTable[i][x]=newName
      x+=1
    }
    i+=1

  }
  let alp="Q - "
  for(let a of afne.alphabet){
    alp +=a+" "
  }
  console.log(alp)
  for(let i=0; i<stateTable.length; i++){
    let data = `${newStates[i]} | `
    for(let x=0; x<stateTable[i].length;x++){
      data += stateTable[i][x]+" | "
    }
    console.log(data)
  }
}

export {setEpsilonStateTable};
