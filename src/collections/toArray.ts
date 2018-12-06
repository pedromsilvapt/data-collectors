import { Collector, BaseCollector } from "../collector";

export class ToArrayCollector<T> extends BaseCollector<T, T[], T[]> {
    supply () : T[] {
        return [];
    }

    accumulate ( container : T[], item : T ) : void {
        container.push( item );
    }

    combine ( container1 : T[], container2 : T[] ) : T[] {
        return container1.concat( container2 );
    }

    finish ( container : T[] ) : T[] {
        return container;
    }
}

export function toArray<T> () : Collector<T, T[], T[]> {
    return new ToArrayCollector<T>();
}
