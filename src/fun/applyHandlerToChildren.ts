import { IResultHandler } from "../model/IResultHandler";
import { TVirtual } from "../model/TVirtual";
import { addVirtual } from "./addVirtual";
import { removeVirtual } from "./removeVirtual";
import { updateVirtual } from "./updateVirtual";
import { virtualTypesMatch } from "./virtualTypesMatch";

export function applyHandlerToChildren<TResult>({
	handler,
	parent,
	index,
	virtuals,
	oldVirtuals,
	parentIsBeingRemoved,
}: {
	handler: IResultHandler<TResult>;
	parent: TResult;
	index: number;
	virtuals: TVirtual[] | undefined;
	oldVirtuals: TVirtual[] | undefined;
	parentIsBeingRemoved: boolean;
}): number {
	if (virtuals) {
		if (oldVirtuals) {
			for (let i = virtuals.length; i < oldVirtuals.length; i++) {
				// console.warn(`[qyst2q] Losing children!`, oldVirtuals, virtuals)
				removeVirtual({
					handler,
					parent,
					index,
					virtual: oldVirtuals[i],
					parentIsBeingRemoved,
				});
			}
			for (let i = 0; i < virtuals.length; i++) {
				const virtual = virtuals[i];
				const oldVirtual = oldVirtuals[i];
				if (virtualTypesMatch(virtual, oldVirtual)) {
					index = updateVirtual({
						handler,
						parent,
						index,
						virtual,
						oldVirtual,
					});
				} else {
					if (oldVirtual) {
						removeVirtual({
							handler,
							parent,
							index,
							virtual: oldVirtual,
							parentIsBeingRemoved: false,
						});
					} /*  else {
						console.warn(`[qyst5k] Gaining children!`, oldVirtual, virtual)
					} */
					index = addVirtual({
						handler,
						parent,
						index,
						virtual,
					});
				}
			}
		} else {
			for (let i = 0; i < virtuals.length; i++) {
				index = addVirtual({ handler, parent, index, virtual: virtuals[i] });
			}
		}
	} else {
		if (oldVirtuals) {
			for (let i = 0; i < oldVirtuals.length; i++) {
				removeVirtual({
					handler,
					parent,
					index,
					virtual: oldVirtuals[i],
					parentIsBeingRemoved,
				});
			}
		}
	}
	return index;
}
