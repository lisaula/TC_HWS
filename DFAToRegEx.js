import DFAre from "./DFA-re.js"
function getRegexFrom(dfa){
  //let returnAutomata = new DFAre(dfa.alphabet)
  //console.log("obtuvo")
  //console.log(dfa);
  let automatas = [];
  let finalStates = dfa.states.filter(x => x.isFinal)

  for(let finalState of finalStates){
    automatas.push(dfa.generateDFA(finalState))
  }
  //console.log(automatas);
  let reducedAtomatas=[]
  for(let automata of automatas){
    reducedAtomatas.push(regexFor(automata))
  }
  let automatons = reducedAtomatas
  console.log("reduceeddd");
  console.log(reducedAtomatas);
  let regex = []

  for(let as of automatons){
    //let a = as[as.length-1]
    regex.push('('+as.getRegex()+')')
  }
  //console.log("regex")
  //console.log(regex.join('+'))
  return regex.join('+')
  //return SetOfStepByStep
}
function regexFor(dfa){
  let backAutomaton = new DFAre(dfa.alphabet)
  dfa.states.forEach(state => {
    backAutomaton.addState(state.name,state.name,state.isInitial,state.isFinal)
  })
  dfa.states.forEach(state => {
    state.arrows.forEach(trans => {
      backAutomaton.addArrowToStates(trans.name,trans.id,trans.from.name,trans.to.name)
    })
  })

  let counter = (backAutomaton.states.filter(x => (x.isInitial && x.isFinal)).length>0)?1:2
  while(backAutomaton.states.length > counter){
    let data = backAutomaton.toData()
    let stateToDelete = data.nodes.find(x => !(x.isInitial || x.isFinal))
    //console.log("to delete")
    //console.log(stateToDelete);
    if (stateToDelete){
      let fromEdges = data.edges.filter(x => (x.from == stateToDelete.label && x.to != x.from))
      let toEdges = data.edges.filter(x => (x.to == stateToDelete.label && x.to != x.from))
      let cerraduraEdge = data.edges.find(x => (x.to == stateToDelete.label && x.to == x.from))
      if (cerraduraEdge){
        toEdges.forEach(edge => edge.label += '.('+cerraduraEdge.label+')*')
        //console.log("cerraduras");
        //console.log(cerraduraEdge);
      }
      let currentAutomaton = new DFAre(backAutomaton.alphabet)

      data.nodes.filter(x => x.label != stateToDelete.label).forEach(state => {
        currentAutomaton.addState(state.label,state.label,state.isInitial,state.isFinal)
      })

      data.edges.filter(x => (x.from != stateToDelete.label && x.to != stateToDelete.label)).forEach(trans => {
        currentAutomaton.addArrowToStates(trans.label,trans.label, trans.from, trans.to)
      })

      toEdges.forEach(x => {
        fromEdges.forEach(y => {
          let newLabel = needsParenthesis(x.label)+'.'+needsParenthesis(y.label)
          currentAutomaton.addArrowToStates(newLabel,newLabel,x.from,y.to)
        })
      })
      backAutomaton = currentAutomaton
    }
  }
  return backAutomaton
}

function needsParenthesis(label){
  //console.log("need parenthesis")
  //console.log(label);
  if(label.length>1){
    if(label.includes('|')){
      return '('+label+')'
    }
  }
  return label
}

export {getRegexFrom};
