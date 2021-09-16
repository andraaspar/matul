import { VElement } from "./VElement";
import { VText } from "./VText";
export interface IResultHandlerAddParams<TResult> {
    parent: TResult;
    index: number;
    virtual: VElement | VText;
}
