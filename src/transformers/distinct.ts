import { Collector, BaseCollector } from "../collector";
import { Mapper } from "../collections/groupingBy";
import { toArray } from "../collections/toArray";

export interface DistinctContainer<T, U> {
    keys : Map<U, number>;
    items: [U, T][];
}

export class DistinctCollector<T, U, A, R> extends BaseCollector<T, DistinctContainer<T, U>, R> {
    protected keyer : Mapper<T, U>;
    protected collector : Collector<T, A, R>;
    
    constructor ( keyer : Mapper<T, U>, collector : Collector<T, A, R> ) {
        super();

        this.keyer = keyer;
        this.collector = collector;
    }

    supply () : DistinctContainer<T, U> {
        return {
            keys: new Map(),
            items: []
        }
    }

    accumulate ( container : DistinctContainer<T, U>, item : T ) : void {
        const key = this.keyer( item );

        if ( !container.keys.has( key ) ) {
            container.keys.set( key, container.items.length );

            container.items.push( [ key, item ] );
        }
    }

    combine ( container1 : DistinctContainer<T, U>, container2 : DistinctContainer<T, U> ) : DistinctContainer<T, U> {
        const keys = new Map( container1.keys );

        const items = container1.items.slice();

        for ( let [ key, item ] of container2.items ) {
            if ( !keys.has( key ) ) {
                keys.set( key, items.length );

                items.push( [ key, item ] );
            }
        }

        return { keys, items };
    }

    finish ( container : DistinctContainer<T, U> ) : R {
        const subContainer = this.collector.supply();

        for ( let [ _, item ] of container.items ) {
            this.collector.accumulate( subContainer, item );
        }

        return this.collector.finish( subContainer );
    }
}

export function distinct<T> () : Collector<T, DistinctContainer<T, T>, T[]>;
export function distinct<T, U> ( keyer : Mapper<T, U> ) : Collector<T, DistinctContainer<T, U>, T[]>;
export function distinct<T, U, A, R> ( keyer : Mapper<T, U>, collector ?: Collector<U, any, R> ) : Collector<T, DistinctContainer<T, U>, R>;
export function distinct<T, U, A, R> ( keyer ?: Mapper<T, U | T>, collector ?: Collector<U, any, R> ) : Collector<T, DistinctContainer<T, U | T>, R | T[]> {
    return new DistinctCollector( keyer || ( x => x ), collector || toArray() as any );
}
