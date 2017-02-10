import AFN from "./AFN.js"

var stateTable = []
var newStates =[]
var statesInfo=[]
var finalStates =[]
var alphabet = []
const INITIAL = 0
const FINAL = 1
const REGULAR = 2
const BOTH = 3

function setStateTable(afn){
      //stateTable = new Array(afn.alphabet.size+1)
      //for(let state of afn.states){
      let state = afn.states.filter(x=> x.isInitial)[0];
      newStates.push(state.name)
      statesInfo.push(state.isFinal? BOTH: INITIAL);
      finalStates = afn.states.filter(x=> x.isFinal);
      //}
      /*
      for(let state of afn.states){
        for(let a of afn.alphabet){
          //console.log(`state ${state.name} with ${a} has ${getAllTransitionsStatesName(state,a)}`)
          let newstate = getAllTransitionsStatesName(state,a)
          if(newstate !=""){
            if(!afn.stateNameExist(newstate)){

              newStates.push(newstate)
            }
          }
        }
      }*/
      let i=0
      for(let s of newStates){
          stateTable.push(new Array(afn.alphabet.size))
          let x=0
          for(let a of afn.alphabet){
            alphabet.push(a)
            let transitionsState = getAllTransitionsStates(afn,s,a);
            console.log(`got ${transitionsState}`)
            if(transitionsState !=""){
              if(!stateNameExist(newStates,transitionsState)){
                console.log(`not exist ${transitionsState}`)
                newStates.push(transitionsState);
                let info = getStateInfo(transitionsState)
                console.log(`info : ${info}`)
                statesInfo.push(info)
              }
            }else{
              transitionsState = "null"
            }
            console.log(`seteado ..... ${transitionsState} ${i}-${x}`)
            stateTable[i][x]=transitionsState
            x+=1
          }
          i+=1
      }

      let alp="Q - "
      for(let a of afn.alphabet){
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

function stateNameExist(array, name){
  for(let s of array){
    if(s === name)
      return true;
  }
  return false
}

function getAllTransitionsStatesName(state, a){
  let newStateName = ""
  for(let i=0; i<state.arrows.length;i++){
    let arrow = state.arrows[i]
    arrow.name.split("|").filter(x=> {
      if(x==a){
        if(i !=0 &&newStateName !=""){
          newStateName +=","
        }
        newStateName += arrow.to.name
      }
    });
  }
  return newStateName
}

function getAllTransitionsStates(afn,stateName, a){
  console.log(stateName)
   let statesArray = stateName.split(",");
   let newStateName = ""
   for(let sName of statesArray){
     let state = afn.states.filter(x=>x.name ==sName)[0]
     for(let i=0; i<state.arrows.length;i++){
       let arrow = state.arrows[i]
       console.log(`evaluating ${arrow.from.name}-${arrow.name}-${arrow.to.name} with ${a}`)
       arrow.name.split("|").filter(x=> {
         if(x==a){
           if(newStateName !=""){
             newStateName +=","
           }
           console.log(`added ${arrow.to.name}`)
           newStateName += arrow.to.name
         }
       });
     }
   }
   return removeDuplicates(newStateName)
}

function removeDuplicates(statesName){
  //console.log(`remove dupli ${statesName}`)
  let array = statesName.split(",")
  let nuevo = [];
	array.forEach( x => nuevo.indexOf(x) < 0 ? nuevo.push(x) : null);
  let newName = ""
  for(let i=0; i<nuevo.length;i++){
    let a = nuevo[i]
    newName+=a
    if(i != nuevo.length-1)
      newName+=","
  }

  return newName;
}

function getNewDFAFromNFA(){
  var nodes = []
  var edges = []
  for(let i=0; i<stateTable.length; i++){
    if(statesInfo[i]!=REGULAR)
      nodes.push({id:newStates[i], label:newStates[i], color:getColorOfState(statesInfo[i])})
    else
      nodes.push({id:newStates[i], label:newStates[i]})
    for(let x=0; x<stateTable[i].length;x++){
      edges.push({from:newStates[i], to:stateTable[i][x], label: alphabet[x]})
    }
  }
  var dataSet = {
    nodes: nodes,
    edges: edges
  }
  return dataSet;
}

function getColorOfState(stateInfo){
  if(stateInfo == INITIAL){
    return 'lime'
  }else if(stateInfo == FINAL){
    return 'red'
  }else if( stateInfo == BOTH){
    return 'orange'
  }
  return 'default'
}

function getStateInfo(stateName){
  for(let fS of finalStates){
    for(let a of stateName.split(",")){
      if(fS.name == a){
        return FINAL
      }
    }
  }
  return REGULAR
}

export {setStateTable, getNewDFAFromNFA};
