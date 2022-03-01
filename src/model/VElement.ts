import { TProps } from "./TProps";
import { TVirtual } from "./TVirtual";

export class VElement<TResult = unknown> {
	public key: number | string | undefined;
	public ref: ((ref: TResult | undefined) => void) | undefined;
	public debug: number | undefined;
	public result: TResult | undefined;
	constructor(
		public name: string,
		public props: TProps,
		public children: TVirtual[],
		public trusted: string
	) {}
}
