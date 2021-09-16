import { IResultHandler } from "../model/IResultHandler";
import { TVirtualIn } from "../model/TVirtualIn";
import { applyHandlerToChildren } from "./applyHandlerToChildren";
import { renderComponents } from "./renderComponents";
import { wrapVirtuals } from "./wrapVirtuals";

export function applyHandler(
	handler: IResultHandler<any>,
	virtuals: TVirtualIn[] | undefined
) {
	const virtualsWrapped = virtuals ? wrapVirtuals(virtuals) : undefined;
	const oldVirtuals = handler.getVirtuals();
	if (virtualsWrapped) renderComponents(virtualsWrapped, oldVirtuals);
	applyHandlerToChildren({
		handler,
		parent: handler.getRoot(),
		index: 0,
		virtuals: virtualsWrapped,
		oldVirtuals,
		parentIsBeingRemoved: false,
	});
	handler.setVirtuals(virtualsWrapped);
}
