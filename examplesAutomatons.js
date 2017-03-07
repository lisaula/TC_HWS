import AFD from "./AFD.js"
import PDA from "./PDA.js"
const automDFA = new AFD()
automDFA.setAlphabet("0,1")

automDFA.addState('q0','q0', true)
automDFA.addState('0','0')
automDFA.addState('00','00')
automDFA.addState('000','000', false, true)

automDFA.addArrowToStates('1', '1', 'q0','q0')
automDFA.addArrowToStates('0','0','q0','0')
automDFA.addArrowToStates('1','1(0)','0','q0')
automDFA.addArrowToStates('0','0(0)','0','00')
automDFA.addArrowToStates('1','1(1)','00','q0')
automDFA.addArrowToStates('0','0(1)','00','000')
automDFA.addArrowToStates('0|1','0|1','000','000')

const automDFA2 = new AFD()
automDFA2.setAlphabet("0,1")
automDFA2.addState('q0','q0', true,true)
automDFA2.addState('q1','q1')

automDFA2.addArrowToStates('1','1','q0','q0')
automDFA2.addArrowToStates('0','0','q0','q1')
automDFA2.addArrowToStates('0','0(1)','q1','q1')
automDFA2.addArrowToStates('1','1(1)','q1','q0')

const comienzaEnCero = new AFD()
comienzaEnCero.setAlphabet("0,1")
comienzaEnCero.addState('q0','q0',true)
comienzaEnCero.addState('q1','q1',false,true)

comienzaEnCero.addArrowToStates('0','0','q0','q1')
comienzaEnCero.addArrowToStates('0|1','0|1','q1','q1')

const afd = new AFD();
afd.setAlphabet("0,1")
afd.addState("s0","s0", true)
afd.addState("s1","s1", false,true)
afd.addState("s2","s2", false,true)

afd.addArrowToStates("0","0","s0","s2")
afd.addArrowToStates("1","1","s0","s1")
afd.addArrowToStates("0","0(0)","s1","s1")
afd.addArrowToStates("1","1(0)","s1","s2")
afd.addArrowToStates("0|1","0|1","s2","s2")

const afd2 = new AFD();
afd2.setAlphabet("0,1")
afd2.addState("q0","q0", true)
afd2.addState("q1","q1", false,true)

afd2.addArrowToStates("0","0","q0","q1")
afd2.addArrowToStates("0","0(0)","q1","q1")
afd2.addArrowToStates("1","1","q1","q0")
afd2.addArrowToStates("1","1(0)","q0","q0")


const afd3 = new AFD();
afd3.setAlphabet("0,1")

afd3.addState("q0","q0", true, true)
afd3.addState("q1","q1")
afd3.addState("q2","q2")
afd3.addState("q3","q3")
afd3.addArrowToStates("0","0","q0","q2")
afd3.addArrowToStates("0","0(0)","q2","q0")
afd3.addArrowToStates("1","1","q0","q1")
afd3.addArrowToStates("1","1(0)","q1","q0")
afd3.addArrowToStates("0","0(1)","q3","q1")
afd3.addArrowToStates("0","0(2)","q1","q3")
afd3.addArrowToStates("1","1(1)","q2","q3")
afd3.addArrowToStates("1","1(2)","q3","q2")

const afd4 = new AFD();
afd4.setAlphabet("0,1")
afd4.addState("q0","q0", true, false)
afd4.addState("q1","q1",false, true)
afd4.addState("q2","q2")

afd4.addArrowToStates("0","0","q0","q1")
afd4.addArrowToStates("0","0(0)","q1","q0")
afd4.addArrowToStates("0","0(1)","q2","q1")
afd4.addArrowToStates("1","1","q0","q0")
afd4.addArrowToStates("1","1(0)","q1","q1")
afd4.addArrowToStates("1","1(1)","q2","q0")

const inge = new AFD()
inge.setAlphabet("a,b,c")

inge.addState("q0","q0",true,true)
inge.addState("q1","q1",false,true)
inge.addState("q2","q2",false,true)
inge.addState("q3","q3",false,true)
inge.addState("q4","q4",false,true)
inge.addState("q5","q5",false,true)
inge.addState("q6","q6",false,true)
inge.addState("q7","q7",false,true)
inge.addState("q8","q8",false,true)
inge.addState("q9","q9",false,true)


inge.addArrowToStates("a","a","q0","q1")
inge.addArrowToStates("a","a1","q1","q2")
inge.addArrowToStates("a","a2","q2","q3")
inge.addArrowToStates("a","a3","q3","q1")
inge.addArrowToStates("b","b","q1","q1")
inge.addArrowToStates("b","b1","q2","q2")
inge.addArrowToStates("b","b2","q3","q3")
inge.addArrowToStates("b","b3","q0","q4")
inge.addArrowToStates("a|c","a|c","q4","q5")
inge.addArrowToStates("a|c","a|c1","q5","q6")
inge.addArrowToStates("a|c","a|c2","q6","q7")
inge.addArrowToStates("a|c","a|c3","q7","q4")
inge.addArrowToStates("c","c","q0","q8")
inge.addArrowToStates("a","a4","q8","q9")
inge.addArrowToStates("b","b4","q9","q8")

const palindromoPar = new PDA()
palindromoPar.setAlphabet("0,1")
palindromoPar.addState('q0','q0',true)
palindromoPar.addState('q1',"q1")
palindromoPar.addState('q2',"q2")
palindromoPar.addState('q3',"q3",false,true)

palindromoPar.addArrowToStates('0,Z0/0,Z0','0,Z0/0,Z0','q0','q0')
palindromoPar.addArrowToStates('0,0/0,0','0,0/0,0','q0','q0')
palindromoPar.addArrowToStates('1,0/1,0','1,0/1,0','q0','q0')
palindromoPar.addArrowToStates('1,1/1,1','1,1/1,1','q0','q0')
palindromoPar.addArrowToStates('1,Z0/Z0','1,Z0/Z0','q0','q0')
palindromoPar.addArrowToStates('0,1/0,1','0,1/0,1','q0','q0')

palindromoPar.addArrowToStates('0,0/e','0,0/e','q1','q1')
palindromoPar.addArrowToStates('1,1/e','1,1/e','q2','q2')

palindromoPar.addArrowToStates('e,0/0','e,0/0','q0','q1')
palindromoPar.addArrowToStates('e,1/1','e,1/1','q0','q2')
palindromoPar.addArrowToStates('1,1/e','1,1/e','q1','q2')
palindromoPar.addArrowToStates('0,0/e','0,0/e','q2','q1')
palindromoPar.addArrowToStates('e,Z0/Z0','e,Z0/Z0','q1','q3')
palindromoPar.addArrowToStates('e,Z0/Z0','e,Z0/Z0','q2','q3')


exports.getDFAs = function getDFAs(){
	let listToLoad = [automDFA,automDFA2,comienzaEnCero, afd, afd2,afd4, afd3, inge, palindromoPar]
	/*listToLoad = listToLoad.map(x => {
		return {name: x.name,
				alphabet: Array.from(x.alphabet),
				dataset: x.toDataSet()}})*/
	return listToLoad
}
