import { IResultHandler } from "../model/IResultHandler";
import { TVirtual } from "../model/TVirtual";
import { VComponent } from "../model/VComponent";
import { VElement } from "../model/VElement";
import { VList } from "../model/VList";

export function moveVirtual<TResult>({
	handler,
	parent,
	index,
	oldIndex,
	virtual,
}: {
	handler: IResultHandler<TResult>;
	parent: TResult;
	index: number;
	oldIndex: number;
	virtual: TVirtual<TResult>;
}) {
	if (virtual instanceof VList) {
		for (let i = 0; i < virtual.items.length; i++) {
			const r = moveVirtual({
				handler,
				parent,
				index,
				oldIndex: oldIndex + i,
				virtual: virtual.items[i],
			});
			index = r.index;
			oldIndex = r.oldIndex;
		}
	} else if (virtual instanceof VComponent) {
		for (let i = 0; i < virtual.renderedVirtual!.length; i++) {
			const r = moveVirtual({
				handler,
				parent,
				index,
				oldIndex,
				virtual: virtual.renderedVirtual![i],
			});
			index = r.index;
			oldIndex = r.oldIndex;
		}
	} else if (virtual instanceof VElement) {
		if (index !== oldIndex) {
			handler.move({
				parent,
				oldIndex,
				index,
				result: virtual.result as TResult,
				virtual,
			});
		}
		// console.warn(
		// 	`[qyt2r1] moveVirtual ${
		// 		virtual.name
		// 	} oldIndex: ${oldIndex} → index: ${index} :: oldIndex: ${
		// 		index <= oldIndex ? oldIndex + 1 : oldIndex
		// 	} → index: ${index + 1}`,
		// )
		if (index <= oldIndex) {
			oldIndex++;
		}
		index++;
	} else {
		throw new Error(`[qyt32i] Invalid move virtual type.`);
	}
	return { index, oldIndex };
}
