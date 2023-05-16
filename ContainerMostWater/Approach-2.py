from typing import List


class Solution:
    def maxArea(self, height: List[int]) -> int:
        # Two things to note:
        # 1. Area formed between the lines will always
        # be limited by the height of the shorter line.
        # 2. Farther the lines, the more will be
        # the area obtained.
        # Algo:
        # Lets consider the area between the lines of larger lengths.
        # If we try to move the pointer at the longer line inwards,
        # we won't gain any increase in area, since it is limited
        # by the shorter line. But moving the shorter line's
        # pointer could turn out to be beneficial, as per the
        # same argument, despite the reduction in the width.
        # This is done since a relatively longer line obtained
        # by moving the shorter line's pointer might overcome
        # the reduction in area caused by the width reduction.
        maxArea = -1
        left_ptr = 0
        right_ptr = len(height) - 1
        while (left_ptr < right_ptr):
            left_pillar_value = height[left_ptr]
            right_pillar_value = height[right_ptr]
            distance = right_ptr - left_ptr
            current_area = distance * \
                min(left_pillar_value, right_pillar_value)
            if current_area > maxArea:
                maxArea = current_area
            if left_pillar_value > right_pillar_value:
                # right pillar is smaller
                # need to discard and get a bigger pillar
                right_ptr -= 1
            else:
                # left pillar is smaller
                # need to discard and get a bigger pillar
                left_ptr += 1
        return maxArea
        # Time Complexity : O(N)
        # Space Complexity : O(1)


def main():
    s = Solution()
    assert s.maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]) == 49, f"Case-1 Failed."
    assert s.maxArea([1, 1]) == 1, f"Case-2 Failed."


if __name__ == "__main__":
    main()
