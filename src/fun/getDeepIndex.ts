import { TVirtual } from "../model/TVirtual";
import { VComponent } from "../model/VComponent";
import { VList } from "../model/VList";

export function getDeepIndex(
	index: number,
	items: TVirtual[],
	item: TVirtual
): number {
	for (let i = 0; i < items.length; i++) {
		const currentItem = items[i];
		if (currentItem === item) {
			return index;
		} else if (
			currentItem instanceof VList ||
			currentItem instanceof VComponent
		) {
			index += currentItem.count;
		} else {
			index++;
		}
	}
	throw new Error(`[qyswku] Deep index not found.`);
}
