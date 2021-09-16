import { IResultHandler } from "../model/IResultHandler";
import { TVirtual } from "../model/TVirtual";
export declare function removeVirtual<TResult>({ handler, parent, index, virtual, parentIsBeingRemoved, }: {
    handler: IResultHandler<TResult>;
    parent: TResult;
    index: number;
    virtual: TVirtual<TResult>;
    parentIsBeingRemoved: boolean;
}): void;
