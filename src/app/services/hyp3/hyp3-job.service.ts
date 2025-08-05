import { Injectable } from '@angular/core';
import moment from 'moment';

import * as models from '@models';

@Injectable({
  providedIn: 'root'
})
export class Hyp3JobService {

  constructor() { }

  public getAllGranulesFromJobs(jobs: models.Hyp3Job[]): string[] {
    return jobs.reduce(
      (granuleNames, job) => {
        const jobGranules = this.getAllGranules(job);

        return granuleNames.concat(jobGranules);
      },
      []);
  }

  public getAllGranules(job: models.Hyp3Job): string[] {
    const params = job.job_parameters;

    if ('granules' in params) {
      return params.granules;
    // TODO: INSAR_ISCE_MULTI_BURST and ARIA_S1_GUNW have reference/secondary granules
    // } else if ('reference' in params && 'secondary' in params) {
    //   return [...params.reference, ...params.secondary];
    } else {
      return [];
    }

  }

  public formatJobs(
    jobTypesWithQueued: models.JobTypesWithQueued[],
    options: { processingOptions: any; projectName: string }
  ) {
    const jobOptionNames = {};
    models.hyp3JobTypesList.forEach(
      jobType => jobOptionNames[jobType.id] = new Set(
        jobType.options.map(option => option.apiName)
      )
    );

    const ops = {};
    models.hyp3JobTypesList.forEach(jobType => {
      ops[jobType.id] = {};

      Object.entries(options.processingOptions[jobType.id]).forEach(([name, value]) => {
        if (jobOptionNames[jobType.id].has(name)) {
          ops[jobType.id][name] = value;
        }
      });
    });

    const jobs = jobTypesWithQueued
      .filter(jobType => jobType.selected)
      .map(jobType => jobType.jobs)
      .reduce((acc, val) => acc.concat(val), []);

    return jobs.map(job => {
        let jobOptions;
        if (job.job_type.id === 'ARIA_S1_GUNW') {
        let g1 = moment.isMoment(job.granules[0].metadata.date) ? job.granules[0].metadata.date.format('YYYY-MM-DD') : moment(job.granules[0].metadata.date).format('YYYY-MM-DD')
        let g2 = moment.isMoment(job.granules[1].metadata.date) ? job.granules[1].metadata.date.format('YYYY-MM-DD') : moment(job.granules[1].metadata.date).format('YYYY-MM-DD')
        let swap = g1 > g2
        let ref = swap ? g1 : g2;
        let sec = swap ? g2 : g1;
        jobOptions = {
            job_type: job.job_type.id,
            job_parameters: {
            reference_date: ref,
            secondary_date: sec,
            frame_id: Number.parseInt(job.reference_id)
            // ...ops[job.job_type.id],
            // granules: job.granules.map(granule => granule.name),
            }
        };
        } else {
      jobOptions = {
        job_type: job.job_type.id,
        job_parameters: {
          ...ops[job.job_type.id],
          granules: job.granules.map(granule => granule.name),
        }
      };
    }

      if (options.projectName !== '') {
        jobOptions.name = options.projectName;
      }

      if (!jobOptions.name) {
        delete jobOptions.name;
      }

      return jobOptions;
    });
  }

  public toDummyCMRProducts(jobs: models.Hyp3Job[]) {
    const granuleNames = this.getAllGranulesFromJobs(jobs);

    const dummyProducts = this.dummyProductsFor(granuleNames)
      .reduce((prodsByName, p) => {
        prodsByName[p.name] = p;
        return prodsByName;
      }, {});

    const virtualProducts = jobs
      .map(job => {
        const jobGranules = this.getAllGranules(job);
        let product;
        if (jobGranules.length < 1) {
          product = this.dummyProduct();
          if (job.job_type === 'ARIA_S1_GUNW') {
            product['isDummyProduct'] = false
            product['metadata']['date'] = moment(job.job_parameters['reference_date'])
          }
        } else {
          product = dummyProducts[jobGranules[0]];
        }

        job.scenes = jobGranules
          .map(granuleName => dummyProducts[granuleName]);

        const jobProduct = this.combineJobAndCmrProduct(job, product);

        return jobProduct;
      });

    return virtualProducts;
  }

  private dummyProductsFor(granuleNames: string[]) {
    const dummyProducts = granuleNames.map(granuleName => {
      return {
        ...this.dummyProduct(),
        name: granuleName
      };
    });

    return dummyProducts;
  }

  public combineWithCmrProduct(oldJobProducts: models.CMRProductsById, cmrData: models.CMRProductsById): models.CMRProductsById {
    const newJobProducts: models.CMRProductsById = { ...oldJobProducts };

    Object.values(newJobProducts).forEach(jobProduct => {
      const product = cmrData[jobProduct.name];

      if (!product || !jobProduct.metadata.job) {
        return;
      }

      const job = {
        ...jobProduct.metadata.job,
        job_parameters: {
          ...jobProduct.metadata.job?.job_parameters,
        }
      };

      const jobGranules = this.getAllGranules(job);

      job.scenes = jobGranules
        .map(granuleName => cmrData[granuleName]);

      const combinedProduct = this.combineJobAndCmrProduct(job, product);

      newJobProducts[combinedProduct.id] = <models.CMRProduct>combinedProduct;
    });

    return newJobProducts;
  }

  private combineJobAndCmrProduct(job: models.Hyp3Job, product: models.CMRProduct) {
    const jobFile = job.files?.length > 0 ?
      job.files[0] :
      { size: -1, url: '', filename: product.name };

    const combinedProduct: any = {
      ...product,
      browses: job.browse_images ? job.browse_images : ['assets/no-browse.png'],
      thumbnail: job.thumbnail_images ? job.thumbnail_images[0] : 'assets/no-thumb.png',
      productTypeDisplay: `${job.job_type}, ${product.metadata.productType} `,
      downloadUrl: jobFile.url,
      bytes: jobFile.size,
      groupId: job.job_id,
      id: job.job_id,
      metadata: {
        ...product.metadata,
        fileName: jobFile.filename || '',
        productType: <models.Hyp3JobType>job.job_type,
        job
      },
    };

    return combinedProduct;
  }

  private dummyProduct() {
    return {
      'name': '',
      'productTypeDisplay': '',
      'file': '',
      'id': '',
      'downloadUrl': '',
      'bytes': 0,
      'dataset': '',
      'browses': [
        '/assets/no-browse.png'
      ],
      'thumbnail': '/assets/no-thumb.png',
      'groupId': '',
      'isUnzippedFile': false,
      'isDummyProduct': true,
      'metadata': {
        'date': moment.utc('1970-01-01T00:00:00+00:00'),
        'stopDate': moment.utc('1970-01-01T00:00:00+00:00'),
        'polygon': 'POLYGON ((0 0, 0 0, 0 0, 0 0, 0 0))',
        'productType': '',
        'beamMode': '',
        'polarization': '',
        'flightDirection': '',
        'path': 0,
        'frame': 0,
        'absoluteOrbit': [
          0
        ],
        'faradayRotation': 0,
        'offNadirAngle': 0,
        'instrument': '',
        'pointingAngle': null,
        'missionName': null,
        'flightLine': null,
        'stackSize': null,
        'perpendicular': null,
        'temporal': null,
        'canInSAR': true,
        'job': null,
        'fileName': null,
        'burst': null,
        'opera': null,
        'pgeVersion': 0,
        'subproducts': [],
        'parentID': null
      }
    };
  }

}
