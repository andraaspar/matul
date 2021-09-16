import { TVirtual } from "../model/TVirtual";
import { VComponent } from "../model/VComponent";
import { VElement } from "../model/VElement";
import { VList } from "../model/VList";
import { renderComponents } from "./renderComponents";
import { virtualTypesMatch } from "./virtualTypesMatch";

export function renderComponent(
	virtual: TVirtual,
	oldVirtual: TVirtual | undefined
) {
	if (virtual instanceof VList) {
		const oldVirtualAsList = oldVirtual as VList | undefined;
		if (
			oldVirtualAsList &&
			virtual.itemByKey.size &&
			oldVirtualAsList.itemByKey.size
		) {
			for (let i = 0; i < virtual.items.length; i++) {
				const item = virtual.items[i];
				if (item instanceof VComponent || item instanceof VElement) {
					const oldItem = oldVirtualAsList.itemByKey.get(item.key!);
					if (oldItem && virtualTypesMatch(item, oldItem)) {
						renderComponent(item, oldItem);
					} else {
						renderComponent(item, undefined);
					}
				}
			}
		} else {
			renderComponents(virtual.items, (oldVirtual as VList | undefined)?.items);
		}
		virtual.calculateCount();
	} else if (virtual instanceof VComponent) {
		if (oldVirtual instanceof VComponent) {
			virtual.debug = oldVirtual.debug;
			if (virtual.debug != null && --virtual.debug <= 0) {
				debugger;
			}
			virtual.internal = oldVirtual.internal;
			virtual.internal.props = virtual.props;
			virtual.state = virtual.internal.state;
			virtual.internal.children = virtual.children;
		}
		virtual.render();
		try {
			renderComponents(
				virtual.renderedVirtual!,
				(oldVirtual as VComponent | undefined)?.renderedVirtual
			);
		} catch (e) {
			if (virtual.internal.onerror) {
				try {
					virtual.internal.onerror(e);
					virtual.render();
					renderComponents(
						virtual.renderedVirtual!,
						(oldVirtual as VComponent | undefined)?.renderedVirtual
					);
				} catch (e2) {
					console.error(e2);
					throw e;
				}
			} else {
				throw e;
			}
		}
	} else if (virtual instanceof VElement) {
		renderComponents(
			virtual.children,
			(oldVirtual as VElement | undefined)?.children
		);
	}
}
