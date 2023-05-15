from typing import List
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        for index_x in range(len(nums)):
            for index_y in range(index_x + 1, len(nums)):
                if nums[index_x] + nums[index_y] == target:
                    return [index_x, index_y]
        # Time Complexity : O(N^2)
        # Space Complexity : O(1)


def main():
    s = Solution()
    print(s.twoSum([2, 7, 11, 15], 9))
    print(s.twoSum([3, 2, 4], 6))
    print(s.twoSum([3, 3], 6))


if __name__ == "__main__":
    main()
