import { AsyncPipe, NgClass } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { MatCardActions } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

import { DocsModalComponent } from '@components/shared/docs-modal/docs-modal.component';
import { Dataset } from '@models';
import * as models from '@models';
import { provisionalIssuesUrl } from '@models/datasets/nisar';
import { PrettyDateRangePipe } from '@pipes/pretty-date.pipe';
import { ScreenSizeService } from '@services';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss'],
  imports: [
    MatIcon,
    MatTooltip,
    NgClass,
    MatCardActions,
    DocsModalComponent,
    TranslateModule,
    AsyncPipe,
    PrettyDateRangePipe,
  ],
})
export class DatasetComponent {
  dataset = input<Dataset>();
  selected = output<string>();
  private screenSize = inject(ScreenSizeService);

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  public provisionalIssuesUrl = provisionalIssuesUrl;
  public isReadMore = true;

  public isDeprecated = computed(() => {
    return this.dataset().properties.includes(models.Props.DEPRECATED);
  });

  public onOpenHelp() {
    window.open(this.dataset().infoUrl);
  }

  public onInfoClicked(e: Event): void {
    e.stopPropagation();
  }

  public onOpenDocs(event, dataset: string) {
    this.trigger.closeMenu();
    this.onSelectionChange(dataset);
    event.stopPropagation();
  }

  public onSelectionChange(dataset: string): void {
    this.selected.emit(dataset);
  }
}
