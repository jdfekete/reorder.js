NODE_PATH = ./node_modules
JS_COMPILER = $(NODE_PATH)/uglify-js/bin/uglifyjs
#JS_TESTER = $(NODE_PATH)/vows/bin/vows --nocolor -v

all: \
	reorder.v1.js \
	reorder.v1.min.js

reorder.v1.js: \
	src/core.js \
	src/utils.js \
	src/aliases.js \
	src/debug.js \
	src/mean.js \
	src/sum.js \
	src/distance.js \
	src/range.js \
	src/transpose.js \
	src/correlation.js \
	src/bandwidth.js \
	src/edgesum.js \
	src/permutation.js \
	src/graph.js \
	src/graph_random.js \
	src/graph_empty.js \
	src/graph_complete.js \
	src/graph_connect.js \
	src/bfs.js \
	src/bfs_order.js \
	src/mat2graph.js \
	src/graph2mat.js \
	src/count_crossings.js \
	src/adjacent_exchange.js \
	src/barycenter_order.js \
	src/all_pairs_distance.js \
	src/graph2distmat.js \
	src/dist.js \
	src/random.js \
	src/permute.js \
	src/stablepermute.js \
	src/sort_order.js \
	src/hcluster.js \
	src/optimal_leaf_order.js \
	src/order.js \
	src/covariance.js \
	src/laplacian.js \
	src/poweriteration.js \
	src/fiedler.js \
	src/spectral_order.js \
	src/pca_order.js \
	src/ca.js \
	src/cuthill_mckee_order.js \
	src/condition.js \
	src/pcp.js

test: all
	@npm test

%.min.js: %.js Makefile
	@rm -f $@
	$(JS_COMPILER) < $< > $@

%.js:
	@rm -f $@
	@echo '(function(exports){' > $@
	cat $(filter %.js,$^) >> $@
	@echo '})(this);' >> $@
	@chmod a-w $@

jshint:
	node_modules/jshint/bin/jshint src/*.js


install: package.json
	mkdir -p node_modules
	npm install

clean:
	rm -rf reorder*.js node_modules
