export = reorder
export as namespace reorder;

declare namespace reorder {
    version: string;
    debug: boolean;
    type Distance = (a: number, b: number) : number;
    type Order = number[];
    function cmp_number_asc(a: number, b: number): number;
    function cmp_number_desc(a: number, b: number): number;
    function flatten(a: any[], b: any[]): any[];
    interface LeafOrder {
        function order(root: Tree): Order;
        function distance(dist: Distance): LeafOrder;
        function distance(): Distance;
        function linkage(linkage: string): LeafOrder;
        function linkage(): string;
        function distance_matrix(matrix: number[][]): LeafOrder;
        function reorder(matrix: number[][]): Order;
    }
    function optimal_leaf_order() : LeafOrder;
}
