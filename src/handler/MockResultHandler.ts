import { indent } from "../fun/indent";
import { join } from "../fun/join";
import { joinWith } from "../fun/joinWith";
import { IResultHandler } from "../model/IResultHandler";
import { IResultHandlerAddParams } from "../model/IResultHandlerAddParams";
import { IResultHandlerMoveParams } from "../model/IResultHandlerMoveParams";
import { IResultHandlerRemoveParams } from "../model/IResultHandlerRemoveParams";
import { IResultHandlerUpdateParams } from "../model/IResultHandlerUpdateParams";
import { TVirtual } from "../model/TVirtual";
import { VElement } from "../model/VElement";
import { VText } from "../model/VText";

export type TMockNode = MockElement | MockText;

export interface MockProps {
	s?: string;
	n?: number;
	i?: bigint;
	b?: boolean;
}

export class MockElement {
	public children: TMockNode[] = [];
	constructor(public name: string, public props: MockProps) {}
	toString() {
		const children = indent(this.children.join("\n"));
		return join(
			"<",
			joinWith(
				" ",
				this.name,
				...Object.entries(this.props).map(
					([name, value]) => `${name}=${JSON.stringify(value + "")}`
				)
			),
			children ? ">\n" : "/>",
			children,
			!!children && `\n</${this.name}>`
		);
	}
}

export class MockText {
	constructor(public text: string) {}
	toString() {
		return JSON.stringify(this.text);
	}
}

export class MockResultHandler implements IResultHandler<TMockNode> {
	root = new MockElement("document", {});
	v: TVirtual<TMockNode>[] | undefined;
	constructor() {}
	getRoot(): MockElement {
		return this.root;
	}
	getVirtuals(): TVirtual<TMockNode>[] | undefined {
		return this.v;
	}
	setVirtuals(v: TVirtual<TMockNode>[] | undefined): void {
		this.v = v;
	}
	addCallCount = 0;
	add(p: IResultHandlerAddParams<TMockNode>): TMockNode | undefined {
		this.addCallCount++;
		if (!(p.parent instanceof MockElement)) {
			throw new Error(`[qqh5gx]`);
		}
		let result: TMockNode;
		if (p.virtual instanceof VElement) {
			result = new MockElement(p.virtual.name, p.virtual.props);
		} else if (p.virtual instanceof VText) {
			result = new MockText(p.virtual.text);
		}
		p.parent.children.splice(p.index, 0, result!);
		return result!;
	}
	updateCallCount = 0;
	update(p: IResultHandlerUpdateParams<TMockNode>): TMockNode | undefined {
		this.updateCallCount++;
		if (p.virtual instanceof VElement) {
			(p.result as MockElement).props = p.virtual.props;
		} else if (p.virtual instanceof VText) {
			(p.result as MockText).text = p.virtual.text;
		}
		return p.result;
	}
	removeCallCount = 0;
	remove(p: IResultHandlerRemoveParams<TMockNode>): void {
		this.removeCallCount++;
		if (!(p.parent instanceof MockElement)) {
			throw new Error(`[qqh5t7]`);
		}
		if (!p.parentIsBeingRemoved) {
			p.parent.children.splice(p.index, 1);
		}
	}
	moveCallCount = 0;
	move(p: IResultHandlerMoveParams<TMockNode>): void {
		this.moveCallCount++;
		if (!(p.parent instanceof MockElement)) {
			throw new Error(`[qqh9ag]`);
		}
		// console.warn(
		// 	`[qyt3n4] ${p.oldIndex} → ${p.index} BEFORE:`,
		// 	p.parent.children,
		// )
		p.parent.children.splice(
			p.index,
			0,
			...p.parent.children.splice(p.oldIndex, 1)
		);
		// console.warn(
		// 	`[qyt3np] ${p.oldIndex} → ${p.index}  AFTER:`,
		// 	p.parent.children,
		// )
	}
	resetCallCounts() {
		this.addCallCount = 0;
		this.removeCallCount = 0;
		this.updateCallCount = 0;
		this.moveCallCount = 0;
	}
}
