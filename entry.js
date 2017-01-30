import AFD from "./AFD.js"
import expect from 'expect'
const afd = new AFD("0,1")

afd.addState("q0", true, false)
afd.addState("q1")
afd.addState("q2")
afd.addState("q3", false, true)

afd.addArrowToStates("0", "q0", "q1" )
afd.addArrowToStates("1", "q0", "q0" )

afd.addArrowToStates("0", "q1", "q2" )
afd.addArrowToStates("1", "q1", "q0" )

afd.addArrowToStates("0", "q2", "q3" )
afd.addArrowToStates("1", "q2", "q0" )

afd.addArrowToStates("0|1", "q3", "q3" )
//afd.addArrowToStates("a", "q3", "q3" )



if(afd.consume("1101011100")){
  console.log("paso")
}else{
  console.log("no paso")
}

if(afd.consume("011011000")){
  console.log("paso")
}else{
  console.log("no paso")
}
