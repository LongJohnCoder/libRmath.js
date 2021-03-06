/*  AUTHOR
 *  Jacob Bogers, jkfbogers@gmail.com
 *  Januari 22, 2017
 * 
 *  ORIGINAL AUTHOR
 *  Mathlib : A C Library of Special Functions
 *  Copyright (C) 1998 Ross Ihaka
 *  Copyright (C) 2000-2002 the R Core Team
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
*  License for JS language implementation
 *  https://www.jacob-bogers/libRmath.js/Licenses/
 * 
 *  License for R statistical package
 *  https://www.r-project.org/Licenses/
 *
 *  SYNOPSIS
 *
 *    #include <Rmath.h>
 *    double exp_rand(void);
 *
 *  DESCRIPTION
 *
 *    Random variates from the standard exponential distribution.
 *
 *  REFERENCE
 *
 *    Ahrens, J.H. and Dieter, U. (1972).
 *    Computer methods for sampling from the exponential and
 *    normal distributions.
 *    Comm. ACM, 15, 873-882.
 */


export function exp_rand( unif_rand: () => number ): number {

  const q: number[] = [
    0.6931471805599453 ,
    0.9333736875190459 ,
    0.9888777961838675 ,
    0.9984959252914960 ,
    0.9998292811061389 ,
    0.9999833164100727 ,
    0.9999985691438767 ,
    0.9999998906925558 ,
    0.9999999924734159 ,
    0.9999999995283275 ,
    0.9999999999728814 ,
    0.9999999999985598 ,
    0.9999999999999289 ,
    0.9999999999999968 ,
    0.9999999999999999 ,
    1.0000000000000000
  ];

  let a = 0.;
  let u = unif_rand();    // precaution if u = 0 is ever returned 
  while (u <= 0. || u >= 1.) u = unif_rand();
  while (true){
    u += u;
    if (u > 1.)
      break;
    a += q[0];
  }
  u -= 1.;

  if (u <= q[0])
    return a + u;

  let i = 0;
  let ustar = unif_rand();
  let umin = ustar;
  do {
    ustar = unif_rand();
    if (umin > ustar)
      umin = ustar;
    i++;
  } while (u > q[i]);
  return a + umin * q[0];
}

