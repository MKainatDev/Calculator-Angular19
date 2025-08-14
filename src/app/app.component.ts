import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  display: string = '';
  currentValue: string = '';
  firstValue: number | null = null;
  operator: string = '';
  waitingForSecond: boolean = false;

  append(value: string) {
    
    if (this.waitingForSecond) {
      this.currentValue = value;
      this.waitingForSecond = false;
    } else {
      this.currentValue += value;
    }
    this.display += value;
  }

  clear() {
    this.display = '';
    this.currentValue = '';
    this.firstValue = null;
    this.operator = '';
    this.waitingForSecond = false;
  }

  delete() {
    if (this.display.length === 0) return;

    const lastChar = this.display.charAt(this.display.length - 1);
    this.display = this.display.slice(0, -1);

    if (['+', '-', '*', '/', '%'].includes(lastChar)) {
      this.operator = '';
      this.waitingForSecond = false;
      this.currentValue = this.display;
      this.firstValue = this.currentValue !== '' ? parseFloat(this.currentValue) : null;
    } else {
      this.currentValue = this.currentValue.slice(0, -1);
    }
  }

  setOperator(op: string) {
    if (this.currentValue === '') return;

    // اگر پہلے سے operator لگا ہے تو intermediate result calculate کریں
    if (this.operator && this.firstValue !== null && !this.waitingForSecond) {
      this.calculateIntermediate();
    } else {
      this.firstValue = parseFloat(this.currentValue);
    }

    this.operator = op;
    this.display += op;
    this.waitingForSecond = true;
  }

  calculate() {
    if (this.operator === '' || this.currentValue === '') return;

    const secondValue = parseFloat(this.currentValue);
    let result = 0;

    switch (this.operator) {
      case '+':
        result = (this.firstValue ?? 0) + secondValue;
        break;
      case '-':
        result = (this.firstValue ?? 0) - secondValue;
        break;
      case '*':
        result = (this.firstValue ?? 0) * secondValue;
        break;
      case '/':
        result = secondValue !== 0 ? (this.firstValue ?? 0) / secondValue : NaN;
        break;
      case '%':
        result = (this.firstValue ?? 0) % secondValue;
        break;
    }

    this.display = result.toString();
    this.currentValue = result.toString();
    this.firstValue = null;
    this.operator = '';
    this.waitingForSecond = false;
  }

  calculateIntermediate() {
    const secondValue = parseFloat(this.currentValue);
    let result = 0;

    switch (this.operator) {
      case '+':
        result = (this.firstValue ?? 0) + secondValue;
        break;
      case '-':
        result = (this.firstValue ?? 0) - secondValue;
        break;
      case '*':
        result = (this.firstValue ?? 0) * secondValue;
        break;
      case '/':
        result = secondValue !== 0 ? (this.firstValue ?? 0) / secondValue : NaN;
        break;
      case '%':
        result = (this.firstValue ?? 0) % secondValue;
        break;
    }

    // اگلی calculation کے لیے result کو firstValue بنا دیں
    this.firstValue = result;
    this.currentValue = '';
  }
}
