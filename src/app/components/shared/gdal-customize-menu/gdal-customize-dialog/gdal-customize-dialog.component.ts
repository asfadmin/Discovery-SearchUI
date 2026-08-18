import { Component, inject, signal, computed } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { GdalService } from '@services/gdal/gdal.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatChipSet, MatChip } from '@angular/material/chips';
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

@Component({
  selector: 'app-gdal-customize-dialog',
  imports: [TranslateModule, MatExpansionModule, MatRadioGroup, MatRadioButton, MatTooltip, MatButtonToggle, MatButtonToggleGroup, MatChip, MatChipSet, MatCheckbox, MatFormField, MatLabel, MatSelect, MatOption, MatInput, FormsModule],
  templateUrl: './gdal-customize-dialog.component.html',
  styleUrl: './gdal-customize-dialog.component.scss',
})
export class GdalCustomizeDialogComponent {
  readonly dialogRef = inject(MatDialogRef<GdalCustomizeMenuComponent>);
  readonly data = inject<GdalCustomizeDialogData>(MAT_DIALOG_DATA);
  gdalService = inject(GdalService);
  datasets = this.gdalService.getProductDatasets(this.data.product);
  selectedDataset = signal<string>('');
  gdalCommand = computed(() => (this.selectedDataset() !== '' ? this.gdalService.generateGDALCommand(this.data.product, this.selectedDataset()) : null ))
}
