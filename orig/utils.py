def memoise(func):
	"""meoization
	
	trade space for speed by caching function results
	"""
	results = dict()
	def f(*args):
		if args in results:
			result = results[args]
		else:
			results[args] = result = func(*args)
		return result
	f.__name__ = func.__name__
	f.__doc__  = func.__doc__
	return f
