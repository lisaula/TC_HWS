import AFD from "./AFD.js"

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

exports.getDFAs = function getDFAs(){
	let listToLoad = [automDFA,automDFA2,comienzaEnCero]
	/*listToLoad = listToLoad.map(x => {
		return {name: x.name,
				alphabet: Array.from(x.alphabet),
				dataset: x.toDataSet()}})*/
	return listToLoad
}
