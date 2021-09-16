import { IResultHandler } from "../model/IResultHandler";
import { TVirtual } from "../model/TVirtual";
export declare function moveVirtual<TResult>({ handler, parent, index, oldIndex, virtual, }: {
    handler: IResultHandler<TResult>;
    parent: TResult;
    index: number;
    oldIndex: number;
    virtual: TVirtual<TResult>;
}): {
    index: number;
    oldIndex: number;
};
