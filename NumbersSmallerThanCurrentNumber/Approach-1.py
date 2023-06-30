from typing import List


class Solution:
    def smallerNumbersThanCurrent(self, nums: List[int]) -> List[int]:
        # NLogN
        sorted_list = sorted(nums)
        output = []
        # N
        for item in nums:
            output.append(sorted_list.index(item))
        # Overall NLogN
        return output


def main():
    s = Solution()
    print(s.smallerNumbersThanCurrent([8, 1, 2, 2, 3]))
    print(s.smallerNumbersThanCurrent([6, 5, 4, 8]))
    print(s.smallerNumbersThanCurrent([7, 7, 7, 7]))


if __name__ == '__main__':
    main()
