import { Collector, BaseCollector, Supplier } from "../collector";

export class ToSetCollector<T, A extends Set<T>> extends BaseCollector<T, A, A> {
    protected supplier : Supplier<A>;

    constructor ( supplier : Supplier<A> ) {
        super();

        this.supplier = supplier;
    }

    supply () : A {
        return this.supplier();
    }

    accumulate ( container : A, item : T ) : void {
        container.add( item );
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

export function toSet<T> () : Collector<T, Set<T>, Set<T>>;
export function toSet<T, A extends Set<T>> ( factory : Supplier<A> ) : Collector<T, A, A>;
export function toSet<T, A extends Set<T>> ( factory ?: Supplier<A> ) : Collector<T, A, A> {
    return new ToSetCollector<T, A>( factory || ( () => new Set<T>() as A ) );
}
