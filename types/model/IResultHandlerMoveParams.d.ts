import { VElement } from "./VElement";
import { VText } from "./VText";
export interface IResultHandlerMoveParams<TResult> {
    parent: TResult;
    oldIndex: number;
    index: number;
    result: TResult;
    virtual: VElement | VText;
}
