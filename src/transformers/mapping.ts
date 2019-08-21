import { Collector, BaseCollector, collect } from "../collector";
import { Mapper } from "../collections/groupingBy";
import { toArray } from "../collections/toArray";
import { first } from '../queries/first';

export class MappingCollector<T, U, A, R> extends BaseCollector<T, A, R> {
    protected mapper : Mapper<T, U>;
    protected collector : Collector<U, A, R>;
    
    constructor ( mapper : Mapper<T, U>, collector : Collector<U, A, R> ) {
        super();

        this.mapper = mapper;
        this.collector = collector;
    }

    supply () : A {
        return this.collector.supply();
    }

    accumulate ( container : A, item : T ) : void {
        this.collector.accumulate( container, this.mapper( item ) );
    }

    combine ( container1 : A, container2 : A ) : A {
        return this.collector.combine( container1, container2 );
    }

    finish ( container : A ) : R {
        return this.collector.finish( container );
    }
}

export function mapping<T, U> ( mapper : Mapper<T, U> ) : Collector<T, U[], U[]>;
export function mapping<T, U, A, R> ( mapper : Mapper<T, U>, collector ?: Collector<U, A, R> ) : Collector<T, A, R>;
export function mapping<T, U, A, R> ( mapper : Mapper<T, U>, collector ?: Collector<U, A, R> ) : Collector<T, A | U[], R | U[]> {
    return new MappingCollector( mapper, collector || toArray() as any );
}
