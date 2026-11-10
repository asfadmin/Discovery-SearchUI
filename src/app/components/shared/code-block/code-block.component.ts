import { KeyValuePipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { TranslateModule } from '@ngx-translate/core';
import Prism from 'prismjs';

import { CopyToClipboardComponent } from '../copy-to-clipboard';

import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';

@Component({
  selector: 'app-code-block',
  imports: [
    CopyToClipboardComponent,
    TranslateModule,
    KeyValuePipe,
    MatButtonToggleGroup,
    MatButtonToggle,
    FormsModule,
  ],
  templateUrl: './code-block.component.html',
  styleUrl: './code-block.component.scss',
})
export class CodeBlockComponent {
  codeDescription = input<string>();
  codeContent = input<string | string[]>();
  codeContentByTab = input<Record<string, string | undefined>>();
  defaultTab = input<string>();
  copyPrompt = input<string>('COPY_TO_CLIPBOARD');
  copyMessage = input<string>('COPIED_TO_CLIPBOARD');
  language = input.required<string>();
  isCommand = input<boolean>(false);

  codeBlock = viewChild<ElementRef | null>('codeBlock');
  currentTab = signal<string>('');
  codeValue = computed<string>(() =>
    [this.codeContent() ?? this.codeContentByTab()[this.currentTab()]]
      .flat()
      .join('\n'),
  );

  constructor() {
    effect(() => {
      if (!this.codeBlock()) {
        return false;
      }

      const grammar = Prism.languages[this.language()];

      const codeContent = Prism.highlight(
        this.codeValue(),
        grammar,
        this.language,
      );
      this.codeBlock().nativeElement.innerHTML = codeContent;
    });

    effect(() => {
      this.currentTab.set(this.defaultTab());
    });
  }
}
