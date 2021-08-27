import { numericBtns, operatorBtns } from "./params/buttons.js";
import { displayStyle } from "./params/displayStyle.js";
import { calculator } from "./lib/calculator.js";

new Vue({
  el: "#app",
  data: {
    inputLine: [],
    outputLine: "",
    currentOperand: "", // 0~9を連結するための入力待機文字列
    displayStyle: displayStyle,
    numericBtns: numericBtns,
    operatorBtns: operatorBtns,
  },
  computed: {
    inputLineStr: function() {
      return this.inputLine.join(" ");
    },

    isLastInputOperator: function() {
      const lastInput = this.inputLine[this.inputLine.length - 1];
      return isNaN(Number(lastInput));
    },

    isInputLineBlank: function() {
      return this.inputLine.length === 0;
    },

    isOutputLineBlank: function() {
      return this.inputLine.length === 0;
    },
  },
  methods: {
    addOperand: function(num) {
      // 最後の入力が数字の場合、引数の数字を連結して上書きする
      this.currentOperand += num;
      if(!this.isLastInputOperator) this.inputLine.pop();
      this.inputLine.push(this.currentOperand);
      
      this.calc();
      this.adjustFontSize();
    },

    addOperator: function(operator) {
      // 演算子が連続で入力された場合、最後の入力を優先する
      if(this.isLastInputOperator) this.inputLine.pop(); 
      this.inputLine.push(operator);

      this.currentOperand = "";
    },

    deleteAll: function() {
      this.inputLine = [];
      this.outputLine = "";
      this.currentOperand = "";
      this.isInputError = false;
    },

    deleteOne: function() {
      // 最後の入力が2桁以上の数字の場合、最終桁を切り落とす
      const lastInput = this.inputLine.pop();
      if(!isNaN(Number(lastInput)) && lastInput.length !== 1) {
        this.inputLine.push(lastInput.slice(0, lastInput.length - 1));
      }
      
      // 最後の入力が数字の場合、それを入力待機文字列とする（次回以降に入力される数字を連結する）
      this.currentOperand = this.isLastInputOperator
      ? ""
      : this.inputLine[this.inputLine.length - 1];
      
      this.calc();
      this.adjustFontSize();
    },

    calc: function() {
      // 式が１つ以上ある場合のみ、計算結果を出力する
      if(this.inputLine.length < 3) {
        this.outputLine = "";
        return;
      }

      // 最後の入力が演算子の場合、それを無視して計算結果を出力する
      const input = this.isLastInputOperator
      ? this.inputLine.slice(0, this.inputLine.length - 1)
      : this.inputLine;

      this.outputLine = String(calculator(input));
    },

    // 以下、ディスプレイ画面のフォントサイズをいい感じに調整する処理
    // 入力ラインの幅が画面からはみ出す場合、trueを返す
    isDisplaySizeFull: function() {
      const targetWidth = document.getElementById("inputLine").offsetWidth;
      const displayWidth = this.displayStyle.width - this.displayStyle.padding * 3;
      return targetWidth > displayWidth;
    },

    // 入力ラインの幅が画面からはみ出す場合、フォントサイズを1小さくする
    // はみ出さない場合、初期サイズを超えない範囲内でフォントサイズを1大きくする
    adjustFontSize: function() {
      if(this.isDisplaySizeFull()) this.displayStyle.inputFontSize--;
      else if(this.displayStyle.inputFontSize < this.displayStyle.initialInputFontSize) {
        this.displayStyle.inputFontSize++;
      }
    },
  }
});
