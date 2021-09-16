# MATUL

> Virtual DOM library.

## Features

- NOT FOR THE FAINT OF HEART.
- Simple.
- No redux. Anything goes.
- Optional JSX.
- TypeScript typed.
- Supports IE9+.
- Not only for HTML.

## Example

```jsx
const EnterNameComp = () => (
	<p>
		Enter your name:{" "}
		<input
			value={localStorage.name || ""}
			oninput={function () {
				localStorage.name = this.value;
				render();
			}}
		/>
	</p>
);

const SayHelloComp = (_, v) => {
	const name = localStorage.name || v.props.defaultName;
	return (
		<p>
			<button
				onclick={() => {
					document.cookie = `Hello ${name}! =MATUL!!!`;
					render();
				}}
			>
				Say hello to {name}
			</button>
		</p>
	);
};

const OutputComp = () => (
	<>
		{document.cookie.split(";").map((item, index) => (
			<div key={index}>{item.split("=")[0]}</div>
		))}
	</>
);

const AppComp = () => (
	<>
		<EnterNameComp />
		<SayHelloComp defaultName="World" />
		<OutputComp />
	</>
);

mount(document.getElementById("app"), AppComp);
render();
```

## Install

```
npm install matul
```

## Compatibility

Supports IE9+ when appropriate polyfills (`console-polyfill`, `core-js/stable`, `raf/polyfill`) are added. For one-shot tests, use `dist/matul-compat.js`, which contains these polyfills, plus `whatwg-fetch` for your convenience.

## Babel

`.babelrc` should be similar to:

```json
{
	"presets": [
		"@babel/preset-env",
		[
			"@babel/preset-react",
			{
				"pragma": "createElement",
				"pragmaFrag": "FragmentComp"
			}
		],
		[
			"@babel/preset-typescript",
			{
				"jsxPragma": "createElement",
				"jsxPragmaFrag": "FragmentComp"
			}
		]
	]
}
```

Babel may not allow spreading children:

```jsx
const MyComp = (_, v) => <div>{...v.children}</div>;
```

So replace with:

```jsx
const MyComp = (_, v) => <div>{new Spread(v.children)}</div>;
```

## TypeScript

`tsconfig.json` should include:

```json
{
	"compilerOptions": {
		"jsx": "react",
		"jsxFactory": "createElement",
		"jsxFragmentFactory": "FragmentComp"
	}
}
```

Components should be typed as `TRenderJSX` or `TRenderJSXWithChildren`:

```tsx
import { render, createElement, FragmentComp, TRenderJSX } from "matul";

export interface MyCompProps {}
export interface MyCompState {}

export const MyComp1: TRenderJSX<MyCompProps, MyCompState> = (_, v) => <div />;
export const MyComp2: TRenderJSXWithChildren<MyCompProps, MyCompState> = (
	_,
	v
) => <div />;
```

## Components

Components are simple render functions. See just above.

The function takes two parameters:

- `_` is always `undefined`, and is only necessary for TSX to work.
- `v` is constant across re-renders and has the following properties:

```ts
interface IComponentInternal<TProps, TState> {
	props: TProps; // Props passed to the component
	state: TState; // Any values to persist across re-renders
	children: TVirtual[]; // Child virtual nodes
	isRemoved?: boolean; // True when the component has been removed

	// Lifecycle methods for override
	onadded?: () => void; // Called after first render
	onupdated?: (initial: boolean) => void; // Called after each render, including the first
	onremove?: () => void; // Called before remove
	onerror?: (e: any) => void; // Called on error caught inside
}
```

## Error boundary

```tsx
import { createElement, TRenderJSXWithChildren } from "matul";

export const ErrorBoundaryComp: TRenderJSXWithChildren<{}, { error: string }> =
	(_, v) => {
		v.onerror = (e) => {
			v.state.error = e + "";
			requestAnimationFrame(() => {
				throw e;
			});
		};
		return v.state.error ? (
			<span class="error">{v.state.error}</span>
		) : (
			v.children
		);
	};
```

## Trusted HTML

Use the `__UNSAFE_trust__` prop.

```tsx
import { createElement, TRenderJSX } from "../matul";

export interface IconCompProps {
	icon: Icon;
}
export interface IconCompState {}

export const IconComp: TRenderJSX<IconCompProps, IconCompState> = (_, v) => {
	return <i class="bi" __UNSAFE_trust__={v.props.icon} />;
};

export enum Icon {
	Dot = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dot" viewBox="0 0 16 16">
  <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
</svg>`,
}
```

## Without JSX

```js
const { m, mount, render, FragmentComp } = matul;

const EnterNameComp = () => [
	m("p", [
		"Enter your name: ",
		m("input", {
			value: localStorage.name || "",
			oninput: function () {
				localStorage.name = this.value;
				render();
			},
		}),
	]),
];

const SayHelloComp = (_, v) => {
	const name = localStorage.name || v.props.defaultName;
	return [
		m("p", [
			m(
				"button",
				{
					onclick: () => {
						document.cookie = `Hello ${name}! =MATUL!!!`;
						render();
					},
				},
				["Say hello to " + name]
			),
		]),
	];
};

const OutputComp = () => [
	document.cookie
		.split(";")
		.map((item, index) => m("div", { key: index }, [item.split("=")[0]])),
];

const AppComp = () => [
	//
	m(EnterNameComp),
	m(SayHelloComp, { defaultName: "World" }),
	m(OutputComp),
];

mount(document.getElementById("app"), AppComp);
render();
```

## License

MIT
