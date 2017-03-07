import AFD from "./AFD.js"
var table = []

export function setReducedTable(afd){
  console.log(afd.states);
  let colStates = afd.states.slice(0,afd.states.length-1)
	let rowStates = afd.states.slice(1,afd.states.length)
  console.log(colStates);
  console.log(rowStates);
  for(let x=0; x<colStates.length; x++){
    table.push(new Array(rowStates.length-x))
	}
  setDefaultValue();
  console.log(table);
  setNotEquivalentByAceptationValidation(colStates, rowStates);
  for(let x=0;x<table.length;x++){
    for(let y=0; y< table[x].length;y++){
      let colState = colStates[x];
      let rowState = rowStates[y+x];
      //console.log(`saco ${colState.name} en ${x}`);
      //console.log(`saco ${rowState.name} en ${y}`);
      if(table[x][y]!='X'){
        table[x][y] = getEquivalentValidation(colState,rowState, afd.alphabet, colStates, rowStates);
      }
    }
  }
  for(let x=0;x<table.length;x++){
    for(let y=0; y< table[x].length;y++){
      let colState = colStates[x];
      let rowState = rowStates[y+x];
      if(table[x][y]==' '){
        table[x][y] = getEquivalentValidation(colState,rowState, afd.alphabet, colStates, rowStates);
      }
    }
  }
  console.log(table);
  return getAutomata(afd, colStates, rowStates)
}

export function getAutomata(afd, colStates, rowStates){
  let nuevo = new AFD(afd.alphabet)

  for(let x=0;x<table.length;x++){
    let encontro = []
    let colState = colStates[x];
    encontro.push(colState.name)
    for(let y=0; y< table[x].length;y++){
      if(table[x][y]=='Y'){
        encontro.push(rowStates[y+x].name);
      }
    }
    touchState(encontro, afd);
    let name = encontro.sort().join(",");
    nuevo.addState(name, name, stateIsInitial(name,afd),stateIsFinal(name,afd))
  }

  let notTouched = afd.states.filter( x=> !x.touch)
  if(notTouched.length>0){
    for(let s of notTouched)
      nuevo.addState(s.name, s.name, s.isInitial, s.isFinal);
  }

  for(let s of afd.states){
    try{
      s.arrows.forEach(a => {
        let from = findStateByName(a.from.name, nuevo)
        let to = findStateByName(a.to.name, nuevo)
        let arrow = nuevo.edges.filter(x=> x.from == from && x.to == to)[0]

        if(arrow){
          //console.log("encontroooooo");
          if(arrow.name != a.name)
            arrow.name +="|"+a.name
        }else
          nuevo.addArrowToStates(a.name, a.id,from.name,to.name);
      })
    }catch(error){console.log('encontrado uno igual'+error.message);}
  }
  return nuevo;
}

function touchState(encontro, afd){
  afd.states.forEach(e=> {
    encontro.forEach(n => {
      if(e.name ==n){
        e.touched();
      }
    })
  });
}

function findStateByName(name, nuevo){
  return nuevo.states.filter(x => {
    for(let n of x.name.split(",")){
      if(n == name)
        return true
    }
    return false
  })[0]
}
function stateIsInitial(name, afd){
  let initial = afd.getInitialState();
  for(let n of name.split(",")){
    if(n==initial.name)
      return true
  }
  return false;
}

function stateIsFinal(name, afd){
  let finals = afd.states.filter(e => e.isFinal);
  for(let f of finals){
    for(let n of name.split(",")){
      if(n == f.name){
        return true
      }
    }
  }
  return false;
}
function getEquivalentValidation(colState, rowState, alphabet, cols, rows){
  let states = []
  for(let a of alphabet){
    console.log(`evaluando ${colState.name}  ${rowState.name} con  ${a}`);
    states.push(getToState(colState,a))
    states.push(getToState(rowState,a))
  }

    let pass = false;
  for(let i =0; i<states.length;i+=2){
    let toState1 = states[i]
    let toState2 = states[i+1]
    //console.log(`obtuvo en 2 ${toState1.name} ${toState2.name}`);

    if(toState1 && toState2){
      if((toState1 ==toState2)||(toState1 == colState && toState2==rowState) ||(toState2 == colState && toState1==rowState)){
        pass = true
        continue;
        //return "Y"
      }
      let x = cols.indexOf(toState1)
      let y = rows.indexOf(toState2)
      console.log(` x ${x} ${toState1.name} y ${y} ${toState2.name}`);
      if(x<0|| y<0){
        if(table[x][y]=="X")
          return "X"
        else
          pass = true
      }
    }
  }
  return pass?"Y":" ";
}

function areequals(array){
  let equal = false
  let toState1 = array[0]
  let toState2 = array[1]
  for(let i=0; i<array.length; i+=2){
    let toState3 = array[i]
    let toState4 = array[i+1]
    if(toState1==toState3 && toState2==toState4)
      equal = true
  }
  return equal;
}

function getToState(state,a){
  let arrow= state.arrows.filter(x => {
    for(let n of x.name.split("|")){
      if(a == n)
        return true;
    }
    return false;
  })[0]
  if(arrow)
    return arrow.to
  return undefined
}

function setDefaultValue(){
  for(let x=0; x< table.length;x++){
    for(let y=0; y< table[x].length;y++){
      table[x][y]=" ";
    }
  }
}

function setNotEquivalentByAceptationValidation(colStates, rowStates){
  for(let x=0;x<table.length;x++){
    for(let y =0;y<table[x].length;y++){
      let colState = colStates[x];
      let rowState = rowStates[y];
      //console.log(colState.isFinal);
      //console.log(rowState.isFinal);
      console.log(`x ${x} y ${y}`);
      table[x][y] = (colState.isFinal != rowState.isFinal)?'X':' ';
    }
  }
}
