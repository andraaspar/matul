import { IComponentInternal } from "./IComponentInternal";
import { TRenderAny } from "./TRender";
import { TVirtual } from "./TVirtual";
export declare class VComponent<TProps extends object = {}, TState extends object = {}, TResult = unknown> {
    renderInternal: TRenderAny<TProps>;
    props: TProps;
    children: TVirtual<TResult>[];
    key: number | string | undefined;
    renderedVirtual: TVirtual<TResult>[] | undefined;
    count: number;
    state: Partial<TState>;
    internal: IComponentInternal<TProps, TState, TResult>;
    debug: number | undefined;
    constructor(renderInternal: TRenderAny<TProps>, props: TProps, children: TVirtual<TResult>[]);
    render(): void;
}
