export const algorithmInfo = {
   bubble: {
  name: "Bubble Sort",
  best: "O(n)",
  average: "O(n²)",
  worst: "O(n²)",
  space: "O(1)",
  stable: true,
  inPlace: true,
  category: "Brute Force",
  description:
    "Bubble Sort repeatedly compares adjacent elements and swaps them if they are in the wrong order. With each pass, the largest unsorted element 'bubbles' to its correct position at the end. It is simple but inefficient for large datasets."
},
    selection: {
  name: "Selection Sort",
  best: "O(n²)",
  average: "O(n²)",
  worst: "O(n²)",
  space: "O(1)",
  stable: false,
  inPlace: true,
  category: "Brute Force",
  description:
    "Selection Sort divides the array into sorted and unsorted regions. It repeatedly selects the smallest element from the unsorted portion and swaps it with the first unsorted index. It performs fewer swaps but always scans the full array."
},
    insertion: {
  name: "Insertion Sort",
  best: "O(n)",
  average: "O(n²)",
  worst: "O(n²)",
  space: "O(1)",
    stable: true,
  inPlace: true,
  category: "Incremental",
  description:
    "Insertion Sort builds the sorted array one element at a time by inserting each element into its correct position among previously sorted elements. It performs very well on nearly sorted arrays and is commonly used in hybrid sorting algorithms."
},
    quick: {
  name: "Quick Sort",
  best: "O(n log n)",
  average: "O(n log n)",
  worst: "O(n²)",
  space: "O(log n)",
   stable: false,
  inPlace: true,
  category: "Divide and Conquer",
  description:
    "Quick Sort partitions the array around a pivot element such that elements smaller than the pivot go left and larger go right. It then recursively sorts the partitions. It is extremely fast in practice but can degrade to quadratic time with poor pivot choices."
},
    merge: {
  name: "Merge Sort",
  best: "O(n log n)",
  average: "O(n log n)",
  worst: "O(n log n)",
  space: "O(n)",
   stable: true,
  inPlace: false,
  category: "Divide and Conquer",
  description:
    "Merge Sort uses the divide-and-conquer strategy by recursively splitting the array into halves until single elements remain, then merging them back in sorted order. It guarantees consistent performance but requires extra space for merging."
},
    linear: {
  name: "Linear Search",
  best: "O(1)",
  average: "O(n)",
  worst: "O(n)",
  space: "O(1)",
  category: "Brute Force",
  description:
    "Linear Search scans each element sequentially until the target is found or the array ends. It works on both sorted and unsorted arrays but becomes inefficient for large datasets."
},
    binary: {
  name: "Binary Search",
  best: "O(1)",
  average: "O(log n)",
  worst: "O(log n)",
  space: "O(1)",
    category: "Divide and Conquer",
  description:
    "Binary Search works on sorted arrays by repeatedly dividing the search space in half. It compares the target with the middle element and eliminates half of the remaining elements each step, making it highly efficient for large sorted datasets."
},
heap: {
  name: "Heap Sort",
  best: "O(n log n)",
  average: "O(n log n)",
  worst: "O(n log n)",
  space: "O(1)",
  description:
    "Heap Sort builds a binary heap from the array and repeatedly extracts the maximum element to place it at the end. It guarantees O(n log n) time without extra memory but is not stable and has worse cache performance than Quick Sort."
}
}