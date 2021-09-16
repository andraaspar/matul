import { TVirtualIn } from "./TVirtualIn";

/**
 * @babel/preset-react does not allow spreading children. This is a workaround.
 */
export class Spread {
	constructor(public items: TVirtualIn[]) {}
}
