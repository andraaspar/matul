import { IResultHandler } from "../model/IResultHandler";
import { getIsLogging } from "../model/logging";
import { TVirtual } from "../model/TVirtual";
import { VComponent } from "../model/VComponent";
import { VElement } from "../model/VElement";
import { VList } from "../model/VList";
import { VText } from "../model/VText";
import { addVirtual } from "./addVirtual";
import { applyHandlerToChildren } from "./applyHandlerToChildren";
import { getDeepIndex } from "./getDeepIndex";
import { moveVirtual } from "./moveVirtual";
import { removeVirtual } from "./removeVirtual";

export function updateVirtual<TResult>({
	handler,
	parent,
	index,
	virtual,
	oldVirtual,
}: {
	handler: IResultHandler<TResult>;
	parent: TResult;
	index: number;
	virtual: TVirtual<TResult>;
	oldVirtual: TVirtual<TResult>;
}): number {
	let localIndex = index;
	if (virtual instanceof VList) {
		const oldVirtualAsList = oldVirtual as VList;
		if (virtual.itemByKey.size && oldVirtualAsList.itemByKey.size) {
			// Remove excess items
			const currentItems: (VComponent | VElement)[] = [];
			for (let i = 0; i < oldVirtualAsList.items.length; i++) {
				const oldItem = oldVirtualAsList.items[i];
				if (oldItem instanceof VComponent || oldItem instanceof VElement) {
					const newItem = virtual.itemByKey.get(oldItem.key!);
					if (newItem) {
						localIndex = updateVirtual({
							handler,
							parent,
							index: localIndex,
							virtual: newItem,
							oldVirtual: oldItem,
						});
						currentItems.push(newItem);
					} else {
						removeVirtual({
							handler,
							parent,
							index: localIndex,
							virtual: oldVirtualAsList.items[i],
							parentIsBeingRemoved: false,
						});
					}
				}
			}
			// Add new items
			for (let i = 0; i < virtual.items.length; i++) {
				const item = virtual.items[i];
				if (item instanceof VComponent || item instanceof VElement) {
					const oldItem = oldVirtualAsList.itemByKey.get(item.key!);
					if (!oldItem) {
						localIndex = addVirtual({
							handler,
							parent,
							index: localIndex,
							virtual: item,
						});
						currentItems.push(item);
					}
				} else {
					if (getIsLogging()) {
						console.warn(`[qysuqc] Invalid list item!`, virtual.items, i, item);
					}
				}
			}
			// Move remaining items
			let changed = true;
			while (changed) {
				changed = false;
				for (let i = 0; i < currentItems.length - 1; i++) {
					const a = currentItems[i];
					const b = currentItems[i + 1];
					let aIndex = virtual.items.indexOf(a);
					let bIndex = virtual.items.indexOf(b);
					if (aIndex - bIndex > 0) {
						const newIndex = getDeepIndex(index, currentItems, a);
						const oldIndex = newIndex + (a instanceof VComponent ? a.count : 1);
						moveVirtual({
							handler,
							parent,
							index: newIndex,
							oldIndex: oldIndex,
							virtual: b,
						});
						currentItems[i] = b;
						currentItems[i + 1] = a;
						changed = true;
					}
				}
			}
		} else {
			if (getIsLogging()) {
				if (virtual.items.length && oldVirtualAsList.items.length) {
					console.warn(`[qyt810] List without a key!`, virtual);
				}
			}
			localIndex = applyHandlerToChildren({
				handler,
				parent,
				index: localIndex,
				virtuals: virtual.items,
				oldVirtuals: oldVirtualAsList.items,
				parentIsBeingRemoved: false,
			});
		}
	} else if (virtual instanceof VComponent) {
		// There is no need to distinguish between renderInternals here because that
		// is done in renderComponent. Here we only deal with the renderedVirtual.
		localIndex = applyHandlerToChildren({
			handler,
			parent,
			index: localIndex,
			virtuals: virtual.renderedVirtual,
			oldVirtuals: (oldVirtual as VComponent).renderedVirtual,
			parentIsBeingRemoved: false,
		});
		if (virtual.internal.onupdated) {
			try {
				virtual.internal.onupdated(false);
			} catch (e) {
				console.error(e);
			}
		}
	} else if (virtual instanceof VElement) {
		virtual.debug = (oldVirtual as VElement).debug;
		if (virtual.debug != null && --virtual.debug <= 0) {
			debugger;
		}
		virtual.result = (oldVirtual as VElement).result;
		handler.update({
			result: virtual.result as TResult,
			virtual,
			oldVirtual: oldVirtual as VElement,
		});
		localIndex++;
		applyHandlerToChildren({
			handler,
			parent: virtual.result,
			index: 0,
			virtuals: virtual.children,
			oldVirtuals: (oldVirtual as VElement).children,
			parentIsBeingRemoved: false,
		});
	} else if (virtual instanceof VText) {
		virtual.result = (oldVirtual as VText).result;
		handler.update({
			result: virtual.result as TResult,
			virtual,
			oldVirtual: oldVirtual as VText,
		});
		localIndex++;
	}
	return localIndex;
}
