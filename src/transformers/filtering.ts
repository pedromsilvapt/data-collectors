import { Collector, BaseCollector } from "../collector";
import { Mapper } from "../collections/groupingBy";
import { toArray } from "../collections/toArray";

export class FilteringCollector<T, A, R> extends BaseCollector<T, A, R> {
    protected predicate : Mapper<T, boolean>;
    protected collector : Collector<T, A, R>;
    
    constructor ( predicate : Mapper<T, boolean>, collector : Collector<T, A, R> ) {
        super();

        this.predicate = predicate;
        this.collector = collector;
    }

    supply () : A {
        return this.collector.supply();
    }

    accumulate ( container : A, item : T ) : void {
        if ( this.predicate( item ) ) {
            this.collector.accumulate( container, item );
        }
    }

    combine ( container1 : A, container2 : A ) : A {
        return this.collector.combine( container1, container2 );
    }

    finish ( container : A ) : R {
        return this.collector.finish( container );
    }
}

export function filtering<T, U> ( predicate : Mapper<T, boolean> ) : Collector<T, T[], T[]>;
export function filtering<T, A, R> ( predicate : Mapper<T, boolean>, collector ?: Collector<T, A, R> ) : Collector<T, A, R>;
export function filtering<T, A, R> ( predicate : Mapper<T, boolean>, collector ?: Collector<T, A, R> ) : Collector<T, A | T[], R | T[]> {
    return new FilteringCollector( predicate, collector || toArray() as any );
}
