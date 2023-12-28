import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Node } from '../../types/node';

@Component({
  selector: 'app-node',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="aspect-square rounded-xl flex flex-col justify-center items-center text-slate-800 relative"
      [ngClass]="{
        'bg-slate-400': node.state === 0,
        'bg-emerald-400': node.state === 1,
        'bg-cyan-500': node.state === 2,
        'bg-cyan-700': node.state === 3,
        'bg-teal-400': node.state === 4 || node.state === 5 || node.state === 6,
        'bg-slate-600': node.blocked,
      }"
    >
      @if (!node.blocked && node.state !== 0) {
      <span class="absolute top-1 left-2">{{ node.g }}</span>
      <p class="text-center text-2xl font-bold">{{ node.f }}</p>
      @if (node.h) {
      <span class="absolute bottom-1 right-2">{{ node.h }}</span>
      } }
    </div>
  `,
})
export class NodeComponent {
  @Input({ required: true }) node!: Node;
}