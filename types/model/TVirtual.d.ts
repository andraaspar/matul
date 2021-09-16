import { VComponent } from "./VComponent";
import { VElement } from "./VElement";
import { VList } from "./VList";
import { VPlaceholder } from "./VPlaceholder";
import { VText } from "./VText";
export declare type TVirtual<TResult = unknown> = VList<TResult> | VComponent<any, any, TResult> | VElement | VText | VPlaceholder;
