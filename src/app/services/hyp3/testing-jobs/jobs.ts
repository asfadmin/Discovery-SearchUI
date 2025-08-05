export const failedJobWithEmptyFiles = {
  "processing_times": null,
  "browse_images": [],
  "credit_cost": 10,
  "priority": 4530,
  "execution_started": true,
  "job_id": "jobId",
  "name": "testingName",
  "thumbnail_images": [],
  "request_time": "1970-01-01T00:00:00+00:00",
  "logs": [
    "fail.log"
  ],
  "user_id": "testingUser",
  "status_code": "FAILED",
  "job_parameters": {
    "looks": "20x4",
    "include_inc_map": false,
    "phase_filter_parameter": 0.6,
    "include_wrapped_phase": false,
    "include_los_displacement": false,
    "include_displacement_maps": false,
    "granules": [
      "S1B_IW_SLC__1SDV_20200209T140708_20200209T140736_020193_0263AF_34CF",
      "S1A_IW_SLC__1SDV_20200227T140750_20200227T140817_031439_039E99_B693"
    ],
    "apply_water_mask": true,
    "include_look_vectors": false,
    "include_dem": false
  },
  "files": [],
  "expiration_time": "1970-01-01T00:00:00+00:00",
  "job_type": "INSAR_GAMMA",
}

export const ariaS1Job = {
  "processing_times": [
    872.51,
    8.093,
    0.51
  ],
  "browse_images": [
    "browseUrl"
  ],
  "credit_cost": 60,
  "priority": 3479,
  "execution_started": true,
  "job_id": "jobId",
  "name": "testName",
  "thumbnail_images": [],
  "request_time": "1970-01-01T00:00:00+00:00",
  "logs": [],
  "user_id": "testUser",
  "status_code": "SUCCEEDED",
  "job_parameters": {
    "reference": [
      "S1A_IW_SLC__1SSV_20141127T015250_20141127T015318_003461_0040D8_A29D",
      "S1A_IW_SLC__1SSV_20141127T015314_20141127T015342_003461_0040D8_87BA"
    ],
    "secondary": [
      "S1A_IW_SLC__1SSV_20141103T015256_20141103T015323_003111_00391A_3776"
    ],
    "frame_id": 9859
  },
  "files": [
    {
      "s3": {
        "bucket": "content-bucket",
        "key": "key.nc"
      },
      "filename": "filename.nc",
      "size": 14390806,
      "url": "output.nc"
    }
  ],
  "expiration_time": "1970-01-01T00:00:00+00:00",
  "job_type": "ARIA_S1_GUNW"
}
