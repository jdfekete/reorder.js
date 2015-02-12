require("./core");

require("util").puts(JSON.stringify({
  "name": "reorder",
  "version": reorder.version,
  "description": "Matrix reordering in JavaScript.",
  "keywords": ["matrix", "reordering", "mathematics"],
  "homepage": "http://www.aviz.fr/~fekete",
  "author": {"name": "Jean-Daniel Fekete", "url": "http://www.aviz.fr/~fekete"},
  "repository": {"type": "git", "url": "http://github.com/jdfekete/reorder.js.git"},
    "devDependencies": {
	"seedrandom": "2.3.3",
	"science": "1.9.1",
	"uglify-js": "1.2.6",
	"vows": "0.7.0"
    }
}, null, 2));
