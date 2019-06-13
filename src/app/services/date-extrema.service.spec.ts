import { async } from '@angular/core/testing';
import {DateExtremaService} from './date-extrema.service';

describe('DateExtremaService', () => {
  let service;

  beforeEach(() => {
    service = new DateExtremaService();
  });

  it('should run #getExtrema$()', async () => {
    // const result = getExtrema$(datasets$, selectedDatasets$, startDate$, endDate$);
  });

  it('should run #startMin$()', async () => {
    // const result = startMin$(datasets$, selectedDatasets$);
  });

  it('should run #startMax$()', async () => {
    // const result = startMax$(datasets$, selectedDatasets$, endDate$);
  });

  it('should run #endMin$()', async () => {
    // const result = endMin$(datasets$, selectedDatasets$, startDate$);
  });

  it('should run #endMax$()', async () => {
    // const result = endMax$(datasets$, selectedDatasets$);
  });

});
