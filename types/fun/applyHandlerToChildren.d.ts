import { IResultHandler } from "../model/IResultHandler";
import { TVirtual } from "../model/TVirtual";
export declare function applyHandlerToChildren<TResult>({ handler, parent, index, virtuals, oldVirtuals, parentIsBeingRemoved, }: {
    handler: IResultHandler<TResult>;
    parent: TResult;
    index: number;
    virtuals: TVirtual[] | undefined;
    oldVirtuals: TVirtual[] | undefined;
    parentIsBeingRemoved: boolean;
}): number;
