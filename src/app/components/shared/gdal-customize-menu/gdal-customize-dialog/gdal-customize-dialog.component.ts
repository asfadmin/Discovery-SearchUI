import {
  Component,
  inject,
  signal,
  Signal,
  computed,
  effect,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
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
    MatButtonToggleGroup,
    MatButtonToggle,
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
  selectedDatasets = signal<string[] | null>(null);
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
  cutlineWKT = signal<string>(this.gdalService.searchPolygon());
  minimalCommand = signal<boolean>(false);
  nisarDriver = signal<boolean>(false);
  outputOSList = GDAL_OS;
  outputOS = signal<GdalOs>(this.getOS());
  outputType = signal<string>('gdal');
  outputFilename = signal<string>('');
  gdalVersions = GDAL_VERSIONS;
  gdalVersion = signal<GdalVersion>(this.gdalVersions[0]);

  multiVariableExport = computed(
    () => (this.selectedDatasets() ?? []).length > 1,
  );
  gdalOptions: Signal<GdalOptions[]> = computed(() => {
    return this.selectedDatasets().map((selectedDataset) => {
      return {
        product: this.data.product,
        datasetPath: selectedDataset,
        projection: this.selectedProjection(),
        outputType: {
          outputFormat: this.outputFormat(),
          outputExtension: this.outputExtension(),
        },
        cutlineWKT:
          this.cropToAOI() && this.cutlineWKT() ? this.cutlineWKT() : '',
        minimalCommand: this.minimalCommand(),
        os: this.outputOS(),
        outputFilename: !this.multiVariableExport()
          ? this.outputFilename()
          : this.gdalService.resolveOutputFilename({
              product: this.data.product,
              datasetPath: selectedDataset,
            }),
        gdalVersion: this.gdalVersion(),
        nisarDriver: this.nisarDriver(),
      };
    });
  });
  gdalCommands = computed(() =>
    this.selectedDatasets()
      ? this.gdalOptions().map((gdalOptions) =>
          this.gdalService.generateGDALCommand(gdalOptions),
        )
      : [GDAL_COMMAND_PLACEHOLDER],
  );
  gdalCommand = computed(() => this.gdalCommands().join('\n'));
  gdalRC = computed(() =>
    this.selectedDatasets()
      ? this.gdalService.generateGdalrc(this.gdalOptions()[0])
      : '',
  );
  qgisCommands = computed(() =>
    this.selectedDatasets()
      ? this.gdalOptions().map((gdalOptions) =>
          this.gdalService.generateQGISScript(gdalOptions),
        )
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

  constructor() {
    effect(() => {
      this.outputFilename.set(
        this.gdalService.resolveOutputFilename({
          product: this.data.product,
          datasetPath: this.selectedDatasets()[0],
        }),
      );
    });
  }
}
