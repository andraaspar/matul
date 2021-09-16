import { TVirtual } from "../model/TVirtual";
import { VComponent } from "../model/VComponent";
import { VElement } from "../model/VElement";
import { VList } from "../model/VList";
import { VText } from "../model/VText";

export function virtualTypesMatch(a: TVirtual, b: TVirtual): b is typeof a {
	return (
		(a instanceof VList && b instanceof VList) ||
		(a instanceof VComponent &&
			b instanceof VComponent &&
			a.renderInternal === b.renderInternal) ||
		(a instanceof VElement &&
			b instanceof VElement &&
			a.name === b.name &&
			a.trusted === b.trusted) ||
		(a instanceof VText && b instanceof VText)
	);
}
