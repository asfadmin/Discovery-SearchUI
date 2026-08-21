import { Component, effect, ElementRef, input, viewChild } from '@angular/core';
import { CopyToClipboardComponent } from '../copy-to-clipboard';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';

@Component({
  selector: 'app-code-block',
  imports: [CopyToClipboardComponent],
  templateUrl: './code-block.component.html',
  styleUrl: './code-block.component.scss',
})
export class CodeBlockComponent {
  codeDescription = input<string>();
  codeContent = input<string>();
  copyPrompt = input<string>();
  copyMessage = input<string>();
  language = input<string>();
  isCommand = input<boolean>(false);

  codeBlock = viewChild<ElementRef>('codeBlock');


  constructor() {
    effect(() => {
      if (!this.codeBlock()) {
        return false;
      }

      const grammar = Prism.languages[this.language()];

      const codeContent = Prism.highlight(
        this.codeContent(),
        grammar,
        this.language,
      );
      this.codeBlock().nativeElement.innerHTML = codeContent;
    });
  }
}
