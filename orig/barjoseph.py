# -*- coding: utf-8 -*-

"""optimal dendrogram ordering

implementation of binary tree ordering described in [Bar-Joseph et al., 2003]
by Renaud Blanch.

[Bar-Joseph et al., 2003]
K-ary Clustering with Optimal Leaf Ordering for Gene Expression Data.
Ziv Bar-Joseph, Erik D. Demaine, David K. Gifford, Angèle M. Hamel,
Tommy S. Jaakkola and Nathan Srebro
Bioinformatics, 19(9), pp 1070-8, 2003
http://www.cs.cmu.edu/~zivbj/compBio/k-aryBio.pdf
"""


def optimal(v, S, left, right, is_leaf, is_empty):
	"""return optimal ordering
	
	v              is the root node of a dendrogram
	S              is the similarity matrix i.e.
	               S(i, j) should return the similarity of the leaves i & j
	left(node)     is the root of the left subtree of node
	right(node)    is the root of the rigth subtree of node
	is_leaf(node)  is True iff node is a leaf
	is_empty(node) is True iff node is a leaf subtree i.e.:
	               if is_leaf(node):
	                  assert is_empty(left(node))
	                  assert is_empty(right(node))
	"""
	
	from utils import memoise
	
	S = memoise(S)
	
	@memoise
	def T(v):
		"""leafs of subtree v"""
		if is_empty(v):
			return []
		if is_leaf(v):
			return [v]
		return T(left(v)) + T(right(v))
	
	@memoise
	def M(v, i, j):
		"""maximal order of v with leftmost leaf i and rightmost leaf j"""
		
		# halting
		if is_leaf(v):
			return 0., [v]
		
		# swapping sub-trees according to i and j
		l, r = left(v), right(v)
		L, R = T(l), T(r)
		if i in L and j in R:
			w, x = l, r
		elif i in R and j in L:
			w, x = r, l
		else:
			assert False, "%s not least common ancestor of %s & %s" % (v, i, j)
		
		# restricting domain of k and l
		Wl, Wr = T(left(w)), T(right(w))
		Ks = Wl if i in Wr else Wr
		if Ks == []:
			Ks = [i]
		
		Xl, Xr = T(left(x)), T(right(x))
		Ls = Xl if j in Xr else Xr
		if Ls == []:
			Ls = [j]
		
		# maximize similarity
		maximum, order = 0., None
		for k in Ks:
			w_maximum, w_order = M(w, i, k)
			for l in Ls:
				x_maximum, x_order = M(x, l, j)
				similarity = w_maximum + S(k, l) + x_maximum
				if similarity > maximum:
					maximum, order = similarity, w_order + x_order

		return maximum, order
	
	# and now the external loop
	maximum = 0.
	for i in T(left(v)):
		for j in T(right(v)):
			similarity, order = M(v, i, j)
			if similarity > maximum:
				maximum, optimal_order = similarity, order
	
	return optimal_order
