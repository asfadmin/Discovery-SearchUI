import {
  Component,
  inject,
  signal,
  Signal,
  computed,
  effect,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { disabled, form, FormField } from '@angular/forms/signals';
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

interface GdalConfigModel {
  selectedDatasets: string[];
  selectedProjection: string;
  outputFormat: GdalFormats;
  cropToAOI: boolean;
  cutlineWKT: string;
  minimalCommand: boolean;
  nisarDriver: boolean;
  outputOS: GdalOs;
  outputType: string;
  outputFilename: string;
  gdalVersion: GdalVersion;
}

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
    FormField,
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
  outputFormats = GDAL_FORMATS;
  outputOSList = GDAL_OS;
  gdalVersions = GDAL_VERSIONS;
  enableCutlineWKTString = computed(() => {
    if (this.gdalConfigForm.cutlineWKT().disabled()) {
      return 'CROP_TO_AOI_IS_DISABLED';
    }

    if (this.gdalService.isCropToAOIAvailable()) {
      return 'CROP_TO_AOI_TOOLTIP';
    }

    return 'CROP_TO_WKT_POLYGON_STRING';
  });

  gdalConfigModel = signal<GdalConfigModel>({
    selectedDatasets: [],
    selectedProjection: '',
    outputFormat: 'GTiff',
    cropToAOI: false,
    cutlineWKT: this.gdalService.searchPolygon(),
    minimalCommand: false,
    nisarDriver: false,
    outputOS: this.getOS(),
    outputType: 'gdal',
    outputFilename: '',
    gdalVersion: this.gdalVersions[0],
  });

  gdalConfigForm = form(this.gdalConfigModel, (schemaPath) => {
    disabled(
      schemaPath.cutlineWKT,
      ({ valueOf }) => !valueOf(schemaPath.cropToAOI),
    );
    disabled(schemaPath.outputFilename, () => this.multiVariableExport());
    disabled(
      schemaPath.minimalCommand,
      ({ valueOf }) => valueOf(schemaPath.outputOS) == 'Windows',
    );
    disabled(
      schemaPath.nisarDriver,
      ({ valueOf }) => valueOf(schemaPath.outputOS) == 'Windows',
    );
  });

  outputExtension = computed(() => {
    switch (this.gdalConfigForm.outputFormat().value()) {
      case 'GTiff':
      case 'COG': {
        return '.tif';
      }
      default: {
        return `.${this.gdalConfigForm.outputFormat().value().toLowerCase()}`;
      }
    }
  });

  multiVariableExport = computed(
    () => (this.gdalConfigForm.selectedDatasets().value() ?? []).length > 1,
  );
  gdalOptions: Signal<GdalOptions[]> = computed(() => {
    const config = this.gdalConfigModel();
    return config.selectedDatasets.map((selectedDataset) => {
      return {
        product: this.data.product,
        datasetPath: selectedDataset,
        projection: config.selectedProjection,
        outputType: {
          outputFormat: config.outputFormat,
          outputExtension: this.outputExtension(),
        },
        cutlineWKT:
          config.cropToAOI && config.cutlineWKT ? config.cutlineWKT : '',
        minimalCommand: config.minimalCommand,
        os: config.outputOS,
        outputFilename: !this.multiVariableExport()
          ? config.outputFilename
          : this.gdalService.resolveOutputFilename({
              product: this.data.product,
              datasetPath: selectedDataset,
            }),
        gdalVersion: config.gdalVersion,
        nisarDriver: config.nisarDriver,
      };
    });
  });
  gdalCommands = computed(() =>
    this.gdalConfigForm.selectedDatasets().value()
      ? this.gdalOptions().map((gdalOptions) =>
          this.gdalService.generateGDALCommand(gdalOptions),
        )
      : [GDAL_COMMAND_PLACEHOLDER],
  );
  gdalCommand = computed(() => this.gdalCommands().join('\n'));
  gdalRC = computed(() =>
    this.gdalConfigForm.selectedDatasets().value()
      ? this.gdalService.generateGdalrc(this.gdalOptions()[0])
      : '',
  );
  qgisCommands = computed(() =>
    this.gdalConfigForm.selectedDatasets().value()
      ? this.gdalOptions().map((gdalOptions) =>
          this.gdalService.generateQGISScript(gdalOptions),
        )
      : '',
  );
  homeDirectory = computed(() =>
    this.gdalConfigForm.outputOS().value() == 'Windows' ? '%USERPROFILE%' : '~',
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
      if (!this.gdalConfigForm.outputFilename().dirty()) {
        this.gdalConfigForm.outputFilename().value.set(
          this.gdalService.resolveOutputFilename({
            product: this.data.product,
            datasetPath: this.gdalConfigForm.selectedDatasets().value()[0],
          }),
        );
      }
    });
  }
}
