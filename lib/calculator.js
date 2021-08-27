const calculator = (array) => {
  let numArr = [];
  let opArr = [];
  for(let ele of array) {
    if(isNaN(Number(ele))) opArr.push(ele);
    else {
      numArr.push(ele);
      if(opArr.length > 0) {
        let lastOp = opArr[opArr.length - 1];
        if(lastOp === "*" || lastOp === "/") {
            let right = numArr.pop();
            let left = numArr.pop();
            numArr.push(calcHelper(left, right, opArr.pop()));
        }
      }
    }
  }
  let j = 1;
  let res = [numArr[0]];
  while(opArr.length > 0) {
      res.push(calcHelper(res.pop(), numArr[j], opArr[0]));
      opArr = opArr.slice(1);
      j++;
  }
  return res[0];
};

const calcHelper = ((a, b, op) => {
  a = Number(a);
  b = Number(b);
  switch(op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return a / b;
  }
});

export { calculator };
