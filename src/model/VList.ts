import { TVirtual } from "./TVirtual";
import { VComponent } from "./VComponent";
import { VElement } from "./VElement";
import { VText } from "./VText";

export class VList<TResult = unknown> {
	public itemByKey = new Map<number | string, VComponent | VElement>();
	public count = 0;
	constructor(public items: TVirtual<TResult>[]) {
		let expectedKeyCount = items.length;
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (item instanceof VComponent || item instanceof VElement) {
				if (item.key != null) {
					this.itemByKey.set(item.key, item);
				}
			} else if (item instanceof VText || item instanceof VList) {
				this.itemByKey.clear();
				break;
			} else {
				expectedKeyCount--;
			}
		}
		if (this.itemByKey.size && this.itemByKey.size < expectedKeyCount) {
			throw new Error(`[qqf32k] Missing keys.`);
		}
	}
	public calculateCount() {
		this.count = 0;
		for (const item of this.items) {
			if (item instanceof VList || item instanceof VComponent) {
				this.count += item.count;
			} else if (item instanceof VElement || item instanceof VText) {
				this.count++;
			}
		}
	}
}
