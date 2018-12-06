export interface Supplier<T> {
    () : T;
}

export interface Accumulator<A, T> {
    ( container : A, item : T ) : void;
}

export interface Combinator<A> {
    ( first : A, second : A ) : A;
}

export interface Finisher<A, R> {
    ( container : A ) : R;
}

export interface Collector<T, A, R> {
    supply () : A;

    accumulate ( container : A, item : T ) : void;

    combine ( container1 : A, container2 : A ) : A;

    finish ( container : A ) : R;

    then <U> ( transformer : ( result : R ) => U ) : Collector<T, A, U>;

    apply ( iterable : Iterable<T> ) : R;
}

export class Collector<T, A, R> {
    static of<T, A, R> ( supplier : Supplier<A>, accumulator : Accumulator<A, T>, combinator : Combinator<A>, finisher : Finisher<A, R> ) : Collector<T, A, R>;
    static of<T, A> ( supplier : Supplier<A>, accumulator : Accumulator<A, T>, combinator : Combinator<A> ) : Collector<T, A, A>;
    static of<T, A, R> ( supplier : Supplier<A>, accumulator : Accumulator<A, T>, combinator : Combinator<A>, finisher ?: Finisher<A, R> ) {
        return new FunctionalCollector( supplier, accumulator, combinator, finisher || ( x => x as any ) );
    }
}

export abstract class BaseCollector<T, A, R> implements Collector<T, A, R> {
    abstract supply () : A;
    
    abstract accumulate ( container : A, item : T ) : void;

    abstract combine ( container1 : A, container2 : A ) : A;

    abstract finish ( container : A ) : R;

    then <U> ( transformer : ( result : R ) => U ) : Collector<T, A, U> {
        return Collector.of(
            this.supply.bind( this ),
            this.accumulate.bind( this ),
            this.combine.bind( this ),
            ( result : A ) => transformer( this.finish( result ) )
        );
    }

    apply ( iterable : Iterable<T> ) : R {
        const container = this.supply();

        for ( let item of iterable ) {
            this.accumulate( container, item );
        }

        return this.finish( container );
    }
}

export class FunctionalCollector<T, A, R> extends BaseCollector<T, A, R> implements Collector<T, A, R> {
    protected supplier : Supplier<A>;
    protected accumulator : Accumulator<A, T>;
    protected combinator : Combinator<A>;
    protected finisher : Finisher<A, R>;

    constructor ( supplier : Supplier<A>, 
                  accumulator : Accumulator<A, T>, 
                  combinator : Combinator<A>, 
                  finisher : Finisher<A, R> ) {
        super();

        this.supplier = supplier;
        this.accumulator = accumulator;
        this.combinator = combinator;
        this.finisher = finisher;
    }

    supply () : A {
        return this.supplier();
    }

    accumulate ( container : A, item : T ) : void {
        return this.accumulator( container, item );
    }

    combine ( container1 : A, container2 : A ) : A {
        return this.combinator( container1, container2 );
    }

    finish ( container : A ) : R {
        return this.finisher( container );
    }
}

export function collect<T, R> ( iterable : Iterable<T>, collector : Collector<T, any, R> ) : R {
    return collector.apply( iterable );
}
