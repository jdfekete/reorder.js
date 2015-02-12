from hcluster import pdist, linkage, leaves_list, squareform, dendrogram
import numpy as np
import matplotlib as mp

metric = 'euclidean'
method = 'single'

data = np.matrix([
    [1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0, 0]])

y = pdist(data, metric=metric)
Z = linkage(y, method=method, metric=metric)
dendrogram(Z)
Z = [(int(l), int(r), max(0., s), int(n)) for (l, r, s, n) in Z] # cleaning

leaves = list(leaves_list(Z))
count = len(leaves)
root = len(Z)+count-1

X = squareform(y)
assert len(X) == count


from utils import memoise


# bar-joseph optimal ordering ################################################

from barjoseph import optimal

leaves = optimal(root, **{
    "S":        lambda i, j: X[i][j],
    "left":     lambda i: None if i < count else Z[i-count][0],
    "right":    lambda i: None if i < count else Z[i-count][1],
    "is_leaf":  lambda i: i < count,
    "is_empty": lambda v: v is None,
})

print leaves
