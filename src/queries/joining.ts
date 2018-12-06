import { Collector, BaseCollector } from "../collector";
import { ToArrayCollector } from "../collections/toArray"

export class JoiningCollector extends BaseCollector<any, any[], string> implements Collector<any, any[], string> {
    protected collector : ToArrayCollector<any> = new ToArrayCollector();

    protected separator : string;

    protected prefix : string;

    protected suffix : string;

    constructor ( separator : string = ',', prefix : string = '', suffix : string = '' ) {
        super();

        this.separator = separator;
        this.prefix = prefix;
        this.suffix = suffix;
    }

    supply () : any[] {
        return this.collector.supply();
    }

    accumulate ( container : any[], item : any ) : void {
        return this.collector.accumulate( container, item );
    }

    combine ( container1 : any[], container2 : any[] ) : any[] {
        return this.collector.combine( container1, container2 );
    }

    finish ( container : any[] ) : string {
        return this.prefix + this.collector.finish( container ).join( this.separator ) + this.suffix;
    }
}

export function joining ( separator : string = ',', prefix : string = '', suffix : string = '' ) : Collector<any, any[], string> {
    return new JoiningCollector( separator, prefix, suffix );
}
