import AFD from "./AFD.js"
import expect from 'expect'
import AFN from "./AFN.js"
import AFNE from "./NFA-E.js"
import {setEpsilonStateTable,getNewDFAFromNFAE} from "./NFAEToDFA.js"
import {setStateTable, getNewDFAFromNFA} from "./Utils.js"
import {getRegexFrom} from "./DFAToRegEx.js"
import {regexToNFAe} from "./RegExToNFAE.js"
import {getDFAs} from "./examplesAutomatons.js"
import {unionAutomaton, intersectionAutomaton, differenceAutomaton, complementAutomaton} from "./AutomataOperations.js"
import {setReducedTable, getAutomata} from "./minimize.js"
import Stack from "./stack.js"
let afn = undefined;
let afd = undefined;
let afn_e = undefined;
var nodes = [];
var edges = [];
var network = null;

var DFARadio = document.getElementById('DFA');
var NFARadio = document.getElementById('NFA');
var NFAERadio = document.getElementById('NFAE');
var regexRadio = document.getElementById('regexRadio')
var operacionesRadio = document.getElementById('operaciones');
var pdaRadio = document.getElementById('pdaRadio');
//---------------------
//console.log(setReducedTable(afd));
import PDA from "./PDA.js"

let pda =undefined;// new PDA()
// const palindromoPar = new PDA()
// palindromoPar.setAlphabet("0,1")
// palindromoPar.addState('q0','q0',true)
// palindromoPar.addState('q1',"q1")
// palindromoPar.addState('q2',"q2")
// palindromoPar.addState('q3',"q3",false,true)
//
// palindromoPar.addArrowToStates('0,Z0/0,Z0','0,Z0/0,Z0','q0','q0')
// palindromoPar.addArrowToStates('0,0/0,0','0,0/0,0','q0','q0')
// palindromoPar.addArrowToStates('1,0/1,0','1,0/1,0','q0','q0')
// palindromoPar.addArrowToStates('1,1/1,1','1,1/1,1','q0','q0')
// palindromoPar.addArrowToStates('1,Z0/Z0','1,Z0/Z0','q0','q0')
// palindromoPar.addArrowToStates('0,1/0,1','0,1/0,1','q0','q0')
//
// palindromoPar.addArrowToStates('0,0/e','0,0/e','q1','q1')
// palindromoPar.addArrowToStates('1,1/e','1,1/e','q2','q2')
//
// palindromoPar.addArrowToStates('e,0/0','epsilon,0/0','q0','q1')
// palindromoPar.addArrowToStates('e,1/1','epsilon,1/1','q0','q2')
// palindromoPar.addArrowToStates('1,1/e','1,1/e','q1','q2')
// palindromoPar.addArrowToStates('0,0/e','0,0/e','q2','q1')
// palindromoPar.addArrowToStates('e,Z0/Z0','e,Z0/Z0','q1','q3')
// palindromoPar.addArrowToStates('e,Z0/Z0','e,Z0/Z0','q2','q3')
//
// console.log(palindromoPar.match("01100"));
// pda.setAlphabet("(,)")
// pda.addState("q0","q0",true, true)
// pda.addState("q1","q1",false, false)
//
// pda.addArrowToStates("e,e/$","e,e/$","q0","q1")
// pda.addArrowToStates("(,e/*","(,e/*","q1","q1")
// pda.addArrowToStates("),*/e","),*/e","q1","q1")
// pda.addArrowToStates("e,$/e","e,$/e","q1","q0")
//
// console.log("AQUi------------------------");
//
// let stack = new Stack();
// stack.push("z0")
// let states =pda.clausura(pda.getInitialState(),stack)
// console.log(states);
// console.log("afuera");
// console.log(stack);
// console.log(pda.consume("(()))", states,stack));

//---------------------
let listOfExamples = getDFAs();
var select = document.getElementById('first-select');
var select2 = document.getElementById('second-select');
function populateSelects(){
  var dataSelect = [];
  for(let i=0; i< listOfExamples.length; i++){
    dataSelect.push({text: `Ejemplo ${i}`, value:i })
  }
  select.options.length = 0; // clear out existing items
  for(var i=0; i < dataSelect.length; i++) {
      var d = dataSelect[i];
      select.options.add(new Option(d.text, i))
  }

  select2.options.length = 0; // clear out existing items
  for(var i=0; i < dataSelect.length; i++) {
      var d = dataSelect[i];
      select2.options.add(new Option(d.text, i))
  }
}
//---------------------
// randomly create some nodes and edges
var data = {
  nodes: [],
  edges: []
}

function destroy() {
  if (network !== null) {
    network.destroy();
    network = null;
  }
}

function draw() {
  destroy();
  const options = {
    edges:{
      arrows: {
        to:     {enabled: true, scaleFactor:1, type:'arrow'}
      }
    },
    manipulation: {
      addNode: function (data, callback) {
        // filling in the popup DOM elements
        document.getElementById('node-operation').innerHTML = "Add Node";
        data.edit = false;
        editNode(data, callback);
      },
      editNode: function (data, callback) {
        // filling in the popup DOM elements
        data.edit = true;
        document.getElementById('node-operation').innerHTML = "Edit Node";
        editNode(data, callback);
      },
      deleteNode: function (data, callback){
        try{
          for(let a of data.edges){
            if(DFARadio.checked){
              afd.removeEdgeFromArray(a)
            }else if(NFARadio.checked){
              afn.removeEdgeFromArray(a)
            }else if(NFAERadio.checked){
              afn_e.removeEdgeFromArray(a)
            }else if(pdaRadio.checked){
              pda.removeEdgeFromArray(a)
            }
          }
          for(let a of data.nodes){
            if(DFARadio.checked){
              afd.removeStateFromArray(a);
            }else if(NFARadio.checked){
              afn.removeStateFromArray(a);
            }else if(NFAERadio.checked){
              afn_e.removeStateFromArray(a)
            }else if(pdaRadio.checked){
              pda.removeStateFromArray(a)
            }
          }
          callback(data);
        }catch(err){
          confirm(err.message)
        }
      },
      addEdge: function (data, callback) {
        if (data.from == data.to) {
          var r = confirm("Do you want to connect the node to itself?");
          if (r != true) {
            callback(null);
            return;
          }
        }
        document.getElementById('edge-operation').innerHTML = "Add Edge";
        data.edit = false;
        console.log("Adding in")
        console.log(data)
        editEdgeWithoutDrag(data, callback);
      },
      editEdge: {
        editWithoutDrag: function(data, callback) {
          document.getElementById('edge-operation').innerHTML = "Edit Edge";
          data.edit = true;
          console.log("editing in")
          console.log(data)
          editEdgeWithoutDrag(data,callback);
        }
      },
      deleteEdge: function (data, callback){
        try{
          for(let a of data.edges){
            if(DFARadio.checked){
              afd.removeEdgeFromArray(a)
            }else if(NFARadio.checked){
              afn.removeEdgeFromArray(a)
            }else if(NFAERadio.checked){
              afn_e.removeEdgeFromArray(a)
            }else if(pdaRadio.checked){
              pda.removeEdgeFromArray(a)
            }
          }
          for(let a of data.nodes){
            if(DFARadio.checked){
              afd.removeStateFromArray(a);
            }else if(NFARadio.checked){
              afn.removeStateFromArray(a);
            }else if(NFAERadio.checked){
              afn_e.removeStateFromArray(a)
            }else if(pdaRadio.checked){
              pda.removeStateFromArray(a)
            }
          }
          //afd.removeEdgeFromArray(data.id)
          callback(data);
        }catch(err){
          confirm(err.message)
        }
      }
    }
  };
  const container = document.getElementById('mynetwork');
  network = new vis.Network(container, data, options);
}

function editNode(data, callback) {
  document.getElementById('node-label').value = data.label;
  document.getElementById('node-saveButton').onclick = saveNodeData.bind(this, data, callback);
  document.getElementById('node-cancelButton').onclick = clearNodePopUp.bind();
  document.getElementById('node-popUp').style.display = 'block';
}

function clearNodePopUp() {
  document.getElementById('node-saveButton').onclick = null;
  document.getElementById('node-cancelButton').onclick = null;
  document.getElementById('node-popUp').style.display = 'none';
  document.getElementById('isInitial').checked = false;
  document.getElementById('isFinal').checked = false;
}

function cancelNodeEdit(callback) {
  clearNodePopUp();
  callback(null);
}



function saveNodeData(data, callback) {
  data.label = document.getElementById('node-label').value;
  let initial=false, final=false;
  if(document.getElementById('isInitial').checked)
    initial=true
  if(document.getElementById('isFinal').checked)
    final = true
  if(initial && final){
    data.color = 'orange'
  }else if(initial){
    data.color = 'lime'
  }else if(final){
    data.color = 'red'
  }else{
    console.log("entro")
    data.color = null
  }
  try{
    if(!data.edit){
      if(DFARadio.checked){
        afd.addState(data.label,data.id,initial,final);
      }else if(NFARadio.checked){
        //console.log("NFA")
        afn.addState(data.label,data.id,initial,final);
      }else if(NFAERadio.checked){
        //console.log("nfae")
        afn_e.addState(data.label,data.id,initial,final);
      }else if(pdaRadio.checked){
        pda.addState(data.label, data.id, initial, final)
      }
    }else {
      if(DFARadio.checked){
        afd.editState(data.label,data.id,initial,final)
      }else if(NFARadio.checked){
        afn.editState(data.label,data.id,initial,final)
      }else if(NFAERadio.checked){
        afn_e.editState(data.label,data.id,initial,final);
      }else if(pdaRadio.checked){

      }
    }
    clearNodePopUp();
    console.log(data)
    callback(data);
  }catch(err){
    confirm(err.message)
  }
}

function editEdgeWithoutDrag(data, callback) {
  // filling in the popup DOM elements
  document.getElementById('edge-label').value = data.label;
  document.getElementById('edge-saveButton').onclick = saveEdgeData.bind(this, data, callback);
  document.getElementById('edge-cancelButton').onclick = cancelEdgeEdit.bind(this,callback);
  document.getElementById('edge-popUp').style.display = 'block';
}

function clearEdgePopUp() {
  document.getElementById('edge-saveButton').onclick = null;
  document.getElementById('edge-cancelButton').onclick = null;
  document.getElementById('edge-popUp').style.display = 'none';
}

function cancelEdgeEdit(callback) {
  clearEdgePopUp();
  callback(null);
}



function saveEdgeData(data, callback) {
  if (typeof data.to === 'object'){
    data.to = data.to.id
  }
  if (typeof data.from === 'object'){
    data.from = data.from.id
  }
  data.label = document.getElementById('edge-label').value;
  //console.log(data)
  try{
    if(!data.edit){
      data.id = Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);//`${data.from}-${data.label}-${data.to}`;

      if(DFARadio.checked){
        afd.addArrowToStates(data.label, data.id,data.from, data.to)
      }else if(NFARadio.checked){
        afn.addArrowToStates(data.label, data.id,data.from, data.to)
      }else if(NFAERadio.checked){
        afn_e.addArrowToStates(data.label, data.id,data.from, data.to)
      }else if(pdaRadio){
        pda.addArrowToStates(data.label, data.id, data.from, data.to)
      }
    }else{
      if(DFARadio.checked){
        afd.editArrowName(data.label, data.id)
      }else if(NFARadio.checked){
        afn.editArrowName(data.label, data.id)
      }else if(NFAERadio.checked){
        afn_e.editArrowName(data.label, data.id)
      }
    }
    clearEdgePopUp();
    callback(data);
  }catch(err){
    confirm(err.message)
  }
}
function init() {
  draw();
  try{
  afn = new AFN()
  afd = new AFD()
  afn_e = new AFNE()
  pda = new PDA()
  evaluateButtonApperance();
  populateSelects();
}catch(err){
  confirm(err.message)
}
}

var body = document.getElementById('body');
body.onload = init();

let button = document.getElementById('execButton');
button.addEventListener('click', () => {
    handleClick(); // (A)
});

let input = document.getElementById('alphabet');
input.addEventListener('input', function() {
  if(DFARadio.checked){
    afd.setAlphabet(input.value)
  }else if(NFARadio.checked){
    afn.setAlphabet(input.value)
  }else if(NFAERadio.checked){
    afn_e.setAlphabet(input.value)
  }else if(pdaRadio.checked){
    pda.setAlphabet(input.value)
  }
})


function handleClick() {
  //try{
    let result = false;
    if(DFARadio.checked){
      result = afd.consume(document.getElementById('W').value);
    }else if(NFARadio.checked){
      console.log("Entro nfa")
      result =afn.consume(document.getElementById('W').value, afn.getInitialState())
    }else if(NFAERadio.checked){
      console.log("Entro nfae")
      result =afn_e.consume(document.getElementById('W').value,afn_e.clausura(afn_e.getInitialState()))
    }else if(pdaRadio.checked){
      result = pda.match(document.getElementById('W').value)
    }
    if(result){
      document.getElementById('message').style.color = "green";
      document.getElementById('message').innerHTML = "The value of W was accepted"
    }else{
      document.getElementById('message').style.color = "red";
      document.getElementById('message').innerHTML = "The value of W was denied"
    }
  //}catch(err){
    //confirm(err.message+err.)
  //}
}

function evaluateButtonApperance(){
  document.getElementById('saveButton').style.display="none";
  document.getElementById('execFromNFAToDFAButton').style.display="none";
  document.getElementById('execFromNFAEToDFAButton').style.display="none";
  document.getElementById('fromDFAToRegexButton').style.display="none";
  document.getElementById('saveButton').style.display="none";
  document.getElementById('regExToNFAEButton').style.display="none";
  document.getElementById('minimizarButton').style.display="none";
  if(DFARadio.checked){
    document.getElementById('fromDFAToRegexButton').style.display="block";
    document.getElementById('saveButton').style.display="block";
    document.getElementById('minimizarButton').style.display="block";
  }else if(NFARadio.checked){
    document.getElementById('execFromNFAToDFAButton').style.display="block";
    document.getElementById('fromDFAToRegexButton').style.display="block";
  }else if(NFAERadio.checked){
    document.getElementById('execFromNFAEToDFAButton').style.display="block";
  }else if(regexRadio.checked){
    document.getElementById('regExToNFAEButton').style.display="block";
  }else if(operacionesRadio.checked){
    document.getElementById('Automata-PopUp').style.display= 'block';
    populateSelects();
  }
}
let radios = document.getElementsByName('automata');
radios.forEach(x => (
  x.onclick = function(){
    afn = new AFN()
    afd = new AFD()
    afn_e = new AFNE()
    pda = new PDA()
    data={
      nodes:[],
      edges:[]
    }
      draw();
      evaluateButtonApperance();
  }
))

let fromDFAToRegexButton = document.getElementById('fromDFAToRegexButton');
fromDFAToRegexButton.addEventListener('click', ()=>{
  let regex = getRegexFrom(DFARadio.checked?afd: afn);
  document.getElementById('message').style.color = "green";
  document.getElementById('message').innerHTML = `${regex}`
})
let execFromNFAToDFAButton = document.getElementById('execFromNFAToDFAButton');
execFromNFAToDFAButton.addEventListener('click', () => {
    handleFromNFAToDFAButton(); // (A)
});
function handleFromNFAToDFAButton(){
  setStateTable(afn)
  let newDataSet= getNewDFAFromNFA()
  afd.setAlphabet(input.value)
  for(let stateObj of newDataSet.nodes){
    let initial = false, final = false
    if(stateObj.color == 'lime' || stateObj.color == 'orange'){
      initial=true
    }
    if(stateObj.color == 'red' || stateObj.color == 'orange'){
      final = true
    }
    afd.addState(stateObj.label, stateObj.id,initial, final )
  }

  for(let edgesObj of newDataSet.edges){
    let id = Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    afd.addArrowToStates(edgesObj.label,id,edgesObj.from,edgesObj.to)
  }
  data = null
  data = newDataSet;
  NFARadio.checked=false
  DFARadio.checked=true
  draw()
  evaluateButtonApperance();
}

let execFromNFAEToDFAButton = document.getElementById('execFromNFAEToDFAButton');
execFromNFAEToDFAButton.addEventListener('click', () => {
    handleFromNFAEToDFAButton(); // (A)
});
function handleFromNFAEToDFAButton(){
  setEpsilonStateTable(afn_e)
  let newDataSet= getNewDFAFromNFAE()
  console.log(newDataSet)
  afd.setAlphabet(input.value)
  for(let stateObj of newDataSet.nodes){
    let initial = false, final = false
    if(stateObj.color == 'lime' || stateObj.color == 'orange'){
      initial=true
    }
    if(stateObj.color == 'red' || stateObj.color == 'orange'){
      final = true
    }
    afd.addState(stateObj.label, stateObj.id,initial, final )
  }

  for(let edgesObj of newDataSet.edges){
    let id = Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    afd.addArrowToStates(edgesObj.label,id,edgesObj.from,edgesObj.to)
  }
  data = null
  data = newDataSet;
  NFAERadio.checked = false
  DFARadio.checked=true
  evaluateButtonApperance();
  draw()
}
function getColor(initial, final){
  if(initial && final){
    return 'orange'
  }else if(initial){
    return 'lime'
  }else if(final){
    return 'red'
  }else{
    return null
  }
}
let regExToNFAEButton = document.getElementById('regExToNFAEButton');
regExToNFAEButton.addEventListener('click', ()=> {
  let regexInput = document.getElementById('regex');
  afn_e = regexToNFAe(regexInput.value);
  var nodes = []
  var edges = []
  for(let state of afn_e.states ){
    console.log(state)
    nodes.push({id:state.id, label:state.name, color: getColor(state.isInitial, state.isFinal)})
  }
  for(let e of afn_e.edges){
    edges.push({from:e.from.id, to:e.to.id,label:e.name, id:e.id })
  }
  data = null;
  data = {
    nodes: nodes,
    edges: edges
  }
  NFAERadio.checked = true
  DFARadio.checked=false
  NFARadio.checked=false
  evaluateButtonApperance();
  input.value = Array.from(afn_e.alphabet).join(",");
  draw()
})

document.getElementById('view-Button1').addEventListener('click', () => {
  var value = select.options[select.selectedIndex].value;
  let automata = listOfExamples[value]
  data = {
    nodes:[],
    edges:[]
  };
  draw()
  data = automata.toDataSet();
  NFAERadio.checked = false
  DFARadio.checked=true
  NFARadio.checked=false
  evaluateButtonApperance()
  input.value = Array.from(automata.alphabet).join(",");
  afd=automata;
  draw()
});


document.getElementById('view-Button2').addEventListener('click', () => {
  var value = select2.options[select2.selectedIndex].value;
  let automata = listOfExamples[value]
  data = {
    nodes:[],
    edges:[]
  };
  draw()
  data = automata.toDataSet();
  NFAERadio.checked = false
  DFARadio.checked=true
  NFARadio.checked=false
  evaluateButtonApperance()
  afd=automata;
  input.value = Array.from(automata.alphabet).join(",");
  draw()
});

document.getElementById('union-Button').addEventListener('click', () =>{
  let value1 = select.options[select.selectedIndex].value
  let value2 = select2.options[select2.selectedIndex].value
  let automata1 = listOfExamples[value1]
  let automata2 = listOfExamples[value2]

  let newAutomata=unionAutomaton(automata1,automata2)
  data = {
    nodes:[],
    edges:[]
  };
  draw()
  data = newAutomata.toDataSet();
  NFAERadio.checked = false
  DFARadio.checked=true
  NFARadio.checked=false
  evaluateButtonApperance()
  afd=newAutomata;
  input.value = Array.from(newAutomata.alphabet).join(",");
  draw()
  //console.log(newAutomata);
});

document.getElementById('interseccion-Button').addEventListener('click', () =>{
  let value1 = select.options[select.selectedIndex].value
  let value2 = select2.options[select2.selectedIndex].value
  let automata1 = listOfExamples[value1]
  let automata2 = listOfExamples[value2]

  let newAutomata=intersectionAutomaton(automata1,automata2)
  data = {
    nodes:[],
    edges:[]
  };
  draw()
  data = newAutomata.toDataSet();
  NFAERadio.checked = false
  DFARadio.checked=true
  NFARadio.checked=false
  evaluateButtonApperance()
  input.value = Array.from(newAutomata.alphabet).join(",");
  afd=newAutomata;
  draw()
  //console.log(newAutomata);
});

document.getElementById('direfencia-Button').addEventListener('click', () =>{
  let value1 = select.options[select.selectedIndex].value
  let value2 = select2.options[select2.selectedIndex].value
  let automata1 = listOfExamples[value1]
  let automata2 = listOfExamples[value2]

  let newAutomata=differenceAutomaton(automata1,automata2)
  data = {
    nodes:[],
    edges:[]
  };
  draw()
  data = newAutomata.toDataSet();
  NFAERadio.checked = false
  DFARadio.checked=true
  NFARadio.checked=false
  evaluateButtonApperance()
  input.value = Array.from(newAutomata.alphabet).join(",");
  afd=newAutomata;
  draw()
  //console.log(newAutomata);
});

document.getElementById('complemento-Button').addEventListener('click', () =>{
  let value1 = select.options[select.selectedIndex].value
  let automata1 = listOfExamples[value1]

  let newAutomata=complementAutomaton(automata1)
  data = {
    nodes:[],
    edges:[]
  };
  draw()
  data = newAutomata.toDataSet();
  NFAERadio.checked = false
  DFARadio.checked=true
  NFARadio.checked=false
  evaluateButtonApperance()
  input.value = Array.from(newAutomata.alphabet).join(",");
  afd=newAutomata;
  draw()
  //console.log(newAutomata);
});

document.getElementById('automata-cancelButton').addEventListener('click', () =>{
  document.getElementById('Automata-PopUp').style.display= 'none';
});
document.getElementById('saveButton').addEventListener('click', () => {
  listOfExamples.push(afd)
});

document.getElementById('minimizarButton').addEventListener('click', () => {
  let nuevo = setReducedTable(afd);
  data = {
    nodes:[],
    edges:[]
  };
  draw()
  data = nuevo.toDataSet();
  NFAERadio.checked = false
  DFARadio.checked=true
  NFARadio.checked=false
  evaluateButtonApperance()
  input.value = Array.from(nuevo.alphabet).join(",");
  afd=nuevo;
  draw()
})
