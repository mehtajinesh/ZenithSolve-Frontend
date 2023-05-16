from typing import List
class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        m = len(nums1)
        n = len(nums2)
        i = 0
        j = 0
        final_array = []
        while(i < m and j < n):
            curr_item_1 = nums1[i]
            curr_item_2 = nums2[j]
            if curr_item_1 < curr_item_2:
                final_array.append(curr_item_1)
                i += 1
            else:
                final_array.append(curr_item_2)
                j += 1
        while i < m:
            curr_item_1 = nums1[i]
            final_array.append(curr_item_1)
            i += 1
        while j<n:
            curr_item_2 = nums2[j]
            final_array.append(curr_item_2)
            j += 1
        len_final_array = len(final_array)
        if len_final_array%2 == 0:
            left = int(len_final_array/2) - 1
            right = int(len_final_array/2)
            return (final_array[left] + final_array[right])/2
        else:
            return final_array[int(len_final_array/2)]    
        # Time Complexity : O(M+N) or O(Max(M,N))
        # Space Complexity : O(M+N)


def main():
    s = Solution()
    assert s.findMedianSortedArrays([1,3], [2]) == 2.00000, f"Case-1 Failed."
    assert s.findMedianSortedArrays([1, 2], [3,4]) == 2.50000, f"Case-2 Failed."


if __name__ == "__main__":
    main()
