import { Component, inject, signal } from '@angular/core';

import { HarmonyJob } from './harmony.model';
import { HarmonyService } from './harmony.service';

@Component({
  selector: 'app-harmony-jobs',
  imports: [],
  templateUrl: './harmony-jobs.component.html',
  styleUrl: './harmony-jobs.component.scss',
})
export class HarmonyJobsComponent {
  harmony = inject(HarmonyService);

  jobs = signal<HarmonyJob[]>(null);

  token = '';

  constructor() {
    this.harmony.getJobs$(this.token).subscribe((resp) => {
      console.log(resp);
      this.jobs.set(resp.jobs);
    });
  }

  getJob(job: HarmonyJob) {
    console.log(job);
    this.harmony.getJob$(job.jobID, this.token).subscribe((resp) => {
      console.log(resp);
    });
  }
}
