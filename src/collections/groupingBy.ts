import { Collector, BaseCollector, Supplier, collect } from "../collector";
import { toArray } from "./toArray";
import { mapping } from "../transformers/mapping";

export interface Mapper<T, U> {
    ( value : T ) : U;
}

export class GroupingByCollector<T, K, A, D, M extends Map<K, D>> extends BaseCollector<T, Map<K, A>, Map<K, D>> {
    protected mapper : Mapper<T, K>;
    protected supplier : Supplier<M>;
    protected collector : Collector<T, A, D>;

    constructor ( mapper : Mapper<T, K>, supplier : Supplier<M>, collector : Collector<T, A, D> ) {
        super();

        this.mapper = mapper;
        this.supplier = supplier;
        this.collector = collector;
    }

    supply () : Map<K, A> {
        return new Map<K, A>();
    }

    accumulate ( container : Map<K, A>, item : T ) : void {
        const key = this.mapper( item );
        
        if ( !container.get( key ) ) {
            const subContainer = this.collector.supply();

            container.set( key, subContainer );

            this.collector.accumulate( subContainer, item );
        } else {
            this.collector.accumulate( container.get( key ), item );
        }
    }

    combine ( container1 : Map<K, A>, container2 : Map<K, A> ) : Map<K, A> {
        for ( let [ key, value ] of container2 ) {
            container1.set( key, this.collector.combine( container1.get( key ), value ) );
        }

        return container1;
    }

    finish ( container : Map<K, A> ) : Map<K, D> {
        let finished = this.supplier();

        for ( let [ key, value ] of container ) {
            finished.set( key, this.collector.finish( value ) );
        }

        return finished;
    }
}

export function groupingBy<T, K> ( mapper : ( item : T ) => K ) : Collector<T, Map<K, T[]>, Map<K, T[]>>;
export function groupingBy<T, K, A, D> ( mapper : ( item : T ) => K, collector : Collector<T, A, D> ) : Collector<T, Map<K, A>, Map<K, D>>;
export function groupingBy<T, K, A, D, M extends Map<K, D>> ( mapper : ( item : T ) => K, supplier : Supplier<M>, collector : Collector<T, A, D> ) : Collector<T, Map<K, A>, Map<K, D>>;
export function groupingBy<T, K, A, D, M extends Map<K, D>> ( mapper : ( item : T ) => K, supplier ?: Supplier<M> | Collector<T, A, D>, collector ?: Collector<T, A, D> ) : Collector<T, any, any> {
    if ( !supplier && !collector ) {
        return groupingBy( mapper, () => new Map(), toArray() );
    } else if ( !collector ) {
        return groupingBy( mapper, () => new Map(), supplier as Collector<T, A, D> );
    }

    return new GroupingByCollector( mapper, supplier as Supplier<M>, collector );
}
