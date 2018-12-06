import { Collector } from "../collector";

export function last<T> () : Collector<T, { value: T }, T> {
    return Collector.of(
        () => ( { value: null } ),
        ( state, item ) => state.value = item,
        ( _, stateB ) => stateB,
        state => state.value
    );
}
