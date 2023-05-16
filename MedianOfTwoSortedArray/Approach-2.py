from typing import List
class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        # This question is based on the logic of Binary Search Algorithm
        x=len(nums1)
        y=len(nums2)
        # Why do we need to do the keep the lower size array as nums1?
        # This is because we are using the assumption that the ideal partition X starts at L+H//2
        if x>y:
            return self.findMedianSortedArrays(nums2,nums1)
        low=0
        high=x
        # We search through the nums1 array for the best partition such that nos in the final array are
        # aligned in such a way that nos left of the median of final array are less than median and 
        # nos right of the median are more than median.
        while(low<=high):
            # we start by keeping the whole array nums1 for search of the ideal partition
            # then we change the low and high after every iteration to reduce the search 
            # size of nums1 by half (hence the log in time complexity)
            partitionX=int((low+high)/2)
            # We derive the partition in nums2 array based on 
            partitionY=int(((x+y+1)//2 )-partitionX)
            # find the maximum value of the left side of the partitionX
            # if partitionX is already on the extreme left then use -inf
            maxLeftX= float('-inf') if partitionX==0 else nums1[partitionX-1]
            # find the minimum value of the right side of the partitionX
            # if partitionX is already on the extreme right then use inf
            minRightX=float('inf') if partitionX==x else nums1[partitionX]
            # find the maximum value of the left side of the partitionY
            # if partitionY is already on the extreme left then use -inf
            maxLeftY = float('-inf') if partitionY == 0 else nums2[partitionY - 1]
            # find the minimum value of the right side of the partitionY
            # if partitionY is already on the extreme right then use inf
            minRightY =  float('inf') if partitionY == y else nums2[partitionY]
            # if numbers of the left are less than numbers on the right, then median found
            if maxLeftX<=minRightY and maxLeftY<=minRightX:
                # if total no is even, then avg of middle two nos is median
                # middle two are max of left side and min of right side because
                # they will be closest to the median
                if (x+y) %2 ==0:
                    return (max(maxLeftX,maxLeftY) + min(minRightX,minRightY))/2
                else:
                    # total is odd, hence take max of the left of the median
                    return max(maxLeftY,maxLeftX)
            # if no median exists, which satisfy the above condition then
            # update the search space by updating either high or low
            elif(maxLeftX>minRightY):
                # the max value of left side for array 1 is too big when 
                # compared with min value of the right side of array 2
                # hence we update the search space by reducing space from the top
                # so that for the next iteration, the search space gets
                # a lower maximum left value
                high=partitionX-1
            else:
                # the min value of right side of array 1 is too small when
                # compared with max value of the left side of array 2
                # hence we update the search space by reducing space from the bottom
                # so that for the next iteration, the search space gets
                # a higher maximum right value
                low=partitionX+1
        # Time Complexity : O(log(M+N))
        # Space Complexity : O(1)


def main():
    s = Solution()
    assert s.findMedianSortedArrays([1,3], [2]) == 2.00000, f"Case-1 Failed."
    assert s.findMedianSortedArrays([1, 2], [3,4]) == 2.50000, f"Case-2 Failed."
    assert s.findMedianSortedArrays([1, 3,4,7,10,12], [2,3,6,15]) == 5.00000, f"Case-3 Failed."


if __name__ == "__main__":
    main()
