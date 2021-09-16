import { IResultHandler } from "../model/IResultHandler";
import { TVirtual } from "../model/TVirtual";
export declare function addVirtual<TResult>({ handler, parent, index, virtual, }: {
    handler: IResultHandler<TResult>;
    parent: TResult;
    index: number;
    virtual: TVirtual<TResult>;
}): number;
