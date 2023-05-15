from typing import List
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        remaining_seen = dict()
        for index, num in enumerate(nums):
            difference = target - num
            if difference in remaining_seen:
                return [index, remaining_seen[difference]]
            else:
                remaining_seen[num] = index 
        # Time Complexity : O(N)
        # Space Complexity : O(N)


def main():
    s = Solution()
    print(s.twoSum([2, 7, 11, 15], 9))
    print(s.twoSum([3, 2, 4], 6))
    print(s.twoSum([3, 3], 6))


if __name__ == "__main__":
    main()
