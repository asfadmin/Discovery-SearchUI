import {
  Component,
  inject,
  signal,
  Signal,
  computed,
  effect,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

import { CodeBlockComponent } from '@components/shared/code-block/code-block.component';
import { CopyToClipboardComponent } from '@components/shared/copy-to-clipboard';
import { DocsModalComponent } from '@components/shared/docs-modal/docs-modal.component';
import {
  GdalFormats,
  GdalOptions,
  GdalOs,
  GdalService,
  GdalVersion,
  GDAL_FORMATS,
  GDAL_OS,
  GDAL_VERSIONS,
  GDAL_COMMAND_PLACEHOLDER,
} from '@services/gdal/gdal.service';

import {
  GdalCustomizeMenuComponent,
  GdalCustomizeDialogData,
} from '../gdal-customize-menu.component';

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
    MatIconButton,
    MatButton,
    MatInput,
    MatIcon,
    FormsModule,
    DocsModalComponent,
    CodeBlockComponent,
    CopyToClipboardComponent,
  ],
  templateUrl: './gdal-customize-dialog.component.html',
  styleUrl: './gdal-customize-dialog.component.scss',
})
export class GdalCustomizeDialogComponent {
  readonly dialogRef = inject(MatDialogRef<GdalCustomizeMenuComponent>);
  readonly data = inject<GdalCustomizeDialogData>(MAT_DIALOG_DATA);
  datasets = this.data.datasets;
  gdalService = inject(GdalService);
  selectedDataset = signal<string | null>(null);
  selectedProjection = signal<string>('');
  outputFormats = GDAL_FORMATS;
  outputFormat = signal<GdalFormats>('GTiff');
  outputExtension = computed(() => {
    switch (this.outputFormat()) {
      case 'GTiff':
      case 'COG': {
        return '.tif';
      }
      default: {
        return `.${this.outputFormat().toLowerCase()}`;
      }
    }
  });
  cropToAOI = signal<boolean>(false);
  minimalCommand = signal<boolean>(false);
  outputOSList = GDAL_OS;
  outputOS = signal<GdalOs>(this.getOS());
  outputType = signal<string>('gdal');
  outputFilename = signal<string>('');
  gdalVersions = GDAL_VERSIONS;
  gdalVersion = signal<GdalVersion>(this.gdalVersions[0]);
  gdalOptions: Signal<GdalOptions> = computed(() => {
    return {
      product: this.data.product,
      datasetPath: this.selectedDataset(),
      projection: this.selectedProjection(),
      outputType: {
        outputFormat: this.outputFormat(),
        outputExtension: this.outputExtension(),
      },
      aoi: this.cropToAOI(),
      minimalCommand: this.minimalCommand(),
      os: this.outputOS(),
      outputFilename: this.outputFilename(),
      gdalVersion: this.gdalVersion(),
    };
  });
  gdalCommand = computed(() =>
    this.selectedDataset()
      ? this.gdalService.generateGDALCommand(this.gdalOptions())
      : GDAL_COMMAND_PLACEHOLDER,
  );
  gdalRC = computed(() =>
    this.selectedDataset()
      ? this.gdalService.generateGdalrc(this.gdalOptions())
      : '',
  );
  qgisCommand = computed(() =>
    this.selectedDataset()
      ? this.gdalService.generateQGISScript(this.gdalOptions())
      : '',
  );
  homeDirectory = computed(() =>
    this.outputOS() == 'Windows' ? '%USERPROFILE%' : '~',
  );

  netrcContent = `\
machine urs.earthdata.nasa.gov
    login <YOUR USERNAME>
    password <YOUR PASSWORD>\
  `;

  getOS(): GdalOs {
    const userAgent = window.navigator.userAgent;

    if (userAgent.includes('Windows')) {
      return 'Windows';
    }

    return 'Unix';
  }

  updateFilename() {
    // This is the only way a signal two way bound to a matInput with ngModel will accept a new value.
    this.outputFilename.set('');
    this.outputFilename.set(
      this.gdalService.resolveOutputFilename(this.gdalOptions()),
    );
  }

  constructor() {
    effect(() => {
      if (this.selectedDataset() !== '') {
        // Only update when selectedDataset changes, not when other options change.
        untracked(() => this.updateFilename());
      }
    });
  }
}
