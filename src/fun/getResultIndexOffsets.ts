import { TVirtual } from "../model/TVirtual";
import { VComponent } from "../model/VComponent";
import { VElement } from "../model/VElement";
import { VList } from "../model/VList";
import { VText } from "../model/VText";

function getResultIndexOffsets(items: TVirtual[]): number[] {
	let result: number[] = [];
	for (const item of items) {
		if (item instanceof VList) {
			result = result.concat(getResultIndexOffsets(item.items));
		} else if (item instanceof VComponent) {
			if (item.renderedVirtual == null) {
				throw new Error(`[qqfdmn] Component not rendered.`);
			}
			result = result.concat(getResultIndexOffsets(item.renderedVirtual));
		} else if (item instanceof VElement || item instanceof VText) {
			result.push(1);
		}
	}
	return result;
}
