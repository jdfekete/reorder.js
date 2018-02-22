export = reorder;
export as namespace reorder;

declare namespace reorder {
    version: string;
    debug: boolean;
    type Distance = (a: number, b: number) => number;
    type Order = number[];
    function cmp_number_asc(a: number, b: number): number;
    function cmp_number_desc(a: number, b: number): number;
    function flatten(a: any[], b: any[]): any[];
    interface Tree {}
    interface LeafOrder {
        order(root: Tree): Order;
        distance(dist: Distance): LeafOrder;
        distance(): Distance;
        linkage(linkage: string): LeafOrder;
        linkage(): string;
        distance_matrix(matrix: number[][]): LeafOrder;
        reorder(matrix: number[][]): Order;
    }
    function optimal_leaf_order() : LeafOrder;
}
