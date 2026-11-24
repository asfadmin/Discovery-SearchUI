import { Component, effect, inject, input, signal } from '@angular/core';

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

  token = input.required<string>();
  jobs = signal<HarmonyJob[]>(null);

  constructor() {
    effect(() => {
      const token = this.token();
      if (!token) {
        return;
      }

      this.harmony.getJobs$(token).subscribe((resp) => {
        console.log(resp);
        this.jobs.set(resp.jobs);
      });
    });
  }

  getJob(job: HarmonyJob) {
    console.log(job);
    const token = this.token();
    if (!token) {
      return;
    }

    this.harmony.getJob$(job.jobID, this.token()).subscribe((resp) => {
      console.log(resp);
    });
  }
}
