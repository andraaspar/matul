import { Spread } from "./Spread";
import { TVirtual } from "./TVirtual";

export type TVirtualIn =
	| TVirtual
	| Spread
	| string
	| number
	| bigint
	| boolean
	| null
	| undefined
	| TVirtualIn[];
