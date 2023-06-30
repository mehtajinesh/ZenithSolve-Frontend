from typing import List


class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        answers = []
        remaining_seen = dict()
        for index, num in enumerate(nums):
            difference = target - num
            if difference in remaining_seen:
                answers.append([index, remaining_seen[difference]])
            else:
                remaining_seen[num] = index
        # Time Complexity : O(N)
        # Space Complexity : O(N)
        return answers

    def threeSum(self, nums: List[int]) -> List[List[int]]:
        output = []
        sorted_nums = sorted(nums)
        for index, item in enumerate(sorted_nums):
            if index != 0 and (sorted_nums[index] == sorted_nums[index-1]):
                continue
            else:
                mini_array = sorted_nums[index+1:]
                two_sum_ans = self.twoSum(mini_array, -item)
                if two_sum_ans:
                    for ans in two_sum_ans:
                        comb = [item, mini_array[ans[0]], mini_array[ans[1]]]
                        if comb not in output:
                            output.append(comb)
        return output


def main():
    s = Solution()
    print(s.threeSum([-1, 0, 1, 2, -1, -4]))
    print(s.threeSum([0, 1, 1]))
    print(s.threeSum([0, 0, 0]))
    print(s.threeSum([0, 0, 0, 0]))


if __name__ == "__main__":
    main()
