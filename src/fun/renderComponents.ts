import { TVirtual } from "../model/TVirtual";
import { renderComponent } from "./renderComponent";
import { virtualTypesMatch } from "./virtualTypesMatch";

export function renderComponents(
	virtuals: TVirtual[],
	oldVirtuals: TVirtual[] | undefined
) {
	if (virtuals) {
		if (oldVirtuals) {
			for (let i = 0; i < virtuals.length; i++) {
				const virtual = virtuals[i];
				const oldVirtual = oldVirtuals[i];
				if (virtualTypesMatch(virtual, oldVirtual)) {
					renderComponent(virtual, oldVirtual);
				} else {
					renderComponent(virtual, undefined);
				}
			}
		} else {
			for (let i = 0; i < virtuals.length; i++) {
				renderComponent(virtuals[i], undefined);
			}
		}
	}
}
