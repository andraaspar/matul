import { IResultHandler } from "../model/IResultHandler";
import { IResultHandlerAddParams } from "../model/IResultHandlerAddParams";
import { IResultHandlerMoveParams } from "../model/IResultHandlerMoveParams";
import { IResultHandlerRemoveParams } from "../model/IResultHandlerRemoveParams";
import { IResultHandlerUpdateParams } from "../model/IResultHandlerUpdateParams";
import { TVirtual } from "../model/TVirtual";
export declare type TMockNode = MockElement | MockText;
export interface MockProps {
    s?: string;
    n?: number;
    i?: bigint;
    b?: boolean;
}
export declare class MockElement {
    name: string;
    props: MockProps;
    children: TMockNode[];
    constructor(name: string, props: MockProps);
    toString(): string;
}
export declare class MockText {
    text: string;
    constructor(text: string);
    toString(): string;
}
export declare class MockResultHandler implements IResultHandler<TMockNode> {
    root: MockElement;
    v: TVirtual<TMockNode>[] | undefined;
    constructor();
    getRoot(): MockElement;
    getVirtuals(): TVirtual<TMockNode>[] | undefined;
    setVirtuals(v: TVirtual<TMockNode>[] | undefined): void;
    addCallCount: number;
    add(p: IResultHandlerAddParams<TMockNode>): TMockNode | undefined;
    updateCallCount: number;
    update(p: IResultHandlerUpdateParams<TMockNode>): TMockNode | undefined;
    removeCallCount: number;
    remove(p: IResultHandlerRemoveParams<TMockNode>): void;
    moveCallCount: number;
    move(p: IResultHandlerMoveParams<TMockNode>): void;
    resetCallCounts(): void;
}
