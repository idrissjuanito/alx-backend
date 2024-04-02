#!/usr/bin/env python3
""" basic caching class """
BaseCaching = __import__("base_caching").BaseCaching


class LRUCache(BaseCaching):
    """
    limited cash with fifo policy
    """
    def __init__(self):
        super().__init__()
        self.stack = list()

    def put(self, key, item):
        """ puts an item into the cache """
        if key is None or item is None:
            return
        c_data = self.cache_data
        c_data[key] = item
        if key in self.stack:
            idx = self.stack.index(key)
            self.stack.append(self.stack.pop(idx))
            return
        if len(c_data.keys()) > BaseCaching.MAX_ITEMS:
            k = self.stack.pop(0)
            print(f"DISCARD: {k}")
            del c_data[k]
        self.stack.append(key)

    def get(self, key):
        """ gets an item from the cache """
        if key is None or key not in self.cache_data.keys():
            return None
        idx = self.stack.index(key)
        self.stack.append(self.stack.pop(idx))
        return self.cache_data[key]
