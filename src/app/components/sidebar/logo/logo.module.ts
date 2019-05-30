import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToggleButtonModule} from '@components/sidebar/toggle-button';
import { LogoComponent } from '@components/sidebar/logo/logo.component';
import { MatCardModule } from '@angular/material';

@NgModule({
  declarations: [LogoComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    ToggleButtonModule,
  ],
  exports: [LogoComponent]
})
export class LogoModule { }
