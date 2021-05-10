# Reorder.js

[Reorder.js](https://github.com/jdfekete/reorder.js/) is a JavaScript library for reordering matrices, i.e. either tables, graphs vertices, or parallel coordinates axes.

Want to learn more? [See the wiki.](https://github.com/jdfekete/reorder.js/wiki)


## Development

To develop Reordering.js, you need to have [Node.js](http://www.nodejs.org)
and [NPM](http://www.npmjs.org) installed. Once you have done that, run the
following from the root directory of this repository to install the development
dependencies:

```
npm install
```

## Testing

To run the tests in the distribution, use the following command:

```
npm run test
```
## Examples

To run the examples, use the following command:

```
npm run dev
```

It should open a web browser but if does not, open a web page and connect to: `http://localhost:3004/`.

## References

The library is used by several systems, including [Bertifier](https://www.aviz.fr/bertifier), [The Vistorian](https://vistorian.net/), and [Compadre](https://renecutura.eu/compadre/).

## Thanks

Thanks to [Curran Kelleher @curran](https://github.com/curran) for adapting the library to modern JavaScript modules.

Thanks to [Philippe Rivière @fil](https://github.com/fil) for porting the "Les Misérables" example to [observablehq](https://observablehq.com/@fil/hello-reorder-js)

Thanks to [Renaud Blanch](http://iihm.imag.fr/blanch/) for giving me his implementation of the 'Optimal Leaf Ordering' algorithm. He has improved it and the distribution is available as [ordering](https://bitbucket.org/rndblnch/ordering).

I originally started this in order to add a reordering module to
[D3.js](http://mbostock.github.com/d3/).

The project structure and Makefile is based on that of D3, so a big thank you
goes to [Mike Bostock](http://bost.ocks.org/mike/) for this.
