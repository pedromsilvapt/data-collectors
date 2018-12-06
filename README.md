# Collectors

> A collection of composable reduction operations for arbitrary streams of values

# Installation
```shell
npm install --save data-collectors
```

# Usage
Useful to reduce data in many ways.

```typescript
import { collect, groupingBy, first, mapping, sorting } from 'data-collectors';

interface Person {
    role : 'admin' | 'moderator' | 'user';
    id : number;
    name : string;
}

const array : Person[] = [ { role: 'admin', id: 1, name: 'John' }, { role: 'user', id: 2, name: 'David' }, { role: 'user', id: 3, name: 'Peter' } ];

let collector = groupingBy( user => user.role, groupingBy( user => user.id, first() ) );

collect( array, collector ); // Map { 'admin' => Map{ 1 => ... }, 'user' => { 2 => ..., 3 => ... } };

let collector2 = groupingBy( user => user.role, mapping( user => user.id ) );

collect( array, collector2 ); // Map { 'admin' => [ 1 ], 'user' => [ 2, 3 ] };

// Sort the array by name
collect( array, sorting( ( a, b ) => a.name.localeCompare( b.name ) ) );  // [ { ... name: 'David' }, { ... name: 'John' }, { ... name: 'Peter' } ]
```

Note that while some collectors can only be used on their own (like `first` or `last`), others can be composed (like `mapping` accepts a second argument after the mapper function, or `groupingBy` which also accepts a second optional collector argument (default is `toArray()`) that will be applied to each value of the resulting Map).
