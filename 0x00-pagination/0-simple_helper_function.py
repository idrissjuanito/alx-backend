#!/usr/bin/env python3
"""
helper function module
"""


def index_range(page: int, page_size: int):
    """ computes indexes to display for a page"""
    end = page * page_size
    start = end - page_size
    return (start, end)
