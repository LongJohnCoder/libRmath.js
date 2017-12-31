/*
 *  AUTHOR
 *  Jacob Bogers, jkfbogers@gmail.com
 *  March 14, 2017
 * 
 *  ORIGNINAL AUTHOR
 *  Mathlib : A C Library of Special Functions
 *  Copyright (C) 2006 The R Core Team
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
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, a copy is available at
 *  https://www.R-project.org/Licenses/
 *
 *  SYNOPSIS
 *
 * #include <Rmath.h>
 *
 * double pbeta_raw(double x, double a, double b, int lower_tail, int log_p)
 * double pbeta	   (double x, double a, double b, int lower_tail, int log_p)
 *
 *  DESCRIPTION
 *
 *	Returns distribution function of the beta distribution.
 *	( = The incomplete beta ratio I_x(p,q) ).
 *
 *  NOTES
 *
 *      As from R 2.3.0, a wrapper for TOMS708
 *      as from R 2.6.0, 'log_p' partially improved over log(p..)
 */
import * as debug from 'debug';

import {
  ML_ERR_return_NAN,
  R_DT_0,
  R_DT_1
} from '../common/_general';
import { NumberW, Toms708 } from '../common/toms708';
import { forEach } from '../r-func';

const  { isNaN: ISNAN, isFinite: R_FINITE} = Number;
const {LN2: M_LN2 } = Math;

const printer = debug('pbeta_raw');

export function pbeta_raw(
  x: number,
  a: number,
  b: number,
  lower_tail: boolean,
  log_p: boolean
): number {
  // treat limit cases correctly here:
  if (a === 0 || b === 0 || !R_FINITE(a) || !R_FINITE(b)) {
    // NB:  0 < x < 1 :
    if (a === 0 && b === 0)
      // point mass 1/2 at each of {0,1} :
      return log_p ? -M_LN2 : 0.5;
    if (a === 0 || a / b === 0)
      // point mass 1 at 0 ==> P(X <= x) = 1, all x > 0
      return R_DT_1(lower_tail, log_p);
    if (b === 0 || b / a === 0)
      // point mass 1 at 1 ==> P(X <= x) = 0, all x < 1
      return R_DT_0(lower_tail, log_p);
    // else, remaining case:  a = b = Inf : point mass 1 at 1/2
    if (x < 0.5) return R_DT_0(lower_tail, log_p);
    else return R_DT_1(lower_tail, log_p);
  }
  // Now:  0 < a < Inf;  0 < b < Inf

  let x1 = 0.5 - x + 0.5;
  let w: NumberW = new NumberW(0);
  let wc: NumberW = new NumberW(0);
  let ierr: NumberW = new NumberW(0);
  //====
  //Toms708.bratio(a, b, x, x1, &w, &wc, &ierr, log_p); /* -> ./toms708.c */
  Toms708.bratio(a, b, x, x1, w, wc, ierr, log_p); /* -> ./toms708.c */
  //====
  // ierr in {10,14} <==> bgrat() error code ierr-10 in 1:4; for 1 and 4, warned *there*
  if (ierr && ierr.val && ierr.val !== 11 && ierr.val !== 14)
  printer(
      'pbeta_raw(%d, a=%d, b=%d, ..) -> bratio() gave error code %d',
      x,
      a,
      b,
      ierr
    );
  return lower_tail ? w.val : wc.val;
} /* pbeta_raw() */

const printer_pbeta = debug('pbeta');

export function pbeta<T>(
  q: T,
  a: number,
  b: number,
  lowerTail: boolean = true,
  logP: boolean = false
): T {

  return forEach(q)(x => {
    if (ISNAN(x) || ISNAN(a) || ISNAN(b)) return x + a + b;

    if (a < 0 || b < 0) return ML_ERR_return_NAN(printer_pbeta);
    // allowing a==0 and b==0  <==> treat as one- or two-point mass

    if (x <= 0) return R_DT_0(lowerTail, logP);
    if (x >= 1) return R_DT_1(lowerTail, logP);

    return pbeta_raw(x, a, b, lowerTail, logP);
  }) as any;
}
