import { TVirtual } from "./TVirtual";

export interface IComponentInternal<
	TProps extends object = {},
	TState extends object = {},
	TResult = unknown
> {
	props: TProps;
	state: Partial<TState>;
	children: TVirtual<TResult>[];
	onadded?: () => void;
	onupdated?: (initial: boolean) => void;
	onremove?: () => void;
	onerror?: (e: any) => void;
	isRemoved?: boolean;
}
