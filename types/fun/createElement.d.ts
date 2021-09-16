import { TVirtual } from "../model/TVirtual";
import { TVirtualIn } from "../model/TVirtualIn";
declare global {
    namespace JSX {
        type Element = TVirtual | TVirtual[];
        interface IntrinsicElements {
            [k: string]: any;
        }
        interface ElementAttributesProperty {
            props: {};
        }
        interface ElementChildrenAttribute {
            children: {};
        }
        interface IntrinsicAttributes {
            key?: string | number;
            debug?: number;
        }
    }
}
export declare function createElement(type: string, props?: any, ...children: TVirtualIn[]): TVirtual<unknown>;
