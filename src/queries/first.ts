import { Collector } from "../collector";

export function first<T> () : Collector<T, { value: T }, T> {
    return Collector.of(
        () => ( { value: null } ),
        ( state, item ) => state.value === null ? state.value = item : void 0,
        ( stateA, stateB ) => ( { value: stateA.value != null ? stateA.value : stateB.value } ),
        state => state.value
    );
}
