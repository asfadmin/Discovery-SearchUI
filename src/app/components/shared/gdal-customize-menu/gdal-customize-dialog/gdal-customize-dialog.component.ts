import {
  Component,
  inject,
  signal,
  Signal,
  computed,
  effect,
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

import {
  GdalCustomizeMenuComponent,
  GdalCustomizeDialogData,
} from '../gdal-customize-menu.component';
import { DocsModalComponent } from '@components/shared/docs-modal/docs-modal.component';
import { CopyToClipboardComponent } from '@components/shared/copy-to-clipboard';
import { CodeBlockComponent } from '@components/shared/code-block/code-block.component';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';

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
    MatButtonToggle,
    MatButtonToggleGroup,
    FormsModule,
    DocsModalComponent,
    CopyToClipboardComponent,
    CodeBlockComponent,
  ],
  templateUrl: './gdal-customize-dialog.component.html',
  styleUrl: './gdal-customize-dialog.component.scss',
})
export class GdalCustomizeDialogComponent {
  readonly dialogRef = inject(MatDialogRef<GdalCustomizeMenuComponent>);
  readonly data = inject<GdalCustomizeDialogData>(MAT_DIALOG_DATA);
  datasets = this.data.datasets.sort((a, b) => {
    if (a.ancillary == b.ancillary) {
      return 0;
    }
    if (a.ancillary !== undefined && a.ancillary) {
      return 1;
    }

    return -1;
  });
  gdalService = inject(GdalService);
  selectedDataset = signal<string>(null);
  selectedProjection = signal<string>('');
  outputFormat = signal<string>('GTiff');
  outputExtension = computed(() => {
    switch (this.outputFormat()) {
      case 'GTiff':
      case 'COG':
        return '.tif';
      default:
        return `.${this.outputFormat().toLowerCase()}`;
    }
  });
  cropToAOI = signal<boolean>(false);
  minimalCommand = signal<boolean>(false);
  outputOS = signal<string>(this.getOS());
  outputType = signal<string>('gdal');
  outputFilename = signal<string>('');
  gdalVersion = signal<string>('>=3.13');
  gdalOptions: Signal<GdalOptions> = computed(() => {
    return {
      datasetPath: this.selectedDataset(),
      projection: this.selectedProjection(),
      outputFormat: this.outputFormat(),
      outputExtension: this.outputExtension(),
      aoi: this.cropToAOI(),
      minimalCommand: this.minimalCommand(),
      os: this.outputOS(),
      outputFilename: this.outputFilename(),
      gdalVersion: this.gdalVersion(),
    };
  });
  gdalCommand = computed(() =>
    this.gdalService.generateGDALCommand(this.data.product, this.gdalOptions()),
  );
  qgisCommand = computed(() =>
    this.gdalService.generateQGISScript(this.data.product, this.gdalOptions()),
  );

  netrcContent = `\
machine urs.earthdata.nasa.gov
    login <YOUR USERNAME>
    password <YOUR PASSWORD>\
  `;

  getOS(): string {
    const userAgent = window.navigator.userAgent;

    if (userAgent.includes('Windows')) return 'Windows';

    return 'Unix';
  }

  constructor() {
    effect(() => {
      if (!this.selectedDataset()) {
        return;
      }

      this.outputFilename.set(
        this.gdalService.resolveOutputFilename(
          this.data.product,
          this.gdalOptions(),
        ),
      );
    });
  }
}
