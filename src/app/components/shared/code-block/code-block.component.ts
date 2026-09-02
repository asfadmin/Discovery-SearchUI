import { Component, effect, ElementRef, input, viewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import Prism from 'prismjs';

import { CopyToClipboardComponent } from '../copy-to-clipboard';

import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';

@Component({
  selector: 'app-code-block',
  imports: [CopyToClipboardComponent, TranslateModule],
  templateUrl: './code-block.component.html',
  styleUrl: './code-block.component.scss',
})
export class CodeBlockComponent {
  codeDescription = input<string>();
  codeContent = input.required<string>();
  copyPrompt = input<string>('COPY_TO_CLIPBOARD');
  copyMessage = input<string>('COPIED_TO_CLIPBOARD');
  language = input.required<string>();
  isCommand = input<boolean>(false);

  codeBlock = viewChild<ElementRef | null>('codeBlock');

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
