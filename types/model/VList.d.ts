import { TVirtual } from "./TVirtual";
import { VComponent } from "./VComponent";
import { VElement } from "./VElement";
export declare class VList<TResult = unknown> {
    items: TVirtual<TResult>[];
    itemByKey: Map<string | number, VElement<unknown> | VComponent<{}, {}, unknown>>;
    count: number;
    constructor(items: TVirtual<TResult>[]);
    calculateCount(): void;
}
