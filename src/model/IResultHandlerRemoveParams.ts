import { VElement } from "./VElement";
import { VText } from "./VText";

export interface IResultHandlerRemoveParams<TResult> {
	parent: TResult;
	index: number;
	result: TResult;
	virtual: VElement | VText;
	parentIsBeingRemoved: boolean;
}
