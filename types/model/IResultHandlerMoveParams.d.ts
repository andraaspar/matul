import { VElement } from "./VElement";
export interface IResultHandlerMoveParams<TResult> {
    parent: TResult;
    oldIndex: number;
    index: number;
    result: TResult;
    virtual: VElement;
}
