import { VElement } from "./VElement";
import { VText } from "./VText";

export interface IResultHandlerUpdateParams<TResult> {
	result: TResult;
	virtual: VElement | VText;
	oldVirtual: VElement | VText;
}
