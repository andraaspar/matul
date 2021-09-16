import { TRenderJSXWithChildren } from "../model/TRender";

export const FragmentComp: TRenderJSXWithChildren = (_, v) => {
	return v.children;
};
