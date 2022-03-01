import { applyHandler } from "../fun/applyHandler";
import { m } from "../fun/m";
import { IResultHandler } from "../model/IResultHandler";
import { IResultHandlerAddParams } from "../model/IResultHandlerAddParams";
import { IResultHandlerMoveParams } from "../model/IResultHandlerMoveParams";
import { IResultHandlerRemoveParams } from "../model/IResultHandlerRemoveParams";
import { IResultHandlerUpdateParams } from "../model/IResultHandlerUpdateParams";
import { getIsLogging } from "../model/logging";
import { TRender, TRenderJSX } from "../model/TRender";
import { TVirtual } from "../model/TVirtual";
import { VElement } from "../model/VElement";
import { VText } from "../model/VText";

const isDataRe = /^data-/i;
const isAttributeRe = /^attr--/i;
const isEventHandlerRe = /^on/;

class HtmlResultHandler implements IResultHandler<Node> {
	private v: TVirtual<Node>[] | undefined;
	constructor(private root: Element) {}
	getRoot(): Node {
		return this.root;
	}
	getVirtuals(): TVirtual<Node>[] | undefined {
		return this.v;
	}
	setVirtuals(v: TVirtual<Node>[] | undefined): void {
		this.v = v;
	}
	add(p: IResultHandlerAddParams<Node>): Node | undefined {
		// console.log(`[qqdewl] add:`, parent, i, v)
		let result;
		const doc = p.parent.ownerDocument ?? (p.parent as Document);
		if (p.virtual instanceof VElement) {
			if (p.virtual.name === "svg" || p.parent instanceof SVGElement) {
				result = doc.createElementNS(
					"http://www.w3.org/2000/svg",
					p.virtual.name
				);
			} else {
				result = doc.createElement(p.virtual.name);
			}
			setProps(result, p.virtual, undefined);
			if (p.virtual.trusted != null) {
				result.innerHTML = p.virtual.trusted;
			}
		} else {
			result = doc.createTextNode(p.virtual.text);
		}
		if (p.index >= p.parent.childNodes.length) {
			p.parent.appendChild(result);
		} else {
			p.parent.insertBefore(result, p.parent.childNodes[p.index]);
		}
		return result;
	}
	move(p: IResultHandlerMoveParams<Node>): void {
		if (p.index >= p.parent.childNodes.length) {
			p.parent.appendChild(p.result);
		} else {
			p.parent.insertBefore(p.result, p.parent.childNodes[p.index]);
		}
	}
	update(p: IResultHandlerUpdateParams<Node>): Node | undefined {
		// console.log(`[qqdexa] update:`, result, v, oldV)
		if (p.virtual instanceof VElement) {
			for (let name of Object.keys((p.oldVirtual as VElement).props)) {
				if (!(name in p.virtual.props)) {
					if (name === "class") {
						(p.result as Element).className = "";
					} else if (name === "style") {
						(p.result as Element).removeAttribute("style");
					} else if (isDataRe.test(name)) {
						delete (p.result as HTMLElement).dataset[
							dataNameToDatasetName(name)
						];
					} else {
						(p.result as any)[name] = "";
					}
				}
			}
			setProps(p.result, p.virtual, p.oldVirtual as VElement);
			if ((p.oldVirtual as VElement).trusted !== p.virtual.trusted) {
				(p.result as Element).innerHTML = p.virtual.trusted;
			}
		} else {
			if (p.virtual.text !== (p.oldVirtual as VText).text) {
				p.result.textContent = p.virtual.text;
			}
		}
		return p.result;
	}
	remove(p: IResultHandlerRemoveParams<Node>): void {
		// console.log(`[qqdexw] remove:`, parent, i, result, v)
		if (p.virtual instanceof VElement) {
			for (const prop of Object.keys(p.virtual.props)) {
				if (isEventHandlerRe.test(prop)) {
					(p.result as any)[prop] = null;
				}
			}
		}
		if (!p.parentIsBeingRemoved) {
			p.parent.removeChild(p.result);
		}
	}
}

function setProps(result: Node, v: VElement, oldV: VElement | undefined) {
	for (let [name, value] of Object.entries(v.props)) {
		if (oldV && value === oldV.props[name]) continue;
		if (result instanceof HTMLElement) {
			switch (name) {
				case "class":
					(result as Element).className = value ?? "";
					break;
				case "for":
					(result as HTMLLabelElement).htmlFor = value ?? "";
					break;
				case "tabindex":
					(result as HTMLInputElement).tabIndex = value ?? "";
					break;
				case "style":
					(result as Element).setAttribute(name, value ?? "");
					break;
				default:
					if (isDataRe.test(name)) {
						result.dataset[dataNameToDatasetName(name)] = value ?? "";
					} else if (isAttributeRe.test(name)) {
						result.setAttribute(name.replace(isAttributeRe, ""), value ?? "");
					} else {
						(result as any)[name] = value ?? "";
					}
			}
		} else if (result instanceof SVGElement) {
			if (isEventHandlerRe.test(name)) {
				(result as any)[name] = value ?? "";
			} else {
				(result as SVGElement).setAttribute(name, value ?? "");
			}
		} else {
			if (isAttributeRe.test(name)) {
				(result as Element).setAttribute(
					name.replace(isAttributeRe, ""),
					value ?? ""
				);
			} else {
				(result as any)[name] = value ?? "";
			}
		}
	}
}

function dataNameToDatasetName(s: string) {
	return s.slice(5).replace(/-([a-z])/gi, (_, c: string) => c.toUpperCase());
}

const handlers: [HtmlResultHandler, TRender | TRenderJSX][] = [];

export function mount(element: Element, virtuals: TRender | TRenderJSX) {
	const index = handlers.findIndex((e) => e[0].getRoot() === element);
	if (index >= 0) {
		throw new Error(`[qzj84x] Root already mounted.`);
	} else {
		handlers.push([new HtmlResultHandler(element), virtuals]);
	}
	element.innerHTML = "";
}

export function unmount(element: Element) {
	const index = handlers.findIndex((e) => e[0].getRoot() === element);
	if (index < 0) throw new Error(`[qqf154] Unknown root.`);
	handlers.splice(index, 1);
}

let renderRunning = false;
let renderQueued: Promise<void> | undefined = undefined;
export function render(): Promise<void> {
	if (renderQueued) {
		if (getIsLogging()) {
			console.groupCollapsed(`[qz65l6] ::: Render merged.`);
			console.trace();
			console.groupEnd();
		}
		return renderQueued;
	} else {
		return (renderQueued = new Promise<void>((resolve, reject) => {
			requestAnimationFrame(() => {
				renderQueued = undefined;

				if (renderRunning) {
					reject(new Error(`[qz65l9] Render in render not supported!`));
					return;
				}

				renderRunning = true;

				if (getIsLogging()) {
					console.groupCollapsed(`[qz65lc] ►►► Render.`);
					console.trace();
					console.groupEnd();
				}
				const start = Date.now();

				for (const [handler, comp] of handlers) {
					applyHandler(handler, [m(comp, {})]);
				}

				if (getIsLogging()) {
					console.log(`[qz65lf] ••• Rendered in ${Date.now() - start} ms.`);
				}

				renderRunning = false;
				resolve();
			});
		}));
	}
}
