import {
  Component,
  inject,
  signal,
  Signal,
  computed,
  effect,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  disabled,
  form,
  FormField,
  minLength,
  pattern,
} from '@angular/forms/signals';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPseudoCheckbox } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import {
  MatFormField,
  MatLabel,
  MatInput,
  MatError,
} from '@angular/material/input';
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
import { GDALCategory, GDALDataset } from '@models';
import { MatTreeModule } from '@angular/material/tree';

interface GdalConfigModel {
  selectedDatasets: string[];

  geospatial: {
    selectedProjection: string;
    cropToAOI: boolean;
    cutlineWKT: string;
  };
  output: {
    format: GdalFormats;
    filename: string;
    type: string;
  };
  environment: {
    nisarDriver: boolean;
    minimalCommand: boolean;
    os: GdalOs;
    gdalVersion: GdalVersion;
  };
}

interface DatasetNode {
  name: string;
  children?: DatasetNode[];
  dataset?: GDALDataset;
}

@Component({
  selector: 'app-gdal-customize-dialog',
  imports: [
    MatPseudoCheckbox,
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
    MatError,
    MatExpansionModule,
    MatTreeModule,
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
  datasets = this.toAngularMaterialTree(this.data.datasets);
  gdalService = inject(GdalService);
  outputFormats = GDAL_FORMATS;
  outputOSList = GDAL_OS;
  gdalVersions = GDAL_VERSIONS;

  gdalConfigModel = signal<GdalConfigModel>({
    selectedDatasets: [],
    geospatial: {
      selectedProjection: '',
      cropToAOI: false,
      cutlineWKT: this.gdalService.searchPolygon(),
    },
    output: {
      format: 'GTiff',
      filename: '',
      type: 'gdal',
    },
    environment: {
      minimalCommand: false,
      nisarDriver: false,
      os: this.getOS(),
      gdalVersion: this.gdalVersions[0],
    },
  });

  gdalConfigForm = form(this.gdalConfigModel, (schemaPath) => {
    disabled(
      schemaPath.geospatial.cutlineWKT,
      ({ valueOf }) => !valueOf(schemaPath.geospatial.cropToAOI),
    );
    disabled(schemaPath.output.filename, () => this.multiVariableExport());
    disabled(
      schemaPath.environment.minimalCommand,
      ({ valueOf }) => valueOf(schemaPath.environment.os) == 'Windows',
    );
    disabled(
      schemaPath.environment.nisarDriver,
      ({ valueOf }) => valueOf(schemaPath.environment.os) == 'Windows',
    );
    minLength(schemaPath.selectedDatasets, 1, {
      message: 'SELECT_A_DATASET_TO_CONTINUE',
    });
    pattern(
      schemaPath.geospatial.selectedProjection,
      /\b(?:EPSG:\d{4}|WGS84)\b/,
      { message: 'REPROJECT_ERROR' },
    );
    pattern(
      schemaPath.geospatial.cutlineWKT,
      /POLYGON [(]{2}(\d+(?:\.\d+)?)\s(\d+(?:\.\d+)?)((,\s(\d+(?:\.\d+)?)\s(\d+(?:\.\d+)?)))*[)]{2}/, //https://stackoverflow.com/a/69107967
      { message: 'CROP_TO_WKT_POLYGON_STRING_ERROR' },
    );
  });

  outputExtension = computed(() => {
    switch (this.gdalConfigForm.output.format().value()) {
      case 'GTiff':
      case 'COG': {
        return '.tif';
      }
      default: {
        return `.${this.gdalConfigForm.output.format().value().toLowerCase()}`;
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
        projection: config.geospatial.selectedProjection,
        outputType: {
          outputFormat: config.output.format,
          outputExtension: this.outputExtension(),
        },
        cutlineWKT:
          config.geospatial.cropToAOI && config.geospatial.cutlineWKT
            ? config.geospatial.cutlineWKT
            : '',
        minimalCommand: config.environment.minimalCommand,
        os: config.environment.os,
        outputFilename: !this.multiVariableExport()
          ? config.output.filename
          : this.gdalService.resolveOutputFilename({
              product: this.data.product,
              datasetPath: selectedDataset,
            }),
        gdalVersion: config.environment.gdalVersion,
        nisarDriver: config.environment.nisarDriver,
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
  homeDirectory = computed(() => (this.isWindows() ? '%USERPROFILE%' : '~'));
  isWindows = computed(
    () => this.gdalConfigForm.environment.os().value() === 'Windows',
  );
  datasetSelected = computed(
    () => this.gdalConfigForm.selectedDatasets().value()?.length > 0,
  );
  datasetSelectedTooltip = computed(() => {
    if (this.datasetSelected()) {
      if (this.multiVariableExport()) {
        return 'DATASETS_SELECTED';
      }

      return 'DATASET_SELECTED';
    }

    return 'SELECT_A_DATASET_TO_CONTINUE';
  });
  enableCutlineWKTString = computed(() => {
    if (this.gdalConfigForm.geospatial.cutlineWKT().disabled()) {
      return 'CROP_TO_AOI_IS_DISABLED';
    }

    if (this.gdalService.isCropToAOIAvailable()) {
      return 'CROP_TO_AOI_TOOLTIP';
    }

    return 'CROP_TO_WKT_POLYGON_STRING';
  });
  configureError = computed(
    () =>
      this.gdalConfigForm.geospatial().invalid() ||
      this.gdalConfigForm.environment().invalid() ||
      this.gdalConfigForm.output().invalid(),
  );
  configureErrorMessages = computed(() =>
    [
      ...this.gdalConfigForm.geospatial().errors(),
      ...this.gdalConfigForm.environment().errors(),
      ...this.gdalConfigForm.output().errors(),
    ]
      .map((error) => error.message)
      .filter(
        (message) =>
          message !== null || message !== undefined || message !== '',
      ),
  );
  configureIcon = computed(() => {
    if (this.configureError()) {
      return 'error';
    }

    if (this.datasetSelected()) {
      if (
        this.gdalConfigForm.geospatial().dirty() ||
        this.gdalConfigForm.environment().dirty() ||
        this.gdalConfigForm.output().dirty()
      ) {
        return 'check';
      }

      return 'keyboard_arrow_down';
    }

    return 'keyboard_arrow_up';
  });
  cardErrorTooltip = computed(() => {
    if (!this.datasetSelected()) {
      return 'SELECT_A_DATASET_TO_CONTINUE';
    }

    if (this.configureError()) {
      return this.configureErrorMessages()[0];
    }

    return null;
  });

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

  childrenAccessor = (node: DatasetNode) => node.children ?? [];

  hasChild = (_: number, node: DatasetNode) =>
    !!node.children && node.children.length > 0;

  toAngularMaterialTree(datasets: GDALCategory): DatasetNode[] {
    if (Object.entries(datasets.categories).length == 0) {
      return datasets.datasets.map((dataset) => {
        return {
          name: dataset.name,
          dataset: dataset,
        };
      });
    }

    if (Object.entries(datasets.categories).length == 1) {
      return this.toAngularMaterialTree(
        Object.entries(datasets.categories)[0][1],
      );
    }

    return Object.entries(datasets.categories).map(([key, value]) => {
      return { name: key, children: this.toAngularMaterialTree(value) };
    });
  }

  constructor() {
    effect(() => {
      if (!this.gdalConfigForm.output.filename().dirty()) {
        this.gdalConfigForm.output.filename().value.set(
          this.gdalService.resolveOutputFilename({
            product: this.data.product,
            datasetPath: this.gdalConfigForm.selectedDatasets().value()[0],
          }),
        );
      }
    });

    effect(() => {
      if (this.isWindows()) {
        this.gdalConfigModel.update((m) => ({
          ...m,
          minimalCommand: false,
          nisarDriver: false,
        }));
      }
    });
  }
}
