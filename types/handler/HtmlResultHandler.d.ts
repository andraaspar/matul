import { TRender, TRenderJSX } from "../model/TRender";
export declare function mount(element: Element, virtuals: TRender | TRenderJSX): void;
export declare function unmount(element: Element): void;
export declare function render(): Promise<void>;
