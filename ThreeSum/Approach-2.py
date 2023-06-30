from typing import List


class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        res = []
        # To Avoid Duplication in Output
        nums.sort()
        for i in range(len(nums)):
            # Do not use the same number twice if already used
            if i > 0 and nums[i] == nums[i-1]:
                continue

            l = i+1
            r = len(nums)-1
            while (l < r):
                if nums[i]+nums[l]+nums[r] == 0:
                    res.append([nums[i], nums[l], nums[r]])
                    l += 1
                    while nums[l] == nums[l-1] and l < r:
                        # Do not use the same number again
                        l += 1
                elif nums[i]+nums[l]+nums[r] > 0:
                    # Total positive -> reduce positive power in sum
                    r -= 1
                else:
                    # Total negative -> reduce negative power in sum
                    l += 1
        return res


def main():
    s = Solution()
    print(s.threeSum([-1, 0, 1, 2, -1, -4]))
    print(s.threeSum([0, 1, 1]))
    print(s.threeSum([0, 0, 0]))
    print(s.threeSum([0, 0, 0, 0]))


if __name__ == "__main__":
    main()
