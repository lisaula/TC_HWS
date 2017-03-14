import Automata, {State, Arrow} from "./automata.js"
import {StateAlreadyExistError, NotValidWordError} from "./errors.js"
import DFAre from "./DFA-re.js"
import Stack from "./stack.js"
const epsilon = "e"
export default class PDA extends Automata{
  stack=[]
  produced=[]
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

    //let labelInfo = this.getLabelInfo(name);
    //if(this.arrowNameExistInAlphabet(labelInfo[0])){
      const arrow = new Arrow(name, id, fromState, toState)
      fromState.addRow(arrow)
      this.edges.push(arrow)
    //}
  }
  arrowNameExistInAlphabet(name){
    name.split("|").forEach(c => {
      if(!this.alphabet.has(c) && c !="e")
        throw new CharNotFoundError(c)
    })
    return true
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

  getLabelInfo(name){
    let array = name.split(",")
    let returnArray =[]
    if(array.length>0){
      returnArray.push(array[0].trim())
      let array2 = array[1].split("/")
      if(array2.length>0){
        returnArray.push(array2[0].trim())
        returnArray.push(array2[1].trim())
      }
    }
    return returnArray;
  }

  // clausuraRecursivo(state, s, array){
  //   var stack = this.copyStack(s)
  //   //let stack = Object.create(s)
  //   //stack.stack = Object.create(s.stack)
  //   //console.log("entro con ");
  //   //console.log("stack");
  //   //console.log(stack);
  //   array.add(state)
  //   let arrows = state.arrows.filter(e=>e.validateEpsilonPDA());
  //   //console.log("arrows en clausura");
  //   //console.log(arrows);
  //   if(arrows){
  //     for(let a of arrows){
  //       //console.log("evaluando");
  //       //console.log(a);
  //       let li = this.getLabelInfo(a.name)
  //       if(li[1]!="e"){
  //         //console.log("entro1");
  //         if(li[1] == stack.top()){
  //           stack.pop()
  //           //console.log("entro2");
  //           if(li[2]!="e"){
  //             stack.push(li[2])
  //             //  console.log("entro2.1");
  //           }
  //         }else{
  //           //console.log("continue");
  //           continue;
  //         }
  //       }else{
  //         //console.log("entro3");
  //         if(li[2]!="e"){
  //           //console.log("entro4");
  //           stack.push(li[2])
  //         }
  //       }
  //       if(!array.has(a.to)){
  //         let array2 = this.clausuraRecursivo(a.to,stack,array)
  //         for(let i of array2){
  //           array.add(i)
  //         }
  //       }
  //     }
  //   }
  //   return Array.from(array);
  // }
  // clausura(state, s){
  //   return this.clausuraRecursivo(state,s, new Set())
  // }

  clausura2(state,top){
		let states = []
		states.push({epsilonState: state, pushPop: 'e,e/e'})
		state.arrows.filter(x => x.ableToPop(epsilon,top) || x.ableToPop(epsilon,epsilon)).map(f => {
			let epsilonState = this.findState(f.to.name)
			states.push({epsilonState: epsilonState, pushPop: f.name})
			states = states.concat(states,this.clausura2(epsilonState))
		})

		return Array.from(new Set(states))
	}

  setInitialStackVal(n){
    this.stack.push(n)
  }
  match(w){
		let finalStates = this.matchStates(w,[this.getInitialState()],this.stack)
		if (finalStates.length==0) return false
		console.log("finalStates: %o", finalStates)
		let finalState = finalStates.find(x => x!=undefined && x.isFinal)
		if (!finalState)return false
		return finalState.isFinal;
	}

  matchStates2(w,currentStates,stack){
		console.log("descripcion instantanea: w: %s, currentStates: %o, stack: %o",w,currentStates,stack)
		let clausuras = []
		currentStates.forEach(currentState => {
			let tempClausuras = this.clausura2(currentState,stack[stack.length-1])
			tempClausuras.forEach(claus => clausuras.push(claus))
		})

		console.log("clausuras ", clausuras)

		if (w.length>0) {
			let a = w.charAt(0)
			let statesTo = new Set()
			let returnValues = []

			clausuras.forEach(claus => {
        console.log("Claus abajo. S: %o W:%s",stack,w);
        console.log(claus);
				let nextStack = Array.from(stack)
				let popEpsilonValue = claus.pushPop.split('/')[0].split(',')[1]
				let pushEpsilonValues = claus.pushPop.split('/')[1].split(',')

				if (popEpsilonValue!=epsilon) nextStack.pop()
				for (var i = pushEpsilonValues.length - 1; i >= 0; i--) {
					if (pushEpsilonValues[i]!=epsilon)
						nextStack.push(pushEpsilonValues[i])
				}
				let transitions = claus.epsilonState.arrows.filter(x => x.ableToPop(a,stack[stack.length-1]) || x.ableToPop(a,epsilon) || x.ableToPop(epsilon,stack[stack.length-1]))
        console.log("transitions %o",transitions);
        transitions.forEach(t => {
					// statesTo.add(this.(t.to))
					let popValue = t.name.split('/')[0].split(',')[1]
          let transWith = t.name.split('/')[0].split(',')[0]
					let pushValues = t.name.split('/')[1].split(',')
					if (popValue!=epsilon) nextStack.pop()
					for (var i = pushValues.length - 1; i >= 0; i--) {
						if (pushValues[i]!=epsilon)
							nextStack.push(pushValues[i])
					}
          t.touched=true
          if(transWith!=epsilon){
					       returnValues = returnValues.concat(returnValues,this.matchStates(w.substring(1,w.length),[this.findState(t.to.name)],nextStack))
          }else{
            returnValues = returnValues.concat(returnValues,this.matchStates(w,[this.findState(t.to.name)],nextStack))
          }
          t.touched=false
        })
			})
			// if (returnValues.length>0)
        console.log("retorno %o con w: %s",returnValues,w );
				return Array.from(new Set(returnValues))
			// if (statesTo.size==0)
			// 	throw new NextTransitionError(a)
			// return this.matchStates(w.substring(1,w.length),Array.from(statesTo),new Array(stack))
		}
    console.log("regreso menor que 0 %o con w: %s",(clausuras.map(y => y.epsilonState)).find(x => x.isFinal), w);
		return (clausuras.map(y => y.epsilonState)).find(x => x.isFinal)
	}

  matchStates(w,currentStates,stack){
  console.log("descripcion instantanea: w: %s, currentStates: %o, stack: %o",w,currentStates,stack)
  let clausuras = []
  currentStates.forEach(currentState => {
    let tempClausuras = this.clausura2(currentState,stack[stack.length-1])
    tempClausuras.forEach(claus => clausuras.push(claus))
  })

  console.log("clausuras ", clausuras)

  if (w.length>0) {
    let a = w.charAt(0)
    let returnValues = []

    clausuras.forEach(claus => {
      let nextStack = Array.from(stack)
      let popEpsilonValue = claus.pushPop.split('/')[0].split(',')[1]
      let pushEpsilonValues = claus.pushPop.split('/')[1].split(',')

      if (popEpsilonValue!=epsilon) nextStack.pop()
      for (var i = pushEpsilonValues.length - 1; i >= 0; i--) {
        if (pushEpsilonValues[i]!=epsilon)
          nextStack.push(pushEpsilonValues[i])
      }
      let transitions = claus.epsilonState.arrows.filter(x => x.ableToPop(a,stack[stack.length-1])
        || x.ableToPop(a,epsilon)
        || x.ableToPop(epsilon,stack[stack.length-1]))
      console.log("transitions")
      console.log(transitions)
      transitions.forEach(t => {
        let popValue = t.name.split('/')[0].split(',')[1]
        let pushValues = t.name.split('/')[1].split(',')
        if (popValue!=epsilon) nextStack.pop()
        for (var i = pushValues.length - 1; i >= 0; i--) {
          if (pushValues[i]!=epsilon)
            nextStack.push(pushValues[i])
        }
        console.log("llego aqui")
        if(t.name.split('/')[0].split(',')[0]!=epsilon)
          returnValues = returnValues.concat(returnValues,this.matchStates(w.substring(1,w.length),[this.findState(t.to.name)],nextStack))
        else
          returnValues = returnValues.concat(returnValues,this.matchStates(w,[this.findState(t.to.name)],nextStack))
      })
    })
    console.log("returnValues")
    console.log(returnValues)
    return Array.from(new Set(returnValues))
  }
  return (clausuras.map(y => y.epsilonState)).find(x => x.isFinal)
}

  copyStack(stack){
    return stack.copy(stack)
  }
  contador=0
  consume(w, states, s){
    this.contador++
    if(this.contador>50){
      return this.contador;
    }
    console.log("original");
    console.log(s);
    var stack = this.copyStack(s)
    //let stack = Object.create(copiaStack)
    //stack.stack = Object.create(copiaStack)
    console.log("entro con ");
    console.log(states);
    console.log("stack");
    console.log(stack);
    console.log(stack.count);
    console.log(stack.top());
    console.log("cadena");
    console.log(w);
    if(w.length>0){
      let a = w.charAt(0)
      for(let e of states) {
        let arrows =[]
        console.log(e.name);
        arrows.push.apply(arrows, e.arrows.filter(ar => ar.validatePDA(a, stack.top())));
        if(arrows.length>0){
          console.log(arrows);
          console.log("ARROWS de "+arrows[0].from.name);

          let finish = false
          for(let arrow of arrows){
            console.log("evaluando arrow");
            console.log(arrow);
            console.log("cadena");
            console.log(w)
            console.log(stack);
            let li = this.getLabelInfo(arrow.name);
            if(li[1]!="e"){
              console.log("li"+li[1]+" es  igual a "+stack.top());
              if(li[1] == stack.top()){
                stack.pop()
                if(li[2]!="e"){
                  stack.push(li[2])
                }
              }else{
                continue;
              }
            }else{
              if(li[2]!="e"){
                stack.push(li[2])
              }
            }
            let statesWithClosing = this.clausura(arrow.to, stack)
            console.log("stats with clousing");
            console.log(statesWithClosing);
            if(!finish){
              if(li[0]=="e"){
                finish=this.consume(w,statesWithClosing, stack)
              }else {
                finish=this.consume(w.substring(1, w.length),statesWithClosing, stack)
              }
            }else {
              console.log("aqui else !finish");
              return finish
            }
          }
          console.log("aqui afuera for");
          return finish;
        }else{
          //console.log("aqui array<0");
          //return false
        }
      }
      //return false;
    }else{
      console.log("aqui final");
      return this.evaluateIfFinals(states)
    }
  }

  removeDuplicates(states){
    let nuevo =[]
    states.forEach( x => nuevo.indexOf(x) < 0? nuevo.push(x): null);
    return nuevo
  }

  evaluateIfFinals(states){
    for(let s of states){
      if(s.isFinal)
        return true
    }
    return false
  }

  getInitialState(){
    return this.states.filter(e => e.isInitial)[0]
  }

  getStepOne(){
		let initialState = this.getInitialState()
		let finalStates = this.states.filter(x => x.isFinal)
		let produced = []
    let ret =""
		finalStates.forEach(state => {
			//console.log('A -> ['+initialState.name+'Z0'+state.name+']')
      let produccion ='['+initialState.name+' Z0 '+state.name+']'
      ret += "A->"+produccion+"\n"
      this.produced.push(produccion)
		})
		return ret
	}

  getStepTwo(){
    let ret = ""

		for (let transition of this.edges) {
      let values = transition.name.split('/')
  		let leftValue = values[0].split(',')
  		let rightValue = values[1].split(',')
			if (rightValue.length == 0 || rightValue[0]==epsilon) {
				let from = transition.from.name;
				let to = transition.to.name;
				ret += "[" + from + " " + leftValue[1] + " " + to + "]->" + leftValue[0] + "\n";
				this.produced.push("[" + from + " " + leftValue[1] + " " + to + "]");
			}
		}

    return ret
  }

  getStepThree(){
    let ret = ""

		for(let transition of this.edges){
      let values = transition.name.split('/')
  		let leftValue = values[0].split(',')
  		let rightValue = values[1].split(',')
			if(rightValue.length > 0 && rightValue[0] != epsilon){
				let m = rightValue.length
				let permut = this.permut(m);
				let from = transition.from.name;
				for(let row of permut){
					//console.log(row);
					ret += "[" + from + " " + leftValue[1] + " " + row[m-1] + "]" + "->" + leftValue[0];
					this.produced.push("[" + from + " " + leftValue[1] + " " + row[m-1] + "]");

					for(let i = 0; i < m; i++){
						let p1 = from;
						if(i > 0)
							p1 = row[i-1];
						let p2 = row[i];


						ret += "[" + p1 + " " + rightValue[i] + " " + p2 + "]"
						this.produced.push("[" + p1 + " " + rightValue[i] + " " + p2 + "]")
					}

					ret += "\n";
				}
			}
		}

  return ret
  }

  permut(columns) {
		let states_count = this.states.length;
		let rows_count = Math.pow(states_count, columns);
		let states_label = this.states.map(x => x.name);

		let ret = [];
		for (let i = 0; i < rows_count; i++) {
			ret.push([])
			for (let j = 0; j < columns; j++) {
				ret[i].push("")
			}
		}

		for (let i = 0; i < columns; i++) {
			let incidences = Math.pow(states_count, columns - (i + 1));
			let current_state = 0;
			for (let j = 0; j < rows_count; j++) {
				if (j > 0 && j % incidences == 0)
					current_state++;
				if (current_state >= states_count)
					current_state = 0;
				ret[j][i] = states_label[current_state];
			}
		}

		return ret;
	}

	toCFG() {
		this.produced = [];
		let ret = "";
		ret += this.getStepOne();
		ret += this.getStepTwo();
		ret += this.getStepThree();

		/*this.produced = removeDuplicates(this.produced);
		let current_prod = 66;
		for(let prod of this.produced){
			ret = ret.split(prod).join(String.fromCharCode(current_prod++));
		}*/

		return ret;
  }

}

function removeDuplicates(array){
  let nuevo = [];
	array.forEach( x => nuevo.indexOf(x) < 0 ? nuevo.push(x) : null);
  return nuevo;
}
