#!/usr/bin/env python3
"""server class module"""
import csv
import math
from typing import Dict, List


def index_range(page: int, page_size: int):
    """ computes indexes to display for a page"""
    end = page * page_size
    start = end - page_size
    return (start, end)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """ get data associated with particular page
        """
        assert isinstance(page, int) and page > 0
        assert isinstance(page_size, int) and page_size > 0
        indexes = index_range(page, page_size)
        data = self.dataset()
        if indexes[0] > len(data):
            return []
        if indexes[1] > len(data):
            return data[indexes[0]:]
        return data[indexes[0]:indexes[1]]

    def get_hyper(self, page: int = 1, page_size: int = 10) -> Dict:
        """ get pagination information about page """
        page_data = self.get_page(page, page_size)
        dataset = self.__dataset
        total_pages = math.ceil(len(dataset) / page_size) if dataset else 0
        return {
            "page_size": len(page_data),
            "page": page,
            "data": page_data,
            "next_page": page + 1 if page < total_pages else None,
            "prev_page": None if page < 2 else page - 1,
            "total_pages": total_pages
        }
