import { Spread } from "../model/Spread";
import { TVirtual } from "../model/TVirtual";
import { TVirtualIn } from "../model/TVirtualIn";
import { VComponent } from "../model/VComponent";
import { VElement } from "../model/VElement";
import { VList } from "../model/VList";
import { VPlaceholder } from "../model/VPlaceholder";
import { VText } from "../model/VText";

export function wrapVirtuals(children: TVirtualIn[]): TVirtual[] {
	const result: TVirtual[] = [];
	for (const child of children) {
		if (
			child instanceof VList ||
			child instanceof VComponent ||
			child instanceof VElement ||
			child instanceof VText ||
			child instanceof VPlaceholder
		) {
			result.push(child);
		} else if (child instanceof Spread) {
			for (const spreadChild of wrapVirtuals(child.items)) {
				result.push(spreadChild);
			}
		} else if (Array.isArray(child)) {
			result.push(new VList(wrapVirtuals(child)));
		} else if (["string", "number", "bigint"].includes(typeof child)) {
			result.push(new VText(child + ""));
		} else {
			result.push(new VPlaceholder(child));
		}
	}
	return result;
}
