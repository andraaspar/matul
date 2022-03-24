(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["matul"] = factory();
	else
		root["matul"] = factory();
})(self, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "FragmentComp": function() { return /* reexport */ FragmentComp; },
  "Spread": function() { return /* reexport */ Spread; },
  "VComponent": function() { return /* reexport */ VComponent; },
  "VElement": function() { return /* reexport */ VElement; },
  "VPlaceholder": function() { return /* reexport */ VPlaceholder; },
  "VText": function() { return /* reexport */ VText; },
  "applyHandler": function() { return /* reexport */ applyHandler; },
  "createElement": function() { return /* reexport */ createElement; },
  "getIsLogging": function() { return /* reexport */ getIsLogging; },
  "m": function() { return /* reexport */ m; },
  "setIsLogging": function() { return /* reexport */ setIsLogging; }
});

;// CONCATENATED MODULE: ./src/comp/FragmentComp.ts
var FragmentComp = function (_, v) {
    return v.children;
};

;// CONCATENATED MODULE: ./src/model/Spread.ts
/**
 * @babel/preset-react does not allow spreading children. This is a workaround.
 */
var Spread = /** @class */ (function () {
    function Spread(items) {
        this.items = items;
    }
    return Spread;
}());


;// CONCATENATED MODULE: ./src/model/VElement.ts
var VElement = /** @class */ (function () {
    function VElement(name, props, children, trusted) {
        this.name = name;
        this.props = props;
        this.children = children;
        this.trusted = trusted;
    }
    return VElement;
}());


;// CONCATENATED MODULE: ./src/model/VText.ts
var VText = /** @class */ (function () {
    function VText(text) {
        this.text = text;
    }
    return VText;
}());


;// CONCATENATED MODULE: ./src/model/VList.ts



var VList = /** @class */ (function () {
    function VList(items) {
        this.items = items;
        this.itemByKey = new Map();
        this.count = 0;
        var expectedKeyCount = items.length;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
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
            throw new Error("[qqf32k] Duplicate / missing keys in list: actual count = " + this.itemByKey.size + " < expected count = " + expectedKeyCount);
        }
    }
    VList.prototype.calculateCount = function () {
        this.count = 0;
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item instanceof VList || item instanceof VComponent) {
                this.count += item.count;
            }
            else if (item instanceof VElement || item instanceof VText) {
                this.count++;
            }
        }
    };
    return VList;
}());


;// CONCATENATED MODULE: ./src/model/VPlaceholder.ts
var VPlaceholder = /** @class */ (function () {
    function VPlaceholder(value) {
        this.value = value;
    }
    return VPlaceholder;
}());


;// CONCATENATED MODULE: ./src/fun/wrapVirtuals.ts






function wrapVirtuals(children) {
    var result = [];
    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
        var child = children_1[_i];
        if (child instanceof VList ||
            child instanceof VComponent ||
            child instanceof VElement ||
            child instanceof VText ||
            child instanceof VPlaceholder) {
            result.push(child);
        }
        else if (child instanceof Spread) {
            for (var _a = 0, _b = wrapVirtuals(child.items); _a < _b.length; _a++) {
                var spreadChild = _b[_a];
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


var VComponent = /** @class */ (function () {
    function VComponent(renderInternal, props, children) {
        this.renderInternal = renderInternal;
        this.props = props;
        this.children = children;
        this.count = 0;
        this.state = {};
        this.internal = {
            props: props,
            state: this.state,
            children: children,
        };
    }
    VComponent.prototype.render = function () {
        this.renderedVirtual = this.renderInternal(undefined /* props is here for JSX only */, this.internal);
        if (!Array.isArray(this.renderedVirtual)) {
            // JSX
            this.renderedVirtual = this.renderedVirtual ? [this.renderedVirtual] : [];
        }
        this.renderedVirtual = wrapVirtuals(this.renderedVirtual);
    };
    VComponent.prototype.updateCount = function () {
        this.count = 0;
        for (var _i = 0, _a = this.renderedVirtual; _i < _a.length; _i++) {
            var virtual = _a[_i];
            if (virtual instanceof VList || virtual instanceof VComponent) {
                this.count += virtual.count;
            }
            else {
                this.count++;
            }
        }
    };
    return VComponent;
}());


;// CONCATENATED MODULE: ./src/fun/addVirtual.ts





function addVirtual(_a) {
    var handler = _a.handler, parent = _a.parent, index = _a.index, virtual = _a.virtual;
    if (virtual instanceof VList) {
        for (var i = 0; i < virtual.items.length; i++) {
            index = addVirtual({ handler: handler, parent: parent, index: index, virtual: virtual.items[i] });
        }
    }
    else if (virtual instanceof VComponent) {
        index = applyHandlerToChildren({
            handler: handler,
            parent: parent,
            index: index,
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
        virtual.result = handler.add({ parent: parent, index: index, virtual: virtual });
        index++;
        if (virtual.trusted == null) {
            applyHandlerToChildren({
                parent: virtual.result,
                handler: handler,
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
        virtual.result = handler.add({ parent: parent, index: index, virtual: virtual });
        index++;
    }
    return index;
}

;// CONCATENATED MODULE: ./src/fun/removeVirtual.ts





function removeVirtual(_a) {
    var handler = _a.handler, parent = _a.parent, index = _a.index, virtual = _a.virtual, parentIsBeingRemoved = _a.parentIsBeingRemoved;
    if (virtual instanceof VList) {
        for (var i = 0; i < virtual.items.length; i++) {
            removeVirtual({
                handler: handler,
                parent: parent,
                index: index,
                virtual: virtual.items[i],
                parentIsBeingRemoved: parentIsBeingRemoved,
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
            handler: handler,
            parent: parent,
            index: index,
            virtuals: undefined,
            oldVirtuals: virtual.renderedVirtual,
            parentIsBeingRemoved: parentIsBeingRemoved,
        });
        virtual.internal.isRemoved = true;
    }
    else if (virtual instanceof VElement) {
        applyHandlerToChildren({
            handler: handler,
            parent: virtual.result,
            index: 0,
            virtuals: undefined,
            oldVirtuals: virtual.children,
            parentIsBeingRemoved: true,
        });
        handler.remove({
            parent: parent,
            index: index,
            result: virtual.result,
            virtual: virtual,
            parentIsBeingRemoved: parentIsBeingRemoved,
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
            parent: parent,
            index: index,
            result: virtual.result,
            virtual: virtual,
            parentIsBeingRemoved: parentIsBeingRemoved,
        });
    }
}

;// CONCATENATED MODULE: ./src/model/logging.ts
var isLogging = true;
function setIsLogging(flag) {
    isLogging = flag;
}
function getIsLogging() {
    return isLogging;
}

;// CONCATENATED MODULE: ./src/fun/getDeepIndex.ts


function getDeepIndex(index, items, item) {
    for (var i = 0; i < items.length; i++) {
        var currentItem = items[i];
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
    throw new Error("[qyswku] Deep index not found.");
}

;// CONCATENATED MODULE: ./src/fun/moveVirtual.ts




function moveVirtual(_a) {
    var handler = _a.handler, parent = _a.parent, index = _a.index, oldIndex = _a.oldIndex, virtual = _a.virtual;
    if (virtual instanceof VList) {
        for (var i = 0; i < virtual.items.length; i++) {
            var r = moveVirtual({
                handler: handler,
                parent: parent,
                index: index,
                oldIndex: oldIndex + i,
                virtual: virtual.items[i],
            });
            index = r.index;
            oldIndex = r.oldIndex;
        }
    }
    else if (virtual instanceof VComponent) {
        for (var i = 0; i < virtual.renderedVirtual.length; i++) {
            var r = moveVirtual({
                handler: handler,
                parent: parent,
                index: index,
                oldIndex: oldIndex,
                virtual: virtual.renderedVirtual[i],
            });
            index = r.index;
            oldIndex = r.oldIndex;
        }
    }
    else if (virtual instanceof VElement || virtual instanceof VText) {
        if (index !== oldIndex) {
            handler.move({
                parent: parent,
                oldIndex: oldIndex,
                index: index,
                result: virtual.result,
                virtual: virtual,
            });
        }
        // console.warn(
        // 	`[qyt2r1] moveVirtual ${
        // 		virtual.name
        // 	} oldIndex: ${oldIndex} → index: ${index} :: oldIndex: ${
        // 		index <= oldIndex ? oldIndex + 1 : oldIndex
        // 	} → index: ${index + 1}`,
        // )
        if (index <= oldIndex) {
            oldIndex++;
        }
        index++;
    }
    return { index: index, oldIndex: oldIndex };
}

;// CONCATENATED MODULE: ./src/fun/updateVirtual.ts










function updateVirtual(_a) {
    var handler = _a.handler, parent = _a.parent, index = _a.index, virtual = _a.virtual, oldVirtual = _a.oldVirtual;
    var localIndex = index;
    if (virtual instanceof VList) {
        var oldVirtualAsList = oldVirtual;
        if (virtual.itemByKey.size && oldVirtualAsList.itemByKey.size) {
            // Remove excess items
            var currentItems = [];
            for (var i = 0; i < oldVirtualAsList.items.length; i++) {
                var oldItem = oldVirtualAsList.items[i];
                if (oldItem instanceof VComponent || oldItem instanceof VElement) {
                    var newItem = virtual.itemByKey.get(oldItem.key);
                    if (newItem) {
                        localIndex = updateVirtual({
                            handler: handler,
                            parent: parent,
                            index: localIndex,
                            virtual: newItem,
                            oldVirtual: oldItem,
                        });
                        currentItems.push(newItem);
                    }
                    else {
                        removeVirtual({
                            handler: handler,
                            parent: parent,
                            index: localIndex,
                            virtual: oldVirtualAsList.items[i],
                            parentIsBeingRemoved: false,
                        });
                    }
                }
            }
            // Add new items
            for (var i = 0; i < virtual.items.length; i++) {
                var item = virtual.items[i];
                if (item instanceof VComponent || item instanceof VElement) {
                    var oldItem = oldVirtualAsList.itemByKey.get(item.key);
                    if (!oldItem) {
                        localIndex = addVirtual({
                            handler: handler,
                            parent: parent,
                            index: localIndex,
                            virtual: item,
                        });
                        currentItems.push(item);
                    }
                }
                else {
                    if (getIsLogging()) {
                        console.warn("[qysuqc] Invalid list item!", virtual.items, i, item);
                    }
                }
            }
            // Move remaining items
            var changed = true;
            while (changed) {
                changed = false;
                for (var i = 0; i < currentItems.length - 1; i++) {
                    var a = currentItems[i];
                    var b = currentItems[i + 1];
                    var aIndex = virtual.items.indexOf(a);
                    var bIndex = virtual.items.indexOf(b);
                    if (aIndex - bIndex > 0) {
                        var newIndex = getDeepIndex(index, currentItems, a);
                        var oldIndex = newIndex + (a instanceof VComponent ? a.count : 1);
                        moveVirtual({
                            handler: handler,
                            parent: parent,
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
                    console.warn("[qyt810] List without a key!", virtual);
                }
            }
            localIndex = applyHandlerToChildren({
                handler: handler,
                parent: parent,
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
            handler: handler,
            parent: parent,
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
            virtual: virtual,
            oldVirtual: oldVirtual,
        });
        localIndex++;
        applyHandlerToChildren({
            handler: handler,
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
            virtual: virtual,
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




function applyHandlerToChildren(_a) {
    var handler = _a.handler, parent = _a.parent, index = _a.index, virtuals = _a.virtuals, oldVirtuals = _a.oldVirtuals, parentIsBeingRemoved = _a.parentIsBeingRemoved;
    // try {
    if (virtuals) {
        if (oldVirtuals) {
            for (var i = virtuals.length; i < oldVirtuals.length; i++) {
                // console.warn(`[qyst2q] Losing children!`, oldVirtuals, virtuals)
                removeVirtual({
                    handler: handler,
                    parent: parent,
                    index: index,
                    virtual: oldVirtuals[i],
                    parentIsBeingRemoved: parentIsBeingRemoved,
                });
            }
            for (var i = 0; i < virtuals.length; i++) {
                var virtual = virtuals[i];
                var oldVirtual = oldVirtuals[i];
                if (virtualTypesMatch(virtual, oldVirtual)) {
                    index = updateVirtual({
                        handler: handler,
                        parent: parent,
                        index: index,
                        virtual: virtual,
                        oldVirtual: oldVirtual,
                    });
                }
                else {
                    if (oldVirtual) {
                        removeVirtual({
                            handler: handler,
                            parent: parent,
                            index: index,
                            virtual: oldVirtual,
                            parentIsBeingRemoved: false,
                        });
                    } /*  else {
                        console.warn(`[qyst5k] Gaining children!`, oldVirtual, virtual)
                    } */
                    index = addVirtual({
                        handler: handler,
                        parent: parent,
                        index: index,
                        virtual: virtual,
                    });
                }
            }
        }
        else {
            for (var i = 0; i < virtuals.length; i++) {
                index = addVirtual({ handler: handler, parent: parent, index: index, virtual: virtuals[i] });
            }
        }
    }
    else {
        if (oldVirtuals) {
            for (var i = 0; i < oldVirtuals.length; i++) {
                removeVirtual({
                    handler: handler,
                    parent: parent,
                    index: index,
                    virtual: oldVirtuals[i],
                    parentIsBeingRemoved: parentIsBeingRemoved,
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
    var _a, _b, _c, _d;
    if (virtual instanceof VList) {
        var oldVirtualAsList = oldVirtual;
        if (oldVirtualAsList &&
            virtual.itemByKey.size &&
            oldVirtualAsList.itemByKey.size) {
            for (var i = 0; i < virtual.items.length; i++) {
                var item = virtual.items[i];
                if (item instanceof VComponent || item instanceof VElement) {
                    var oldItem = oldVirtualAsList.itemByKey.get(item.key);
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
            renderComponents(virtual.items, (_a = oldVirtual) === null || _a === void 0 ? void 0 : _a.items);
        }
        virtual.calculateCount();
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
            renderComponents(virtual.renderedVirtual, (_b = oldVirtual) === null || _b === void 0 ? void 0 : _b.renderedVirtual);
        }
        catch (e) {
            if (virtual.internal.onerror) {
                try {
                    virtual.internal.onerror(e);
                    virtual.render();
                    renderComponents(virtual.renderedVirtual, (_c = oldVirtual) === null || _c === void 0 ? void 0 : _c.renderedVirtual);
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
        renderComponents(virtual.children, (_d = oldVirtual) === null || _d === void 0 ? void 0 : _d.children);
    }
}

;// CONCATENATED MODULE: ./src/fun/renderComponents.ts


function renderComponents(virtuals, oldVirtuals) {
    if (virtuals) {
        if (oldVirtuals) {
            for (var i = 0; i < virtuals.length; i++) {
                var virtual = virtuals[i];
                var oldVirtual = oldVirtuals[i];
                if (virtualTypesMatch(virtual, oldVirtual)) {
                    renderComponent(virtual, oldVirtual);
                }
                else {
                    renderComponent(virtual, undefined);
                }
            }
        }
        else {
            for (var i = 0; i < virtuals.length; i++) {
                renderComponent(virtuals[i], undefined);
            }
        }
    }
}

;// CONCATENATED MODULE: ./src/fun/applyHandler.ts



function applyHandler(handler, virtuals) {
    var virtualsWrapped = virtuals ? wrapVirtuals(virtuals) : undefined;
    var oldVirtuals = handler.getVirtuals();
    if (virtualsWrapped)
        renderComponents(virtualsWrapped, oldVirtuals);
    applyHandlerToChildren({
        handler: handler,
        parent: handler.getRoot(),
        index: 0,
        virtuals: virtualsWrapped,
        oldVirtuals: oldVirtuals,
        parentIsBeingRemoved: false,
    });
    handler.setVirtuals(virtualsWrapped);
}

;// CONCATENATED MODULE: ./src/fun/m.ts



function m(nameOrComp, propsOrChildren, children) {
    var props = Array.isArray(propsOrChildren) ? {} : propsOrChildren || {};
    var actualChildren = Array.isArray(propsOrChildren)
        ? propsOrChildren
        : children || [];
    var childrenWrapped = actualChildren
        ? wrapVirtuals(Array.isArray(actualChildren) // JSX does not need an []
            ? actualChildren
            : [actualChildren])
        : [];
    if (typeof nameOrComp === "function") {
        var key = props.key;
        var debug = props.debug;
        delete props.key;
        delete props.debug;
        var result = new VComponent(nameOrComp, props, childrenWrapped);
        result.key = key;
        result.debug = debug;
        return result;
    }
    else {
        var key = props.key;
        var ref = props.ref;
        var debug = props.debug;
        var trust = props.__UNSAFE_trust__;
        delete props.key;
        delete props.ref;
        delete props.debug;
        delete props.__UNSAFE_trust__;
        var result = new VElement(nameOrComp, props, childrenWrapped, trust);
        result.key = key;
        result.ref = ref;
        result.debug = debug;
        return result;
    }
}

;// CONCATENATED MODULE: ./src/fun/createElement.ts

function createElement(type, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    return m(type, props, children);
}

;// CONCATENATED MODULE: ./src/core.ts











/******/ 	return __webpack_exports__;
/******/ })()
;
});