import AFD from "./AFD.js"
import expect from 'expect'
let afd = undefined;

function newState(state, isInitial, isFinal){
  afd.addState(state, isInitial, isFinal)
}

function newArrow(name, fromName, toName){
  afd.addArrowToStates(name,fromName, toName)
}

function consume(w){
  return afd.consume(w);
}

function imprimir(algo){
  console.log(algo)
}

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
        console.log(data)
        editNode(data, callback);
      },
      editNode: function (data, callback) {
        // filling in the popup DOM elements
        document.getElementById('node-operation').innerHTML = "Edit Node";
        editNode(data, callback);
      },
      deleteNode: function (data, callback){
        for(let a of data.edges){
          afd.removeEdgeFromArray(a)
        }
        for(let a of data.nodes){
          afd.removeStateFromArray(a);
        }
        callback(data);
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
        editEdgeWithoutDrag(data, callback);
      },
      editEdge: {
        editWithoutDrag: function(data, callback) {
          document.getElementById('edge-operation').innerHTML = "Edit Edge";
          editEdgeWithoutDrag(data,callback);
        }
      },
      deleteEdge: function (data, callback){
        for(let a of data.edges){
          afd.removeEdgeFromArray(a)
        }
        for(let a of data.nodes){
          afd.removeStateFromArray(a);
        }
        //afd.removeEdgeFromArray(data.id)
        callback(data);
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
  afd.addState(data.id,initial,final);
  clearNodePopUp();
  callback(data);
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
  data.id = `${data.from}-${data.label}-${data.to}`;
  afd.addArrowToStates(data.label, data.id,data.from, data.to)
  clearEdgePopUp();
  callback(data);
}
function init() {
  draw();
  afd = new AFD()
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
  let result = afd.consume(document.getElementById('W').value)
  let msg = result? "The W was accepted": "The W is not accepted";
  confirm(msg)
}
