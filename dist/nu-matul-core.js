(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["matul"] = factory();
	else
		root["matul"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "FragmentComp": () => (/* reexport */ FragmentComp),
  "Spread": () => (/* reexport */ Spread),
  "VComponent": () => (/* reexport */ VComponent),
  "VElement": () => (/* reexport */ VElement),
  "VPlaceholder": () => (/* reexport */ VPlaceholder),
  "VText": () => (/* reexport */ VText),
  "applyHandler": () => (/* reexport */ applyHandler),
  "createElement": () => (/* reexport */ createElement),
  "getIsLogging": () => (/* reexport */ getIsLogging),
  "m": () => (/* reexport */ m),
  "setIsLogging": () => (/* reexport */ setIsLogging)
});

;// CONCATENATED MODULE: ./src/comp/FragmentComp.ts
const FragmentComp = (_, v) => {
    return v.children;
};

;// CONCATENATED MODULE: ./src/model/Spread.ts
/**
 * @babel/preset-react does not allow spreading children. This is a workaround.
 */
class Spread {
    constructor(items) {
        this.items = items;
    }
}

;// CONCATENATED MODULE: ./src/model/VElement.ts
class VElement {
    constructor(name, props, children, trusted) {
        this.name = name;
        this.props = props;
        this.children = children;
        this.trusted = trusted;
    }
}

;// CONCATENATED MODULE: ./src/model/VText.ts
class VText {
    constructor(text) {
        this.text = text;
    }
}

;// CONCATENATED MODULE: ./src/model/VList.ts



class VList {
    constructor(items) {
        this.items = items;
        this.itemByKey = new Map();
        this.count = 0;
        let expectedKeyCount = items.length;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item instanceof VComponent || item instanceof VElement) {
                if (item.key != null) {
                    this.itemByKey.set(item.key, item);
                }
            }
            else if (item instanceof VText || item instanceof VList) {
                this.itemByKey.clear();
                break;
            }
            else {
                expectedKeyCount--;
            }
        }
        if (this.itemByKey.size && this.itemByKey.size < expectedKeyCount) {
            throw new Error(`[qqf32k] Duplicate / missing keys in list: actual count = ${this.itemByKey.size} < expected count = ${expectedKeyCount}`);
        }
    }
    updateCount() {
        this.count = 0;
        for (const item of this.items) {
            if (item instanceof VList || item instanceof VComponent) {
                this.count += item.count;
            }
            else if (item instanceof VElement || item instanceof VText) {
                this.count++;
            }
        }
    }
}

;// CONCATENATED MODULE: ./src/model/VPlaceholder.ts
class VPlaceholder {
    constructor(value) {
        this.value = value;
    }
}

;// CONCATENATED MODULE: ./src/fun/wrapVirtuals.ts






function wrapVirtuals(children) {
    const result = [];
    for (const child of children) {
        if (child instanceof VList ||
            child instanceof VComponent ||
            child instanceof VElement ||
            child instanceof VText ||
            child instanceof VPlaceholder) {
            result.push(child);
        }
        else if (child instanceof Spread) {
            for (const spreadChild of wrapVirtuals(child.items)) {
                result.push(spreadChild);
            }
        }
        else if (Array.isArray(child)) {
            result.push(new VList(wrapVirtuals(child)));
        }
        else if (["string", "number", "bigint"].includes(typeof child)) {
            result.push(new VText(child + ""));
        }
        else {
            result.push(new VPlaceholder(child));
        }
    }
    return result;
}

;// CONCATENATED MODULE: ./src/model/VComponent.ts




class VComponent {
    constructor(renderInternal, props, children) {
        this.renderInternal = renderInternal;
        this.props = props;
        this.children = children;
        this.count = 0;
        this.state = {};
        this.internal = {
            props,
            state: this.state,
            children,
        };
    }
    render() {
        this.renderedVirtual = this.renderInternal(undefined /* props is here for JSX only */, this.internal);
        if (!Array.isArray(this.renderedVirtual)) {
            // JSX
            this.renderedVirtual = this.renderedVirtual ? [this.renderedVirtual] : [];
        }
        this.renderedVirtual = wrapVirtuals(this.renderedVirtual);
    }
    updateCount() {
        this.count = 0;
        for (const virtual of this.renderedVirtual) {
            if (virtual instanceof VList || virtual instanceof VComponent) {
                this.count += virtual.count;
            }
            else if (virtual instanceof VElement || virtual instanceof VText) {
                this.count++;
            }
        }
    }
}

;// CONCATENATED MODULE: ./src/fun/addVirtual.ts





function addVirtual({ handler, parent, index, virtual, }) {
    if (virtual instanceof VList) {
        for (let i = 0; i < virtual.items.length; i++) {
            index = addVirtual({ handler, parent, index, virtual: virtual.items[i] });
        }
    }
    else if (virtual instanceof VComponent) {
        index = applyHandlerToChildren({
            handler,
            parent,
            index,
            virtuals: virtual.renderedVirtual,
            oldVirtuals: undefined,
            parentIsBeingRemoved: false,
        });
        if (virtual.internal.onadded) {
            try {
                virtual.internal.onadded();
            }
            catch (e) {
                console.error(e);
            }
        }
        if (virtual.internal.onupdated) {
            try {
                virtual.internal.onupdated(true);
            }
            catch (e) {
                console.error(e);
            }
        }
    }
    else if (virtual instanceof VElement) {
        virtual.result = handler.add({ parent, index, virtual });
        index++;
        if (virtual.trusted == null) {
            applyHandlerToChildren({
                parent: virtual.result,
                handler,
                index: 0,
                virtuals: virtual.children,
                oldVirtuals: undefined,
                parentIsBeingRemoved: false,
            });
        }
        if (virtual.ref) {
            try {
                virtual.ref(virtual.result);
            }
            catch (e) {
                console.error(e);
            }
        }
    }
    else if (virtual instanceof VText) {
        virtual.result = handler.add({ parent, index, virtual });
        index++;
    }
    return index;
}

;// CONCATENATED MODULE: ./src/fun/removeVirtual.ts





function removeVirtual({ handler, parent, index, virtual, parentIsBeingRemoved, }) {
    if (virtual instanceof VList) {
        for (let i = 0; i < virtual.items.length; i++) {
            removeVirtual({
                handler,
                parent,
                index,
                virtual: virtual.items[i],
                parentIsBeingRemoved,
            });
        }
    }
    else if (virtual instanceof VComponent) {
        if (virtual.internal.onremove) {
            try {
                virtual.internal.onremove();
            }
            catch (e) {
                console.error(e);
            }
        }
        applyHandlerToChildren({
            handler,
            parent,
            index,
            virtuals: undefined,
            oldVirtuals: virtual.renderedVirtual,
            parentIsBeingRemoved,
        });
        virtual.internal.isRemoved = true;
    }
    else if (virtual instanceof VElement) {
        applyHandlerToChildren({
            handler,
            parent: virtual.result,
            index: 0,
            virtuals: undefined,
            oldVirtuals: virtual.children,
            parentIsBeingRemoved: true,
        });
        handler.remove({
            parent,
            index,
            result: virtual.result,
            virtual,
            parentIsBeingRemoved,
        });
        if (virtual.ref) {
            try {
                virtual.ref(undefined);
            }
            catch (e) {
                console.error(e);
            }
        }
    }
    else if (virtual instanceof VText) {
        handler.remove({
            parent,
            index,
            result: virtual.result,
            virtual,
            parentIsBeingRemoved,
        });
    }
}

;// CONCATENATED MODULE: ./src/model/logging.ts
let isLogging = true;
function setIsLogging(flag) {
    isLogging = flag;
}
function getIsLogging() {
    return isLogging;
}

;// CONCATENATED MODULE: ./src/fun/getDeepIndex.ts


function getDeepIndex(index, items, item) {
    for (let i = 0; i < items.length; i++) {
        const currentItem = items[i];
        if (currentItem === item) {
            return index;
        }
        else if (currentItem instanceof VList ||
            currentItem instanceof VComponent) {
            index += currentItem.count;
        }
        else {
            index++;
        }
    }
    throw new Error(`[qyswku] Deep index not found.`);
}

;// CONCATENATED MODULE: ./src/fun/moveVirtual.ts




function moveVirtual({ handler, parent, index, oldIndex, virtual, }) {
    if (virtual instanceof VList) {
        for (let i = 0; i < virtual.items.length; i++) {
            const r = moveVirtual({
                handler,
                parent,
                index,
                oldIndex,
                virtual: virtual.items[i],
            });
            index = r.index;
            oldIndex = r.oldIndex;
        }
    }
    else if (virtual instanceof VComponent) {
        for (let i = 0; i < virtual.renderedVirtual.length; i++) {
            const r = moveVirtual({
                handler,
                parent,
                index,
                oldIndex,
                virtual: virtual.renderedVirtual[i],
            });
            index = r.index;
            oldIndex = r.oldIndex;
        }
    }
    else if (virtual instanceof VElement || virtual instanceof VText) {
        if (index !== oldIndex) {
            handler.move({
                parent,
                oldIndex,
                index,
                result: virtual.result,
                virtual,
            });
        }
        // console.warn(
        // 	`[qyt2r1] moveVirtual ${
        // 		virtual.name
        // 	} oldIndex: ${oldIndex} ??? index: ${index} :: oldIndex: ${
        // 		index <= oldIndex ? oldIndex + 1 : oldIndex
        // 	} ??? index: ${index + 1}`,
        // )
        if (index <= oldIndex) {
            oldIndex++;
        }
        index++;
    }
    return { index, oldIndex };
}

;// CONCATENATED MODULE: ./src/fun/updateVirtual.ts










function updateVirtual({ handler, parent, index, virtual, oldVirtual, }) {
    let localIndex = index;
    if (virtual instanceof VList) {
        const oldVirtualAsList = oldVirtual;
        if (virtual.itemByKey.size && oldVirtualAsList.itemByKey.size) {
            // Remove excess items
            const currentItems = [];
            for (let i = 0; i < oldVirtualAsList.items.length; i++) {
                const oldItem = oldVirtualAsList.items[i];
                if (oldItem instanceof VComponent || oldItem instanceof VElement) {
                    const newItem = virtual.itemByKey.get(oldItem.key);
                    if (newItem) {
                        localIndex = updateVirtual({
                            handler,
                            parent,
                            index: localIndex,
                            virtual: newItem,
                            oldVirtual: oldItem,
                        });
                        currentItems.push(newItem);
                    }
                    else {
                        removeVirtual({
                            handler,
                            parent,
                            index: localIndex,
                            virtual: oldVirtualAsList.items[i],
                            parentIsBeingRemoved: false,
                        });
                    }
                }
            }
            // Add new items
            for (let i = 0; i < virtual.items.length; i++) {
                const item = virtual.items[i];
                if (item instanceof VComponent || item instanceof VElement) {
                    const oldItem = oldVirtualAsList.itemByKey.get(item.key);
                    if (!oldItem) {
                        localIndex = addVirtual({
                            handler,
                            parent,
                            index: localIndex,
                            virtual: item,
                        });
                        currentItems.push(item);
                    }
                }
                else {
                    if (getIsLogging()) {
                        console.warn(`[qysuqc] Invalid list item!`, virtual.items, i, item);
                    }
                }
            }
            // Move remaining items
            let changed = true;
            while (changed) {
                changed = false;
                for (let i = 0; i < currentItems.length - 1; i++) {
                    const a = currentItems[i];
                    const b = currentItems[i + 1];
                    let aIndex = virtual.items.indexOf(a);
                    let bIndex = virtual.items.indexOf(b);
                    if (aIndex - bIndex > 0) {
                        const newIndex = getDeepIndex(index, currentItems, a);
                        const oldIndex = newIndex + (a instanceof VComponent ? a.count : 1);
                        moveVirtual({
                            handler,
                            parent,
                            index: newIndex,
                            oldIndex: oldIndex,
                            virtual: b,
                        });
                        currentItems[i] = b;
                        currentItems[i + 1] = a;
                        changed = true;
                    }
                }
            }
        }
        else {
            if (getIsLogging()) {
                if (virtual.items.length && oldVirtualAsList.items.length) {
                    console.warn(`[qyt810] List without a key!`, virtual);
                }
            }
            localIndex = applyHandlerToChildren({
                handler,
                parent,
                index: localIndex,
                virtuals: virtual.items,
                oldVirtuals: oldVirtualAsList.items,
                parentIsBeingRemoved: false,
            });
        }
    }
    else if (virtual instanceof VComponent) {
        // There is no need to distinguish between renderInternals here because that
        // is done in renderComponent. Here we only deal with the renderedVirtual.
        localIndex = applyHandlerToChildren({
            handler,
            parent,
            index: localIndex,
            virtuals: virtual.renderedVirtual,
            oldVirtuals: oldVirtual.renderedVirtual,
            parentIsBeingRemoved: false,
        });
        if (virtual.internal.onupdated) {
            try {
                virtual.internal.onupdated(false);
            }
            catch (e) {
                console.error(e);
            }
        }
    }
    else if (virtual instanceof VElement) {
        virtual.debug = oldVirtual.debug;
        if (virtual.debug != null && --virtual.debug <= 0) {
            debugger;
        }
        virtual.result = oldVirtual.result;
        handler.update({
            result: virtual.result,
            virtual,
            oldVirtual: oldVirtual,
        });
        localIndex++;
        applyHandlerToChildren({
            handler,
            parent: virtual.result,
            index: 0,
            virtuals: virtual.children,
            oldVirtuals: oldVirtual.children,
            parentIsBeingRemoved: false,
        });
    }
    else if (virtual instanceof VText) {
        virtual.result = oldVirtual.result;
        handler.update({
            result: virtual.result,
            virtual,
            oldVirtual: oldVirtual,
        });
        localIndex++;
    }
    return localIndex;
}

;// CONCATENATED MODULE: ./src/fun/virtualTypesMatch.ts




function virtualTypesMatch(a, b) {
    return ((a instanceof VList && b instanceof VList) ||
        (a instanceof VComponent &&
            b instanceof VComponent &&
            a.renderInternal === b.renderInternal) ||
        (a instanceof VElement &&
            b instanceof VElement &&
            a.name === b.name &&
            a.trusted === b.trusted) ||
        (a instanceof VText && b instanceof VText));
}

;// CONCATENATED MODULE: ./src/fun/applyHandlerToChildren.ts




function applyHandlerToChildren({ handler, parent, index, virtuals, oldVirtuals, parentIsBeingRemoved, }) {
    // try {
    if (virtuals) {
        if (oldVirtuals) {
            for (let i = virtuals.length; i < oldVirtuals.length; i++) {
                // console.warn(`[qyst2q] Losing children!`, oldVirtuals, virtuals)
                removeVirtual({
                    handler,
                    parent,
                    index,
                    virtual: oldVirtuals[i],
                    parentIsBeingRemoved,
                });
            }
            for (let i = 0; i < virtuals.length; i++) {
                const virtual = virtuals[i];
                const oldVirtual = oldVirtuals[i];
                if (virtualTypesMatch(virtual, oldVirtual)) {
                    index = updateVirtual({
                        handler,
                        parent,
                        index,
                        virtual,
                        oldVirtual,
                    });
                }
                else {
                    if (oldVirtual) {
                        removeVirtual({
                            handler,
                            parent,
                            index,
                            virtual: oldVirtual,
                            parentIsBeingRemoved: false,
                        });
                    } /*  else {
                        console.warn(`[qyst5k] Gaining children!`, oldVirtual, virtual)
                    } */
                    index = addVirtual({
                        handler,
                        parent,
                        index,
                        virtual,
                    });
                }
            }
        }
        else {
            for (let i = 0; i < virtuals.length; i++) {
                index = addVirtual({ handler, parent, index, virtual: virtuals[i] });
            }
        }
    }
    else {
        if (oldVirtuals) {
            for (let i = 0; i < oldVirtuals.length; i++) {
                removeVirtual({
                    handler,
                    parent,
                    index,
                    virtual: oldVirtuals[i],
                    parentIsBeingRemoved,
                });
            }
        }
    }
    return index;
    // } catch (e) {
    // 	console.error(`[r8um3b] Caught in:`, parent);
    // 	throw e;
    // }
}

;// CONCATENATED MODULE: ./src/fun/renderComponent.ts





function renderComponent(virtual, oldVirtual) {
    if (virtual instanceof VList) {
        const oldVirtualAsList = oldVirtual;
        if (oldVirtualAsList &&
            virtual.itemByKey.size &&
            oldVirtualAsList.itemByKey.size) {
            for (let i = 0; i < virtual.items.length; i++) {
                const item = virtual.items[i];
                if (item instanceof VComponent || item instanceof VElement) {
                    const oldItem = oldVirtualAsList.itemByKey.get(item.key);
                    if (oldItem && virtualTypesMatch(item, oldItem)) {
                        renderComponent(item, oldItem);
                    }
                    else {
                        renderComponent(item, undefined);
                    }
                }
            }
        }
        else {
            renderComponents(virtual.items, oldVirtual?.items);
        }
        virtual.updateCount();
    }
    else if (virtual instanceof VComponent) {
        if (oldVirtual instanceof VComponent) {
            virtual.debug = oldVirtual.debug;
            if (virtual.debug != null && --virtual.debug <= 0) {
                debugger;
            }
            virtual.internal = oldVirtual.internal;
            virtual.internal.props = virtual.props;
            virtual.state = virtual.internal.state;
            virtual.internal.children = virtual.children;
        }
        virtual.render();
        try {
            renderComponents(virtual.renderedVirtual, oldVirtual?.renderedVirtual);
        }
        catch (e) {
            if (virtual.internal.onerror) {
                try {
                    virtual.internal.onerror(e);
                    virtual.render();
                    renderComponents(virtual.renderedVirtual, oldVirtual?.renderedVirtual);
                }
                catch (e2) {
                    console.error(e2);
                    throw e;
                }
            }
            else {
                throw e;
            }
        }
        virtual.updateCount();
    }
    else if (virtual instanceof VElement) {
        renderComponents(virtual.children, oldVirtual?.children);
    }
}

;// CONCATENATED MODULE: ./src/fun/renderComponents.ts


function renderComponents(virtuals, oldVirtuals) {
    if (virtuals) {
        if (oldVirtuals) {
            for (let i = 0; i < virtuals.length; i++) {
                const virtual = virtuals[i];
                const oldVirtual = oldVirtuals[i];
                if (virtualTypesMatch(virtual, oldVirtual)) {
                    renderComponent(virtual, oldVirtual);
                }
                else {
                    renderComponent(virtual, undefined);
                }
            }
        }
        else {
            for (let i = 0; i < virtuals.length; i++) {
                renderComponent(virtuals[i], undefined);
            }
        }
    }
}

;// CONCATENATED MODULE: ./src/fun/applyHandler.ts



function applyHandler(handler, virtuals) {
    const virtualsWrapped = virtuals ? wrapVirtuals(virtuals) : undefined;
    const oldVirtuals = handler.getVirtuals();
    if (virtualsWrapped)
        renderComponents(virtualsWrapped, oldVirtuals);
    applyHandlerToChildren({
        handler,
        parent: handler.getRoot(),
        index: 0,
        virtuals: virtualsWrapped,
        oldVirtuals,
        parentIsBeingRemoved: false,
    });
    handler.setVirtuals(virtualsWrapped);
}

;// CONCATENATED MODULE: ./src/fun/m.ts



function m(nameOrComp, propsOrChildren, children) {
    const props = Array.isArray(propsOrChildren) ? {} : propsOrChildren || {};
    const actualChildren = Array.isArray(propsOrChildren)
        ? propsOrChildren
        : children || [];
    const childrenWrapped = actualChildren
        ? wrapVirtuals(Array.isArray(actualChildren) // JSX does not need an []
            ? actualChildren
            : [actualChildren])
        : [];
    if (typeof nameOrComp === "function") {
        const key = props.key;
        const debug = props.debug;
        delete props.key;
        delete props.debug;
        const result = new VComponent(nameOrComp, props, childrenWrapped);
        result.key = key;
        result.debug = debug;
        return result;
    }
    else {
        const key = props.key;
        const ref = props.ref;
        const debug = props.debug;
        const trust = props.__UNSAFE_trust__;
        delete props.key;
        delete props.ref;
        delete props.debug;
        delete props.__UNSAFE_trust__;
        const result = new VElement(nameOrComp, props, childrenWrapped, trust);
        result.key = key;
        result.ref = ref;
        result.debug = debug;
        return result;
    }
}

;// CONCATENATED MODULE: ./src/fun/createElement.ts

function createElement(type, props, ...children) {
    return m(type, props, children);
}

;// CONCATENATED MODULE: ./src/core.ts











/******/ 	return __webpack_exports__;
/******/ })()
;
});