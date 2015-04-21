require("./core");

require("util").puts(JSON.stringify({
    "name": "reorder.js",
    "version": reorder.version,
    "description": "Matrix reordering in JavaScript.",
    "keywords": ["matrix", "reordering", "mathematics"],
    "homepage": "http://www.aviz.fr/~fekete",
    "author": {"name": "Jean-Daniel Fekete", "url": "http://www.aviz.fr/~fekete"},
    "repository": {"type": "git", "url": "http://github.com/jdfekete/reorder.js.git"},
    "author": [
	{
	    "name": "Jean-Daniel Fekete",
	    "url": "http://www.aviz.fr/~fekete"
	}
    ],
    "dependencies": {
	"science": "1.9.2",
	"tiny-queue": "0.2.1"
    },
    "devDependencies": {
	"seedrandom": "2.3.11",
	"uglify-js": "2.4.20",
	"vows": "0.8.1",
	"jsonfile": "2.0.0"
    },
    "scripts": {
	"test": "vows --nocolor; echo"
    },
    "licenses": [
	{
	    "type": "BSD-3",
	    "url": "https://github.com/jdfekete/reorder.js/blob/master/LICENSE"
	}
    ]
}, null, 2));
