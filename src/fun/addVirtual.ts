import { IResultHandler } from "../model/IResultHandler";
import { TVirtual } from "../model/TVirtual";
import { VComponent } from "../model/VComponent";
import { VElement } from "../model/VElement";
import { VList } from "../model/VList";
import { VText } from "../model/VText";
import { applyHandlerToChildren } from "./applyHandlerToChildren";

export function addVirtual<TResult>({
	handler,
	parent,
	index,
	virtual,
}: {
	handler: IResultHandler<TResult>;
	parent: TResult;
	index: number;
	virtual: TVirtual<TResult>;
}): number {
	if (virtual instanceof VList) {
		for (let i = 0; i < virtual.items.length; i++) {
			index = addVirtual({ handler, parent, index, virtual: virtual.items[i] });
		}
	} else if (virtual instanceof VComponent) {
		index = applyHandlerToChildren({
			handler,
			parent,
			index,
			virtuals: virtual.renderedVirtual,
			oldVirtuals: undefined,
			parentIsBeingRemoved: false,
		});
		if (virtual.internal.onadded) {
			try {
				virtual.internal.onadded();
			} catch (e) {
				console.error(e);
			}
		}
		if (virtual.internal.onupdated) {
			try {
				virtual.internal.onupdated(true);
			} catch (e) {
				console.error(e);
			}
		}
	} else if (virtual instanceof VElement) {
		virtual.result = handler.add({ parent, index, virtual });
		index++;
		if (virtual.trusted == null) {
			applyHandlerToChildren({
				parent: virtual.result,
				handler,
				index: 0,
				virtuals: virtual.children,
				oldVirtuals: undefined,
				parentIsBeingRemoved: false,
			});
		}
		if (virtual.ref) {
			try {
				virtual.ref(virtual.result);
			} catch (e) {
				console.error(e);
			}
		}
	} else if (virtual instanceof VText) {
		virtual.result = handler.add({ parent, index, virtual });
		index++;
	}
	return index;
}
