#!/usr/bin/env python3
""" basic caching class """
BaseCaching = __import__("base_caching").BaseCaching


class LFUCache(BaseCaching):
    """
    Least frequently used caching algorithm
    """
    def __init__(self):
        super().__init__()
        self.stack = list()
        self.access_count = {}

    def put(self, key, item):
        """ puts an item into the cache """
        if key is None or item is None:
            return
        c_data = self.cache_data
        c_data[key] = item
        if key in self.stack:
            idx = self.stack.index(key)
            self.stack.append(self.stack.pop(idx))
            self.access_count[key] = self.access_count[key] + 1
            return
        if len(c_data.keys()) > BaseCaching.MAX_ITEMS:
            lfu = self.stack[0]
            for v in self.stack:
                if self.access_count[v] < self.access_count[lfu]:
                    lfu = v
            k = self.stack.pop(self.stack.index(lfu))
            print(f"DISCARD: {k}")
            del c_data[lfu]
            del self.access_count[lfu]
        self.access_count[key] = 0
        self.stack.append(key)

    def get(self, key):
        """ gets an item from the cache """
        if key is None or key not in self.cache_data.keys():
            return None
        idx = self.stack.index(key)
        self.stack.append(self.stack.pop(idx))
        self.access_count[key] = self.access_count[key] + 1
        return self.cache_data[key]
