import { IResultHandler } from "../model/IResultHandler";
import { TVirtual } from "../model/TVirtual";
export declare function updateVirtual<TResult>({ handler, parent, index, virtual, oldVirtual, }: {
    handler: IResultHandler<TResult>;
    parent: TResult;
    index: number;
    virtual: TVirtual<TResult>;
    oldVirtual: TVirtual<TResult>;
}): number;
