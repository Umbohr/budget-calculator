import { DecimalPipe, registerLocaleData } from '@angular/common';
import { Component, computed, LOCALE_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { lusolve } from 'mathjs'
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, DecimalPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR'},
  ]
})
export class AppComponent  {
  title = 'budget';

  montantSalaire1 = signal(0);
  montantDepenses = signal(0);
  montantSalaire2 = signal(0);

  result = computed(()=> {
    if (this.montantDepenses() > 0) {
      return this.bugdetise(this.montantSalaire1(), this.montantSalaire2(), this.montantDepenses())
    } else {
      return {x: 0, y : 0}
    }
  });

  parseNumber(input: string) : number {
    return Number(input);
  }

  bugdetise(salaire1: number, salaire2: number, montant: number) {
    const coefficients = [
      [1, 1],
      [1, -1]
    ];
    const constants = [montant, salaire1 - salaire2];

    // Solving the system of equations
    const solutions = lusolve(coefficients, constants);

    // Extracting solutions
    //@ts-expect-error
    let x = solutions[0][0];
    //@ts-expect-error
    let y = solutions[1][0];
    if (x < 0) {
      x = 0;
      y = montant
    }
    if (y < 0)  {
      y = 0;
      x = montant
    }
    return {x, y}
  }
}
