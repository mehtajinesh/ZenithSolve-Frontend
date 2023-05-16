from typing import List


class Solution:
    def maxArea(self, height: List[int]) -> int:
        maxArea = -1
        for x in range(len(height)):
            for y in range(x+1, len(height)):
                currentArea = min(height[x], height[y]) * (y-x)
                if currentArea > maxArea:
                    maxArea = currentArea
        return maxArea
        # Time Complexity : O(N^2)
        # Space Complexity : O(1)
        # Time Exceeded


def main():
    s = Solution()
    assert s.maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]) == 49, f"Case-1 Failed."
    assert s.maxArea([1, 1]) == 1, f"Case-2 Failed."


if __name__ == "__main__":
    main()
