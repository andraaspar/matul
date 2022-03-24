import { FragmentComp } from "../core";
import { MockElement, MockResultHandler } from "../handler/MockResultHandler";
import { Spread } from "../model/Spread";
import { TRender } from "../model/TRender";
import { TVirtualIn } from "../model/TVirtualIn";
import { VComponent } from "../model/VComponent";
import { VElement } from "../model/VElement";
import { applyHandler } from "./applyHandler";
import { m } from "./m";

test(`[qqj5po] Create element and text.`, () => {
	const v1 = ["string", m("empty")];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	expect(handler.getRoot().toString()).toBe(`<document>
	"string"
	<empty/>
</document>`);
});

test(`[qqj6i7] Create element with children.`, () => {
	const v1 = [m("with-children", [m("child-1"), m("child-2")])];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	expect(handler.getRoot().toString()).toBe(`<document>
	<with-children>
		<child-1/>
		<child-2/>
	</with-children>
</document>`);
});

test(`[qqj6jn] Create element with props.`, () => {
	const v1 = [
		m("with-props", {
			s: "string",
			n: 1,
			i: 1n,
			b: true,
		}),
		m("with-children-and-props", { b: true }, ["text", m("element")]),
	];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	expect(handler.getRoot().toString()).toBe(`<document>
	<with-props s="string" n="1" i="1" b="true"/>
	<with-children-and-props b="true">
		"text"
		<element/>
	</with-children-and-props>
</document>`);
});

test(`[qqj6d2] Create component.`, () => {
	const Comp = () => [m("comp")];
	const v1 = [m(Comp, {})];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	expect(handler.getRoot().toString()).toBe(`<document>
	<comp/>
</document>`);
});

test(`[qqj6ms] Create list.`, () => {
	const v1 = [[m("item-1"), m("item-2"), m("item-3")]];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	expect(handler.getRoot().toString()).toBe(`<document>
	<item-1/>
	<item-2/>
	<item-3/>
</document>`);
});

test(`[qqj6pv] Create keyed list.`, () => {
	const v1 = [
		[
			m("item-1", { key: "1" }),
			m("item-2", { key: "2" }),
			m("item-3", { key: "3" }),
		],
	];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	expect(handler.getRoot().toString()).toBe(`<document>
	<item-1/>
	<item-2/>
	<item-3/>
</document>`);
});

test(`[qqj6z7] Add element.`, () => {
	const v1 = [m("foo"), null, m("baz")];
	const v2 = [m("foo"), m("bar"), m("baz")];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	const [foo1, baz1] = handler.getRoot().children;
	expect(handler.getRoot().toString()).toBe(`<document>
	<foo/>
	<baz/>
</document>`);

	applyHandler(handler, v2);
	const [foo2, , baz2] = handler.getRoot().children;
	expect(handler.getRoot().toString()).toBe(`<document>
	<foo/>
	<bar/>
	<baz/>
</document>`);
	expect(foo1).toBe(foo2);
	expect(baz1).toBe(baz2);
});

test(`[qqh8jt] Remove element.`, () => {
	const v1 = [m("foo"), m("bar"), m("baz")];
	const v2 = [m("foo"), null, m("baz")];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	const [foo1, , baz1] = handler.getRoot().children;
	expect(handler.getRoot().toString()).toBe(`<document>
	<foo/>
	<bar/>
	<baz/>
</document>`);

	applyHandler(handler, v2);
	const [foo2, baz2] = handler.getRoot().children;
	expect(handler.getRoot().toString()).toBe(`<document>
	<foo/>
	<baz/>
</document>`);
	expect(foo1).toBe(foo2);
	expect(baz1).toBe(baz2);
});

test(`[qqj9as] Add list item.`, () => {
	const v1 = [
		[
			//
			m("item-a", { key: "a" }),
			m("item-c", { key: "c" }),
		],
	];
	const v2 = [
		[
			//
			m("item-a", { key: "a" }),
			m("item-b", { key: "b" }),
			m("item-c", { key: "c" }),
		],
	];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	const [itemA1, itemC1] = handler.getRoot().children;
	expect(handler.getRoot().toString()).toBe(`<document>
	<item-a/>
	<item-c/>
</document>`);

	applyHandler(handler, v2);
	const [itemA2, , itemC2] = handler.getRoot().children;
	expect(handler.getRoot().toString()).toBe(`<document>
	<item-a/>
	<item-b/>
	<item-c/>
</document>`);
	expect(itemA1).toBe(itemA2);
	expect(itemC1).toBe(itemC2);
});

test(`[qqjamw] Remove list item.`, () => {
	const v1 = [
		[
			//
			m("item-a", { key: "a" }),
			m("item-b", { key: "b" }),
			m("item-c", { key: "c" }),
		],
	];
	const v2 = [
		[
			//
			m("item-a", { key: "a" }),
			m("item-c", { key: "c" }),
		],
	];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	const [itemA1, , itemC1] = handler.getRoot().children;
	expect(handler.getRoot().toString()).toBe(`<document>
	<item-a/>
	<item-b/>
	<item-c/>
</document>`);

	applyHandler(handler, v2);
	const [itemA2, itemC2] = handler.getRoot().children;
	expect(handler.getRoot().toString()).toBe(`<document>
	<item-a/>
	<item-c/>
</document>`);
	expect(itemA1).toBe(itemA2);
	expect(itemC1).toBe(itemC2);
});

test(`[qqjaqy] Swap list items.`, () => {
	const v1 = [[m("item-a", { key: "a" }), m("item-b", { key: "b" })]];
	const v2 = [[m("item-b", { key: "b" }), m("item-a", { key: "a" })]];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	const [itemA1, itemB1] = handler.getRoot().children;
	expect(handler.getRoot().toString()).toBe(`<document>
	<item-a/>
	<item-b/>
</document>`);

	applyHandler(handler, v2);
	const [itemB2, itemA2] = handler.getRoot().children;
	expect(handler.getRoot().toString()).toBe(`<document>
	<item-b/>
	<item-a/>
</document>`);
	expect(itemA1).toBe(itemA2);
	expect(itemB1).toBe(itemB2);
});

test(`[qysv1u] Redraw list components.`, () => {
	const Comp: TRender<{ name: string }> = (_, v) => [
		m("div", [m("input", { value: v.props.name })]),
	];
	const v1 = [
		[
			//
			m(Comp, { key: "a", name: "a" }),
			m(Comp, { key: "b", name: "b" }),
		],
	];
	const v2 = [
		[
			//
			m(Comp, { key: "a", name: "c" }),
			m(Comp, { key: "b", name: "d" }),
		],
	];
	const handler = new MockResultHandler();
	expect(handler.getRoot().toString()).toBe(`<document/>`);
	expect(handler.addCallCount).toBe(0);
	expect(handler.removeCallCount).toBe(0);
	expect(handler.updateCallCount).toBe(0);
	expect(handler.moveCallCount).toBe(0);

	applyHandler(handler, v1);
	const [itemADiv1, itemBDiv1] = handler.getRoot().children;
	const itemAInput1 = (itemADiv1 as MockElement).children[0];
	const itemBInput1 = (itemADiv1 as MockElement).children[0];
	expect(handler.getRoot().toString()).toBe(`<document>
	<div>
		<input value="a"/>
	</div>
	<div>
		<input value="b"/>
	</div>
</document>`);
	expect(handler.addCallCount).toBe(4);
	expect(handler.removeCallCount).toBe(0);
	expect(handler.updateCallCount).toBe(0);
	expect(handler.moveCallCount).toBe(0);

	handler.resetCallCounts();
	expect(handler.addCallCount).toBe(0);
	expect(handler.removeCallCount).toBe(0);
	expect(handler.updateCallCount).toBe(0);
	expect(handler.moveCallCount).toBe(0);

	applyHandler(handler, v2);
	const [itemADiv2, itemBDiv2] = handler.getRoot().children;
	const itemAInput2 = (itemADiv2 as MockElement).children[0];
	const itemBInput2 = (itemADiv2 as MockElement).children[0];
	expect(handler.getRoot().toString()).toBe(`<document>
	<div>
		<input value="c"/>
	</div>
	<div>
		<input value="d"/>
	</div>
</document>`);
	expect(itemADiv1).toBe(itemADiv2);
	expect(itemAInput1).toBe(itemAInput2);
	expect(itemBDiv1).toBe(itemBDiv2);
	expect(itemBInput1).toBe(itemBInput2);
	expect(handler.addCallCount).toBe(0);
	expect(handler.removeCallCount).toBe(0);
	expect(handler.updateCallCount).toBe(4);
	expect(handler.moveCallCount).toBe(0);
});

test(`[qqjb7h] Add list component.`, () => {
	const Comp: TRender<{ name: string }> = (_, v) => [
		m(`comp-${v.props.name}-start`),
		m(`comp-${v.props.name}-end`),
	];
	const v1 = [
		[
			//
			m(Comp, { key: "a", name: "a" }),
			m(Comp, { key: "c", name: "c" }),
		],
	];
	const v2 = [
		[
			//
			m(Comp, { key: "a", name: "a" }),
			m(Comp, { key: "b", name: "b" }),
			m(Comp, { key: "c", name: "c" }),
		],
	];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	const [itemAStart1, itemAEnd1, itemCStart1, itemCEnd1] =
		handler.getRoot().children;
	expect(handler.getRoot().toString()).toBe(`<document>
	<comp-a-start/>
	<comp-a-end/>
	<comp-c-start/>
	<comp-c-end/>
</document>`);
	handler.resetCallCounts();

	applyHandler(handler, v2);
	const [itemAStart2, itemAEnd2, , , itemCStart2, itemCEnd2] =
		handler.getRoot().children;
	expect(handler.getRoot().toString()).toBe(`<document>
	<comp-a-start/>
	<comp-a-end/>
	<comp-b-start/>
	<comp-b-end/>
	<comp-c-start/>
	<comp-c-end/>
</document>`);
	expect(itemAStart1).toBe(itemAStart2);
	expect(itemAEnd1).toBe(itemAEnd2);
	expect(itemCStart1).toBe(itemCStart2);
	expect(itemCEnd1).toBe(itemCEnd2);
	expect(handler.addCallCount).toBe(2);
	expect(handler.removeCallCount).toBe(0);
	expect(handler.updateCallCount).toBe(4);
	expect(handler.moveCallCount).toBe(2);
});

test(`[qqjbip] Remove list component.`, () => {
	const Comp: TRender<{ name: string }> = (_, v) => [
		m(`comp-${v.props.name}-start`),
		m(`comp-${v.props.name}-end`),
	];
	const v1 = [
		[
			//
			m(Comp, { key: "a", name: "a" }),
			m(Comp, { key: "b", name: "b" }),
			m(Comp, { key: "c", name: "c" }),
		],
	];
	const v2 = [
		[
			//
			m(Comp, { key: "a", name: "a" }),
			m(Comp, { key: "c", name: "c" }),
		],
	];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	const [itemAStart1, itemAEnd1, , , itemCStart1, itemCEnd1] =
		handler.getRoot().children;
	expect(handler.getRoot().toString()).toBe(`<document>
	<comp-a-start/>
	<comp-a-end/>
	<comp-b-start/>
	<comp-b-end/>
	<comp-c-start/>
	<comp-c-end/>
</document>`);

	applyHandler(handler, v2);
	const [itemAStart2, itemAEnd2, itemCStart2, itemCEnd2] =
		handler.getRoot().children;
	expect(handler.getRoot().toString()).toBe(`<document>
	<comp-a-start/>
	<comp-a-end/>
	<comp-c-start/>
	<comp-c-end/>
</document>`);
	expect(itemAStart1).toBe(itemAStart2);
	expect(itemAEnd1).toBe(itemAEnd2);
	expect(itemCStart1).toBe(itemCStart2);
	expect(itemCEnd1).toBe(itemCEnd2);
});

test(`[qqjfkm] Swap list components.`, () => {
	const Comp: TRender<{ name: string }> = (_, v) => [
		m(`comp-${v.props.name}-start`),
		m(`comp-${v.props.name}-end`),
	];
	const v1 = [
		[
			//
			m(Comp, { key: "a", name: "a" }),
			m(Comp, { key: "b", name: "b" }),
		],
	];
	const v2 = [
		[
			//
			m(Comp, { key: "b", name: "b" }),
			m(Comp, { key: "a", name: "a" }),
		],
	];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	const [itemAStart1, itemAEnd1, itemBStart1, itemBEnd1] =
		handler.getRoot().children;
	expect(handler.getRoot().toString()).toBe(`<document>
	<comp-a-start/>
	<comp-a-end/>
	<comp-b-start/>
	<comp-b-end/>
</document>`);

	applyHandler(handler, v2);
	const [itemBStart2, itemBEnd2, itemAStart2, itemAEnd2] =
		handler.getRoot().children;
	expect(handler.getRoot().toString()).toBe(`<document>
	<comp-b-start/>
	<comp-b-end/>
	<comp-a-start/>
	<comp-a-end/>
</document>`);
	expect(itemAStart1).toBe(itemAStart2);
	expect(itemAEnd1).toBe(itemAEnd2);
	expect(itemBStart1).toBe(itemBStart2);
	expect(itemBEnd1).toBe(itemBEnd2);
});

test(`[qqkz64] Error thrown in Comp.`, () => {
	const Comp: TRender = () => {
		throw new Error(`[qqkz7a]`);
	};
	const v1 = [m("elem"), "text", m(Comp, {})];
	const handler = new MockResultHandler();
	expect(() => {
		applyHandler(handler, v1);
	}).toThrow("[qqkz7a]");
	expect(handler.getRoot().toString()).toBe(`<document/>`);
});

test(`[qql1rj] Render deep Comp.`, () => {
	const Comp: TRender<{ name: string }> = (_, v) => [
		m(`comp-${v.props.name}-start`),
		m(`comp-${v.props.name}-end`),
	];
	const v1 = [m("wrapper", [m(Comp, { name: "a" })])];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	expect(handler.getRoot().toString()).toBe(`<document>
	<wrapper>
		<comp-a-start/>
		<comp-a-end/>
	</wrapper>
</document>`);
});

test(`[qql3nt] Comp state to Comp prop passing & mutation.`, () => {
	const InnerComp: TRender<{ flag: boolean }> = (_, v) => [
		m("inner", [v.props.flag + ""]),
	];
	const OuterComp: TRender<{}, { flag: boolean; cb: () => void }> = (
		props,
		c
	) => {
		c.state.flag = c.state.flag ?? false;
		c.state.cb =
			c.state.cb ??
			(() => {
				c.state.flag = !c.state.flag;
			});
		return [m(InnerComp, { flag: c.state.flag })];
	};
	const v1 = [m(OuterComp, {})];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	expect(handler.getRoot().toString()).toBe(`<document>
	<inner>
		"false"
	</inner>
</document>`);

	const outerComp1 = v1[0] as VComponent<{}, { flag: boolean; cb: () => void }>;
	const innerComp = outerComp1.renderedVirtual![0] as VComponent<{
		flag: boolean;
	}>;
	const innerElement = innerComp.renderedVirtual![0] as VElement;
	expect(outerComp1.state.flag).toBe(false);
	expect(innerComp.props.flag).toBe(false);
	expect(innerElement.result).toBeDefined();

	outerComp1.state.cb?.();
	expect(outerComp1.state.flag).toBe(true);

	const v2 = [m(OuterComp, {})];
	applyHandler(handler, v2);
	expect(handler.getRoot().toString()).toBe(`<document>
	<inner>
		"true"
	</inner>
</document>`);

	const outerComp2 = v2[0] as VComponent<{}, { flag: boolean; cb: () => void }>;
	expect(outerComp1.internal).toBe(outerComp2.internal);
});

test(`[qqsfmn] Component child identity.`, () => {
	const InnerComp: TRender<{ name: string }, { name: string }> = (_, v) => {
		v.state.name = v.state.name ?? v.props.name;
		if (v.state.name !== v.props.name) {
			throw new Error(
				`[qqsfn0] State mismatch: ${v.state.name} !== ${v.props.name}`
			);
		}
		return [m("inner", [v.state.name])];
	};
	const OuterComp: TRender<{ name: string }> = (_, v) => {
		return [m(InnerComp, { name: v.props.name })];
	};
	const OtherOuterComp: TRender<{ name: string }> = (_, v) => {
		return [m(InnerComp, { name: "other-" + v.props.name })];
	};
	const v1 = [m(OuterComp, { name: "a" })];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	expect(handler.getRoot().toString()).toBe(`<document>
	<inner>
		"a"
	</inner>
</document>`);

	const v2 = [m(OtherOuterComp, { name: "a" })];
	applyHandler(handler, v2);
	expect(handler.getRoot().toString()).toBe(`<document>
	<inner>
		"other-a"
	</inner>
</document>`);
});

test(`[qqsd3x] Component child identity in unkeyed list.`, () => {
	const InnerComp: TRender<{ name: string }, { name: string }> = (_, v) => {
		v.state.name = v.state.name ?? v.props.name;
		if (v.state.name !== v.props.name) {
			throw new Error(
				`[qqsd81] State mismatch: ${v.state.name} !== ${v.props.name}`
			);
		}
		return [m("inner", [v.state.name])];
	};
	const OuterComp: TRender<{ name: string }> = (_, v) => {
		return [m(InnerComp, { name: v.props.name })];
	};
	const OtherOuterComp: TRender<{ name: string }> = (_, v) => {
		return [m(InnerComp, { name: "other-" + v.props.name })];
	};
	const v1 = [
		[
			//
			m(OuterComp, { name: "a" }),
		],
	];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	expect(handler.getRoot().toString()).toBe(`<document>
	<inner>
		"a"
	</inner>
</document>`);

	const v2 = [
		[
			//
			m(OtherOuterComp, { name: "a" }),
		],
	];
	applyHandler(handler, v2);
	expect(handler.getRoot().toString()).toBe(`<document>
	<inner>
		"other-a"
	</inner>
</document>`);
});

test(`[qqsemq] Component child identity in keyed list.`, () => {
	const InnerComp: TRender<{ name: string }, { name: string }> = (_, v) => {
		v.state.name = v.state.name ?? v.props.name;
		if (v.state.name !== v.props.name) {
			throw new Error(
				`[qqsen5] State mismatch: ${v.state.name} !== ${v.props.name}`
			);
		}
		return [m("inner", [v.state.name])];
	};
	const OuterComp: TRender<{ name: string }> = (_, v) => {
		return [m(InnerComp, { name: v.props.name })];
	};
	const OtherOuterComp: TRender<{ name: string }> = (_, v) => {
		return [m(InnerComp, { name: "other-" + v.props.name })];
	};
	const v1 = [
		[
			//
			m(OuterComp, { key: "a", name: "a" }),
		],
	];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	expect(handler.getRoot().toString()).toBe(`<document>
	<inner>
		"a"
	</inner>
</document>`);

	const v2 = [
		[
			//
			m(OtherOuterComp, { key: "a", name: "a" }),
		],
	];
	applyHandler(handler, v2);
	expect(handler.getRoot().toString()).toBe(`<document>
	<inner>
		"other-a"
	</inner>
</document>`);
});

test(`[qz02hi] Component with children.`, () => {
	const HasChildrenComp: TRender = (_, v) => [m("has-children", v.children)];
	const HasNoChildrenComp: TRender = () => [m("no-children")];
	const v1 = [
		m(HasChildrenComp, {}, [m("child-shown")]),
		m(HasNoChildrenComp, {}, [m("child-hidden")]),
	];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	expect(handler.getRoot().toString()).toBe(`<document>
	<has-children>
		<child-shown/>
	</has-children>
	<no-children/>
</document>`);
});

test(`[qz0304] Error boundary catches error.`, () => {
	const InnerComp: TRender = () => {
		throw new Error(`[qz030j]`);
	};
	const OuterComp: TRender = () => {
		return [
			//
			m("outer", [
				//
				m(InnerComp, {}),
			]),
		];
	};
	const ErrorBoundaryComp: TRender<{}, { error?: string }> = (_, v) => {
		v.onerror = (e) => {
			v.state.error = e + "";
		};
		return v.state.error
			? [
					//
					m("error", [
						//
						v.state.error,
					]),
			  ]
			: v.children;
	};
	const AppComp: TRender = () => {
		return [
			//
			m("app", [
				m(ErrorBoundaryComp, {}, [
					//
					m(OuterComp, {}),
				]),
			]),
		];
	};
	const v1 = [
		[
			//
			m(AppComp, {}),
		],
	];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	expect(handler.getRoot().toString()).toBe(`<document>
	<app>
		<error>
			"Error: [qz030j]"
		</error>
	</app>
</document>`);
});

test(`[qz08gx] Remove list.`, () => {
	const v1 = [
		//
		[m("item-0", { key: 0 }), m("item-1", { key: 1 })],
	];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	expect(handler.getRoot().toString()).toBe(`<document>
	<item-0/>
	<item-1/>
</document>`);

	const v2: TVirtualIn[] = [];
	applyHandler(handler, v2);
	expect(handler.getRoot().toString()).toBe(`<document/>`);
});

test(`[qz23w1] Handle spread.`, () => {
	const v1 = [
		//
		m("start"),
		new Spread([m("item-a"), m("item-b")]),
		m("end"),
	];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	expect(handler.getRoot().toString()).toBe(`<document>
	<start/>
	<item-a/>
	<item-b/>
	<end/>
</document>`);
	const [start1, , itemB1, end1] = handler.getRoot().children;

	const v2: TVirtualIn[] = [
		//
		m("start"),
		new Spread([null, m("item-b")]),
		m("end"),
	];
	applyHandler(handler, v2);
	expect(handler.getRoot().toString()).toBe(`<document>
	<start/>
	<item-b/>
	<end/>
</document>`);
	const [start2, itemB2, end2] = handler.getRoot().children;
	expect(start1).toBe(start2);
	expect(itemB1).toBe(itemB2);
	expect(end1).toBe(end2);

	const v3: TVirtualIn[] = [
		//
		m("start"),
		null,
		m("item-b"),
		m("end"),
	];
	applyHandler(handler, v3);
	expect(handler.getRoot().toString()).toBe(`<document>
	<start/>
	<item-b/>
	<end/>
</document>`);
	const [start3, itemB3, end3] = handler.getRoot().children;
	expect(start1).toBe(start3);
	expect(itemB1).toBe(itemB3);
	expect(end1).toBe(end3);
});

test(`[qz5wz0] List with element > component.`, () => {
	const Comp: TRender<{ _name: string }> = (_, v) => {
		return [m(`comp-${v.props._name}`)];
	};
	const v1 = [
		//
		[m("item-0", { key: 0 }, [m(Comp, { _name: "0" })])],
		[m("item-1", { key: 0 }, [m(Comp, { _name: "1" })])],
	];
	const v2 = [
		//
		[m("item-0", { key: 0 }, [m(Comp, { _name: "0" })])],
		[m("item-1", { key: 0 }, [m(Comp, { _name: "1" })])],
	];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	expect(handler.getRoot().toString()).toBe(`<document>
	<item-0>
		<comp-0/>
	</item-0>
	<item-1>
		<comp-1/>
	</item-1>
</document>`);

	applyHandler(handler, v2);
	expect(handler.getRoot().toString()).toBe(`<document>
	<item-0>
		<comp-0/>
	</item-0>
	<item-1>
		<comp-1/>
	</item-1>
</document>`);
});

test(`[r98s08] Moving components with children in FragmentComp.`, () => {
	const ItemComp: TRender<{ name: string }> = (_, v) => {
		return [m(FragmentComp, [m("name", [v.props.name])])];
	};
	const v1 = [
		[
			//
			m(ItemComp, { key: "a", name: "a" }),
			m(ItemComp, { key: "b", name: "b" }),
		],
	];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	expect(handler.getRoot().toString()).toBe(`<document>
	<name>
		"a"
	</name>
	<name>
		"b"
	</name>
</document>`);

	const v2 = [
		[
			//
			m(ItemComp, { key: "b", name: "b" }),
			m(ItemComp, { key: "a", name: "a" }),
		],
	];
	applyHandler(handler, v2);
	expect(handler.getRoot().toString()).toBe(`<document>
	<name>
		"b"
	</name>
	<name>
		"a"
	</name>
</document>`);
});

test(`[r995mt] Extra elements appear inside component.`, () => {
	const ItemComp: TRender<{ name: string; isOpen?: boolean }> = (_, v) => {
		return [
			m(FragmentComp, [
				m("name", [v.props.name]),
				v.props.isOpen && m("open", [v.props.name]),
			]),
		];
	};
	const v1 = [
		[
			//
			m(ItemComp, { key: "a", name: "a" }),
			m(ItemComp, { key: "b", name: "b" }),
		],
	];
	const handler = new MockResultHandler();
	applyHandler(handler, v1);
	expect(handler.getRoot().toString()).toBe(`<document>
	<name>
		"a"
	</name>
	<name>
		"b"
	</name>
</document>`);

	const v2 = [
		[
			//
			m(ItemComp, { key: "a", name: "a", isOpen: true }),
			m(ItemComp, { key: "b", name: "b" }),
		],
	];
	applyHandler(handler, v2);
	expect(handler.getRoot().toString()).toBe(`<document>
	<name>
		"a"
	</name>
	<open>
		"a"
	</open>
	<name>
		"b"
	</name>
</document>`);
});
