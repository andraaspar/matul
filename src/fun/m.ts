import { TProps as TPropsMap } from "../model/TProps";
import { TRender, TRenderAny } from "../model/TRender";
import { TVirtual } from "../model/TVirtual";
import { TVirtualIn } from "../model/TVirtualIn";
import { VComponent } from "../model/VComponent";
import { VElement } from "../model/VElement";
import { wrapVirtuals } from "./wrapVirtuals";

type GetTProps<C extends TRenderAny<any, any>> = C extends TRender<infer TProps>
	? TProps
	: unknown;

export function m<TProps extends object = {}, TState extends object = {}>(
	nameOrComp: string,
	propsOrChildren?: TVirtualIn[]
): TVirtual;
export function m<TProps extends object = {}, TState extends object = {}>(
	nameOrComp: string,
	propsOrChildren?: TPropsMap,
	children?: TVirtualIn[]
): TVirtual;
export function m<TProps extends object = {}, TState extends object = {}>(
	nameOrComp: TRenderAny<TProps, TState>,
	propsOrChildren: GetTProps<typeof nameOrComp>,
	children?: TVirtualIn[]
): TVirtual;
export function m<TProps extends object = {}, TState extends object = {}>(
	nameOrComp: string | TRenderAny<TProps, TState>,
	propsOrChildren?: TProps | TVirtualIn[],
	children?: TVirtualIn[]
): TVirtual {
	const props = Array.isArray(propsOrChildren) ? {} : propsOrChildren || {};
	const actualChildren = Array.isArray(propsOrChildren)
		? propsOrChildren
		: children || [];
	const childrenWrapped = actualChildren
		? wrapVirtuals(
				Array.isArray(actualChildren) // JSX does not need an []
					? actualChildren
					: [actualChildren]
		  )
		: [];
	if (typeof nameOrComp === "function") {
		const key = (props as any).key;
		const debug = (props as any).debug;
		delete (props as any).key;
		delete (props as any).debug;
		const result = new VComponent(nameOrComp, props as any, childrenWrapped);
		result.key = key;
		result.debug = debug;
		return result;
	} else {
		const key = (props as any).key;
		const ref = (props as any).ref;
		const debug = (props as any).debug;
		const trust = (props as any).__UNSAFE_trust__;
		delete (props as any).key;
		delete (props as any).ref;
		delete (props as any).debug;
		delete (props as any).__UNSAFE_trust__;
		const result = new VElement(nameOrComp, props, childrenWrapped, trust);
		result.key = key;
		result.ref = ref;
		result.debug = debug;
		return result;
	}
}
