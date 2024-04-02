#!/usr/bin/env python3
""" basic caching class """
BaseCaching = __import__("base_caching").BaseCaching


class BasicCache(BaseCaching):
    """ basic cache class
        implements put ad get cache methods
    """
    def __init__(self):
        pass

    def put(self, key, item):
        """ puts an item into the cache """
        if key is None or item is None:
            return
        self.cache_data[key] = item

    def get(self, key):
        """ gets an item from the cache """
        if key is None or key not in self.cache_data.keys():
            return None
        return self.cache_data[key]
