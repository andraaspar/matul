import { IComponentInternal } from "./IComponentInternal";
import { TProps as TPropsBase } from "./TProps";
import { TVirtual } from "./TVirtual";
import { TVirtualIn } from "./TVirtualIn";

export type TRender<
	TProps extends TPropsBase = {},
	TState extends object = {}
> = (_: TProps, v: IComponentInternal<TProps, TState>) => TVirtual[];

export type TRenderJSX<
	TProps extends TPropsBase = {},
	TState extends object = {}
> = (_: TProps, v: IComponentInternal<TProps, TState>) => JSX.Element;

export type TRenderJSXWithChildren<
	TProps extends TPropsBase = {},
	TState extends object = {}
> = (
	_: TProps & { children?: TVirtualIn },
	v: IComponentInternal<TProps, TState>
) => JSX.Element;

export type TRenderAny<
	TProps extends TPropsBase = {},
	TState extends object = {}
> =
	| TRender<TProps, TState>
	| TRenderJSX<TProps, TState>
	| TRenderJSXWithChildren<TProps, TState>;
