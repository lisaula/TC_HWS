
export default class Stack {
  stack=new Array();
  count =0;
  constructor(){
    this.stack = new Array()
    this.count = 0
  }
  copy(stack){
    let nuevo = new Stack()
    nuevo.stack = stack.stack.slice()
    nuevo.count = stack.count
    return nuevo
  }
  pop(){
    if(this.count>0){
      this.count--;
      return this.stack.pop();
    }
  }
  push(item){
    this.stack.push(item);
    this.count++;
  }
  top(){
    if(this.count >0)
      return this.stack[this.count-1]
  }
}
