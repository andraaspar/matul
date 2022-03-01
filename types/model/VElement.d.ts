import { TProps } from "./TProps";
import { TVirtual } from "./TVirtual";
export declare class VElement<TResult = unknown> {
    name: string;
    props: TProps;
    children: TVirtual[];
    trusted: string;
    key: number | string | undefined;
    ref: ((ref: TResult | undefined) => void) | undefined;
    debug: number | undefined;
    result: TResult | undefined;
    constructor(name: string, props: TProps, children: TVirtual[], trusted: string);
}
