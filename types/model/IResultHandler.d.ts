import { IResultHandlerAddParams } from "./IResultHandlerAddParams";
import { IResultHandlerMoveParams } from "./IResultHandlerMoveParams";
import { IResultHandlerRemoveParams } from "./IResultHandlerRemoveParams";
import { IResultHandlerUpdateParams } from "./IResultHandlerUpdateParams";
import { TVirtual } from "./TVirtual";
export interface IResultHandler<TResult> {
    getRoot(): TResult;
    getVirtuals(): TVirtual<TResult>[] | undefined;
    setVirtuals(v: TVirtual<TResult>[] | undefined): void;
    add(p: IResultHandlerAddParams<TResult>): TResult | undefined;
    update(p: IResultHandlerUpdateParams<TResult>): TResult | undefined;
    remove(p: IResultHandlerRemoveParams<TResult>): void;
    move(p: IResultHandlerMoveParams<TResult>): void;
}
