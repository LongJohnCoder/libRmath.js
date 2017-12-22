import { rwilcox as _rwilc }  from './rwilcox';
import { qwilcox } from './qwilcox';
import { pwilcox } from './pwilcox';
import { dwilcox } from './dwilcox';

import { IRNG, rng as _rng } from '../rng';


export function Wilcoxon(rng: IRNG = new _rng.SuperDuper(0)){
    function rwilcox(nn: number, m: number, n: number){
        return _rwilc(nn, n, m, rng);
    }
    return {
        rwilcox,
        dwilcox,
        pwilcox,
        qwilcox
    };
}