// imported from https://github.com/simple-statistics/simple-statistics

export interface linearRegressionEquation {
  slope: number;
  yIntercept: number;
}

export function linearRegression(data: number[][]): linearRegressionEquation {
  let m;
  let b;
  // Store data length in a local variable to reduce
  // repeated object property lookups
  const dataLength = data.length;

  //if there's only one point, arbitrarily choose a slope of 0
  //and a y-intercept of whatever the y of the initial point is
  if (dataLength === 1) {
    m = 0;
    b = data[0][1];
  } else {
    // Initialize our sums and scope the `m` and `b`
    // variables that define the line.
    let sumX = 0;
    let sumY = 0;
    let sumXX = 0;
    let sumXY = 0;

    // Use local variables to grab point values
    // with minimal object property lookups
    let point;
    let x;
    let y;

    // Gather the sum of all x values, the sum of all
    // y values, and the sum of x^2 and (x*y) for each
    // value.
    //
    // In math notation, these would be SS_x, SS_y, SS_xx, and SS_xy
    for (let i = 0; i < dataLength; i++) {
      point = data[i];
      x = point[0];
      y = point[1];

      sumX += x;
      sumY += y;

      sumXX += x * x;
      sumXY += x * y;
    }

    // `m` is the slope of the regression line
    m = (dataLength * sumXY - sumX * sumY) / (dataLength * sumXX - sumX * sumX);

    // `b` is the y-intercept of the line.
    b = sumY / dataLength - (m * sumX) / dataLength;
  }

  // Return both values as an object.
  return {
    slope: m,
    yIntercept: b,
  };
}
export function linearRegressionLine(
  mb: linearRegressionEquation /*: { b: number, m: number }*/,
) {
  // Return a function that computes a `y` value for each
  // x value it is given, based on the values of `b` and `a`
  // that we just computed.
  return function (x) {
    return mb.yIntercept + mb.slope * x;
  };
}
