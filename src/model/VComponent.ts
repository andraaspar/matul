import { wrapVirtuals } from "../fun/wrapVirtuals";
import { IComponentInternal } from "./IComponentInternal";
import { TRenderAny } from "./TRender";
import { TVirtual } from "./TVirtual";
import { VList } from "./VList";

export class VComponent<
	TProps extends object = {},
	TState extends object = {},
	TResult = unknown
> {
	public key: number | string | undefined;
	public renderedVirtual: TVirtual<TResult>[] | undefined;
	public count = 0;
	public state: Partial<TState> = {};
	public internal: IComponentInternal<TProps, TState, TResult>;
	public debug: number | undefined;
	constructor(
		public renderInternal: TRenderAny<TProps>,
		public props: TProps,
		public children: TVirtual<TResult>[]
	) {
		this.internal = {
			props,
			state: this.state,
			children,
		};
	}

	public render(): void {
		this.renderedVirtual = this.renderInternal(
			undefined as any as TProps /* props is here for JSX only */,
			this.internal
		) as TVirtual<TResult>[];
		if (!Array.isArray(this.renderedVirtual)) {
			// JSX
			this.renderedVirtual = this.renderedVirtual ? [this.renderedVirtual] : [];
		}
		this.renderedVirtual = wrapVirtuals(this.renderedVirtual);
		this.count = 0;
		for (const virtual of this.renderedVirtual) {
			if (virtual instanceof VList || virtual instanceof VComponent) {
				this.count += virtual.count;
			} else {
				this.count++;
			}
		}
	}
}
