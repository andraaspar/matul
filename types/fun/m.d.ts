import { TProps as TPropsMap } from "../model/TProps";
import { TRender, TRenderAny } from "../model/TRender";
import { TVirtual } from "../model/TVirtual";
import { TVirtualIn } from "../model/TVirtualIn";
declare type GetTProps<C extends TRenderAny<any, any>> = C extends TRender<infer TProps> ? TProps : unknown;
export declare function m<TProps extends object = {}, TState extends object = {}>(nameOrComp: string, propsOrChildren?: TVirtualIn[]): TVirtual;
export declare function m<TProps extends object = {}, TState extends object = {}>(nameOrComp: string, propsOrChildren?: TPropsMap, children?: TVirtualIn[]): TVirtual;
export declare function m<TProps extends object = {}, TState extends object = {}>(nameOrComp: TRenderAny<TProps, TState>, propsOrChildren: GetTProps<typeof nameOrComp>, children?: TVirtualIn[]): TVirtual;
export {};
