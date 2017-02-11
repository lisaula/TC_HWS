import AFD from "./AFD.js"
import expect from 'expect'
import AFN from "./AFN.js"
import AFNE from "./NFA-E.js"
import {setEpsilonStateTable} from "./NFAEToDFA.js"
let afn = undefined;
let afd = undefined;
//------------------------------------------
let afn_e = new AFNE();
afn_e.setAlphabet("0,1")
afn_e.addState("q0", "q0",true,false)
afn_e.addState("q1", "q1",false,false)
afn_e.addState("q2", "q2",false,false)
afn_e.addState("q3", "q3",false,true)

afn_e.addArrowToStates("1","1","q0","q1")
afn_e.addArrowToStates("e","e","q1","q0")
afn_e.addArrowToStates("0","0","q1","q2")
afn_e.addArrowToStates("1","1(1)","q2","q3")
afn_e.addArrowToStates("e","e(1)","q2","q3")
setEpsilonStateTable(afn_e)
//let initials = afn_e.states.filter(e=>e.isInitial)[0]
//console.log(afn_e.consume("",afn_e.clausura(initials)))

//------------------------------------------
var nodes = [];
var edges = [];
var network = null;

var DFARadio = document.getElementById('DFA');
var NFARadio = document.getElementById('NFA');
var NFAERadio = document.getElementById('NFAE');

import {setStateTable, getNewDFAFromNFA} from "./Utils.js"

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
            }
          }
          for(let a of data.nodes){
            if(DFARadio.checked){
              afd.removeStateFromArray(a);
            }else if(NFARadio.checked){
              afn.removeStateFromArray(a);
            }else if(NFAERadio.checked){
              afn_e.removeStateFromArray(a)
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
            }
          }
          for(let a of data.nodes){
            if(DFARadio.checked){
              afd.removeStateFromArray(a);
            }else if(NFARadio.checked){
              afn.removeStateFromArray(a);
            }else if(NFAERadio.checked){
              afn_e.removeStateFromArray(a)
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
      }
    }else {
      if(DFARadio.checked){
        afd.editState(data.label,data.id,initial,final)
      }else if(NFARadio.checked){
        afn.editState(data.label,data.id,initial,final)
      }else if(NFAERadio.checked){
        afn_e.editState(data.label,data.id,initial,final);
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
    afn_e.setAlphabet(input.value+",e")
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
  draw()
}
