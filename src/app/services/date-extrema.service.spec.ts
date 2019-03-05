import { async } from '@angular/core/testing';
import {DateExtremaService} from './date-extrema.service';

describe('DateExtremaService', () => {
  let service;

  beforeEach(() => {
    service = new DateExtremaService();
  });

  it('should run #getExtrema$()', async () => {
    // const result = getExtrema$(platforms$, selectedPlatforms$, startDate$, endDate$);
  });

  it('should run #startMin$()', async () => {
    // const result = startMin$(platforms$, selectedPlatforms$);
  });

  it('should run #startMax$()', async () => {
    // const result = startMax$(platforms$, selectedPlatforms$, endDate$);
  });

  it('should run #endMin$()', async () => {
    // const result = endMin$(platforms$, selectedPlatforms$, startDate$);
  });

  it('should run #endMax$()', async () => {
    // const result = endMax$(platforms$, selectedPlatforms$);
  });

});
