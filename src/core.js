export const version = '[VI]{version}[/VI]'; // managed by rollup-plugin-version-injector
export let debug = false;

export function set_debug(v = true) {
  debug = v;
}
