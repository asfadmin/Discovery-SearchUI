import { Component, computed, inject } from '@angular/core';

import { HarmonyJob } from './harmony.model';
import { HarmonyService } from './harmony.service';
import { HarmonyStore } from './harmony.store';

@Component({
  selector: 'app-harmony-jobs',
  imports: [],
  templateUrl: './harmony-jobs.component.html',
  styleUrl: './harmony-jobs.component.scss',
})
export class HarmonyJobsComponent {
  harmony = inject(HarmonyService);
  store = inject(HarmonyStore);

  jobs = computed(() => this.store.jobs());
  loadingJobs = computed(() => this.store.areJobsLoading());

  getJob(job: HarmonyJob) {
    this.store.loadJob(job.jobID);
  }
}
