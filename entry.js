import AFD from "./AFD.js"
import expect from 'expect'
import AFN from "./AFN.js"

const afn = new AFN()
afn.setAlphabet("0,1")
afn.addState("q0","q0",true,false)
afn.addState("q1","q1",false,false)
afn.addState("q2","q2",false,true)

afn.addArrowToStates("0|1", "0|1", "q0", "q0")
afn.addArrowToStates("0", "0", "q0", "q1")
afn.addArrowToStates("1", "1", "q1", "q2")

console.log(afn.consume("1001", afn.getInitialState()))
/*let algo = "hola"
let len = algo.length
let i = 0
while(i<len){
  i=i+1
  if(algo.length>0){
    algo = algo.substring(1,algo.length)
    console.log(algo)
  }else {
    break;
  }
}*/
/*let afd = undefined;

var nodes = [];
var edges = [];
var network = null;
// randomly create some nodes and edges
const data = {
  nodes: nodes,
  edges: edges
}

function destroy() {
  if (network !== null) {
    network.destroy();
    network = null;
  }
}

function draw() {
  destroy();
  nodes = new vis.DataSet([]);
  edges = new vis.DataSet([]);

  // create a network
  const container = document.getElementById('mynetwork');
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
            afd.removeEdgeFromArray(a)
          }
          for(let a of data.nodes){
            afd.removeStateFromArray(a);
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
            afd.removeEdgeFromArray(a)
          }
          for(let a of data.nodes){
            afd.removeStateFromArray(a);
          }
          //afd.removeEdgeFromArray(data.id)
          callback(data);
        }catch(err){
          confirm(err.message)
        }
      }
    }
  };
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
  if(initial)
    data.color = 'lime'
  if(final)
    data.color = 'red'
  if(initial && final)
    data.color = 'orange'
  try{
    if(!data.edit){
      afd.addState(data.label,data.id,initial,final);
    }else {
      afd.editState(data.label,data.id,initial,final)
    }
    clearNodePopUp();
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

      afd.addArrowToStates(data.label, data.id,data.from, data.to)
    }else{
      afd.editArrowName(data.label, data.id)
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
  afd = new AFD()
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
  afd.setAlphabet(input.value)
})

function handleClick() {
  try{
    let result = afd.consume(document.getElementById('W').value)
    if(result){
      document.getElementById('message').style.color = "green";
      document.getElementById('message').innerHTML = "The W was accepted"
    }else{
      document.getElementById('message').style.color = "red";
      document.getElementById('message').innerHTML = "The W was denied"
    }
  }catch(err){
    confirm(err.message)
  }
}*/
