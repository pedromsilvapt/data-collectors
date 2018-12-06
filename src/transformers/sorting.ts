import { Collector } from "../collector";
import { Comparator } from "../queries/math";
import { toArray } from "../collections/toArray";

export function sorting<T, A, R> ( comparator ?: Comparator<T>, collector ?: Collector<T, A, R> ) : Collector<T, T[], R>;
export function sorting<T, A, R> ( comparator ?: Comparator<T> ) : Collector<T, T[], T[]>;
export function sorting<T, A, R> ( comparator ?: Comparator<T>, collector ?: Collector<T, A, R> ) : Collector<T, T[], R> {
    return toArray<T>().then( arr => {
        arr.sort( comparator );

        if ( collector ) {
            return collector.apply( arr );
        } else {
            return arr as any as R;
        }
    } );
}
