import {
  Component,
  inject,
  signal,
  Signal,
  computed,
  ElementRef,
  effect,
  viewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { GdalOptions, GdalService } from '@services/gdal/gdal.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField } from '@angular/material/input';
import { MatLabel } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';

import {
  GdalCustomizeMenuComponent,
  GdalCustomizeDialogData,
} from '../gdal-customize-menu.component';
import { DocsModalComponent } from '@components/shared/docs-modal/docs-modal.component';
import { CopyToClipboardComponent } from '@components/shared/copy-to-clipboard';

@Component({
  selector: 'app-gdal-customize-dialog',
  imports: [
    TranslateModule,
    MatExpansionModule,
    MatRadioGroup,
    MatRadioButton,
    MatTooltip,
    MatCheckbox,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    FormsModule,
    DocsModalComponent,
    CopyToClipboardComponent
  ],
  templateUrl: './gdal-customize-dialog.component.html',
  styleUrl: './gdal-customize-dialog.component.scss',
})
export class GdalCustomizeDialogComponent {
  readonly dialogRef = inject(MatDialogRef<GdalCustomizeMenuComponent>);
  readonly data = inject<GdalCustomizeDialogData>(MAT_DIALOG_DATA);
  gdalService = inject(GdalService);
  selectedDataset = signal<string>(null);
  selectedProjection = signal<string>('');
  outputFormat = signal<string>('GTiff');
  outputExtension = computed(() => {
    switch (this.outputFormat()) {
      case 'GTiff':
      case 'COG':
        return '.tiff';
      default:
        return `.${this.outputFormat().toLowerCase()}`;
    }
  });
  cropToAOI = signal<boolean>(false);
  minimalCommand = signal<boolean>(false);
  outputOS = signal<string>(this.getOS());
  gdalOptions: Signal<GdalOptions> = computed(() => {
    return {
      datasetPath: this.selectedDataset() ?? '<DATASET PATH>',
      projection: this.selectedProjection(),
      outputFormat: this.outputFormat(),
      outputExtension: this.outputExtension(),
      aoi: this.cropToAOI(),
      minimalCommand: this.minimalCommand(),
      os: this.outputOS()
    }
  });
  gdalCommand = computed(() =>
    this.gdalService.generateGDALCommand(this.data.product, this.gdalOptions()),
  );
  grammar = Prism.languages['bash'];

  gdalOutput = viewChild<ElementRef>('gdalOutput');
  gdalrcOutput = viewChild<ElementRef>('gdalrcOutput');

  getOS(): string {
    const userAgent = window.navigator.userAgent;

    if (userAgent.includes('Windows')) return 'Windows';

    return 'Unix';
  }

  constructor() {
    effect(() => {
      const gdalCommandContent = Prism.highlight(
        this.gdalCommand(),
        this.grammar,
        'bash',
      );
      this.gdalOutput().nativeElement.innerHTML = gdalCommandContent;
    });

    effect(() => {
      if (this.gdalrcOutput()) {
        const gdalrcContent = Prism.highlight(
          this.gdalService.generateGdalrc(this.gdalOptions()),
          this.grammar,
          'bash',
        );
        this.gdalrcOutput().nativeElement.innerHTML = gdalrcContent;
      }
    });
  }
}
