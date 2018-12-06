import { Collector, BaseCollector, Supplier } from "../collector";

export class ToMapCollector<K, V, A extends Map<K, V>> extends BaseCollector<[K, V], A, A> {
    protected supplier : Supplier<A>;

    constructor ( supplier : Supplier<A> ) {
        super();

        this.supplier = supplier;
    }

    supply () : A {
        return this.supplier();
    }

    accumulate ( container : A, [ key, value ] : [ K, V ] ) : void {
        container.set( key, value );
    }

    combine ( container1 : A, container2 : A ) : A {
        for ( let value of container2 ) {
            this.accumulate( container1, value );
        }

        return container1;
    }

    finish ( container : A ) : A {
        return container;
    }
}

export function toMap<K, V> () : Collector<[K, V], Map<K, V>, Map<K, V>>;
export function toMap<K, V, A extends Map<K, V>> ( factory : Supplier<A> ) : Collector<[K, V], A, A>;
export function toMap<K, V, A extends Map<K, V>> ( factory ?: Supplier<A> ) : Collector<[K, V], A, A> {
    return new ToMapCollector<K, V, A>( factory || ( () => new Map<K, V>() as A ) );
}
