import { IResultHandler } from "../model/IResultHandler";
import { TVirtual } from "../model/TVirtual";
import { VComponent } from "../model/VComponent";
import { VElement } from "../model/VElement";
import { VList } from "../model/VList";
import { VText } from "../model/VText";
import { applyHandlerToChildren } from "./applyHandlerToChildren";

export function removeVirtual<TResult>({
	handler,
	parent,
	index,
	virtual,
	parentIsBeingRemoved,
}: {
	handler: IResultHandler<TResult>;
	parent: TResult;
	index: number;
	virtual: TVirtual<TResult>;
	parentIsBeingRemoved: boolean;
}) {
	if (virtual instanceof VList) {
		for (let i = 0; i < virtual.items.length; i++) {
			removeVirtual({
				handler,
				parent,
				index,
				virtual: virtual.items[i],
				parentIsBeingRemoved,
			});
		}
	} else if (virtual instanceof VComponent) {
		if (virtual.internal.onremove) {
			try {
				virtual.internal.onremove();
			} catch (e) {
				console.error(e);
			}
		}
		applyHandlerToChildren({
			handler,
			parent,
			index,
			virtuals: undefined,
			oldVirtuals: virtual.renderedVirtual,
			parentIsBeingRemoved,
		});
		virtual.internal.isRemoved = true;
	} else if (virtual instanceof VElement) {
		applyHandlerToChildren({
			handler,
			parent: virtual.result,
			index: 0,
			virtuals: undefined,
			oldVirtuals: virtual.children,
			parentIsBeingRemoved: true,
		});
		handler.remove({
			parent,
			index,
			result: virtual.result as TResult,
			virtual,
			parentIsBeingRemoved,
		});
		if (virtual.ref) {
			try {
				virtual.ref(null);
			} catch (e) {
				console.error(e);
			}
		}
	} else if (virtual instanceof VText) {
		handler.remove({
			parent,
			index,
			result: virtual.result as TResult,
			virtual,
			parentIsBeingRemoved,
		});
	}
}
