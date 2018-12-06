import { Collector } from "../collector";

export interface Comparator<T> {
    ( a : T, b : T ) : number;
}

export function averaging () : Collector<number, any, number> {
    return Collector.of( 
        () => ( { sum: 0, count: 0 } ),
        ( state, item ) => {
            state.sum += item;
            state.count += 1;
        },
        ( stateA, stateB ) => ( { sum: stateA.sum + stateB.sum, count: stateA.count + stateB.count } ),
        ( { sum, count } ) => count > 0 ? sum / count : count
    );
}

export function sum () : Collector<number, any, number> {
    return Collector.of( 
        () => 0,
        ( state, item ) => state + item,
        ( stateA, stateB ) => stateA + stateB,
        ( state ) => state
    );
}

export function bounds<T> ( comparator : Comparator<T> ) : Collector<T, any, [T, T]>;
export function bounds () : Collector<number, any, [number, number]>;
export function bounds<T> ( comparator ?: Comparator<T> ) : Collector<T, any, [T, T]>  {
    if ( !comparator ) comparator = ( a : any, b : any ) => a - b;

    const accumulator = ( state : [T, T], item : T ) => {
        if ( state[ 0 ] == null || comparator( state[ 0 ], item ) < 0 ) state[ 0 ] = item;
        if ( state[ 1 ] == null || comparator( state[ 1 ], item ) > 0 ) state[ 1 ] = item;
    };

    return Collector.of(
        () => [null, null] as [T, T],
        accumulator,
        ( a, b ) => {
            accumulator( a, b[ 0 ] );
            accumulator( a, b[ 1 ] );

            return a;
        }
    );
}
export function max<T> ( comparator : Comparator<T> ) : Collector<T, any, T>;
export function max () : Collector<number, any, number>;
export function max<T> ( comparator ?: Comparator<T> ) : Collector<T, any, T> {
    return bounds( comparator ).then( b => b[ 1 ] );
}

export function min<T> ( comparator : Comparator<T> ) : Collector<T, any, T>;
export function min () : Collector<number, any, number>;
export function min<T> ( comparator ?: Comparator<T> ) : Collector<T, any, T> {
    return bounds( comparator ).then( b => b[ 0 ] );
}
