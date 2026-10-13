const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Problem = require('./models/Problem');
const User = require('./models/User');

dotenv.config();

const problems = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'nums[1] + nums[2] = 2 + 4 = 6' },
    ],
    testCases: [
      { input: '4\n2 7 11 15\n9', expectedOutput: '0 1', isHidden: false },
      { input: '3\n3 2 4\n6', expectedOutput: '1 2', isHidden: false },
      { input: '2\n3 3\n6', expectedOutput: '0 1', isHidden: true },
    ],
    starterCode: {
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your solution here\n}\n\nint main() {\n    int n; cin >> n;\n    vector<int> nums(n);\n    for (int& x : nums) cin >> x;\n    int target; cin >> target;\n    auto res = twoSum(nums, target);\n    cout << res[0] << " " << res[1] << endl;\n    return 0;\n}`,
      python: `def twoSum(nums, target):\n    # Write your solution here\n    pass\n\nimport sys\ndata = sys.stdin.read().split()\nn = int(data[0])\nnums = list(map(int, data[1:n+1]))\ntarget = int(data[n+1])\nres = twoSum(nums, target)\nprint(res[0], res[1])`,
      javascript: `const readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on('line', l => lines.push(l.trim()));\nrl.on('close', () => {\n    const n = parseInt(lines[0]);\n    const nums = lines[1].split(' ').map(Number);\n    const target = parseInt(lines[2]);\n    function twoSum(nums, target) {\n        // Write your solution here\n    }\n    const res = twoSum(nums, target);\n    console.log(res[0] + ' ' + res[1]);\n});`,
    },
    points: 50,
  },
  {
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.

**Note:** For this problem, input is given as space-separated values of the linked list (0 = end).`,
    difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'],
    constraints: 'The number of nodes in the list is in the range [0, 5000]\n-5000 <= Node.val <= 5000',
    examples: [
      { input: '1 2 3 4 5', output: '5 4 3 2 1', explanation: 'Reversed linked list' },
      { input: '1 2', output: '2 1', explanation: 'Reversed linked list' },
    ],
    testCases: [
      { input: '1 2 3 4 5', expectedOutput: '5 4 3 2 1', isHidden: false },
      { input: '1 2', expectedOutput: '2 1', isHidden: false },
      { input: '5', expectedOutput: '5', isHidden: true },
    ],
    starterCode: {
      python: `def reverseList(nums):\n    # Write your solution here\n    pass\n\nimport sys\nnums = list(map(int, sys.stdin.read().split()))\nres = reverseList(nums)\nprint(' '.join(map(str, res)))`,
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    vector<int> nums;\n    int x;\n    while (cin >> x) nums.push_back(x);\n    reverse(nums.begin(), nums.end());\n    for (int i = 0; i < nums.size(); i++) {\n        cout << nums[i];\n        if (i < nums.size()-1) cout << " ";\n    }\n    return 0;\n}`,
    },
    points: 50,
  },
  {
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    description: `Given an integer array \`nums\`, find the **subarray** with the largest sum, and return its sum.

**Kadane's Algorithm** is commonly used to solve this problem efficiently.`,
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
    constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'Subarray [4,-1,2,1] has the largest sum = 6' },
      { input: 'nums = [1]', output: '1' },
    ],
    testCases: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6', isHidden: false },
      { input: '1\n1', expectedOutput: '1', isHidden: false },
      { input: '5\n5 4 -1 7 8', expectedOutput: '23', isHidden: true },
    ],
    starterCode: {
      python: `def maxSubArray(nums):\n    # Write your solution here\n    pass\n\nimport sys\ndata = sys.stdin.read().split()\nn = int(data[0])\nnums = list(map(int, data[1:]))\nprint(maxSubArray(nums))`,
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint maxSubArray(vector<int>& nums) {\n    // Write your solution\n}\nint main() {\n    int n; cin >> n;\n    vector<int> nums(n);\n    for (int& x : nums) cin >> x;\n    cout << maxSubArray(nums) << endl;\n}`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');\nconst n = parseInt(lines[0]);\nconst nums = lines[1].split(' ').map(Number);\nfunction maxSubArray(nums) {\n    // Write your solution here\n}\nconsole.log(maxSubArray(nums));`,
    },
    points: 100,
  },
  {
    title: 'Binary Search',
    slug: 'binary-search',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with **O(log n)** runtime complexity.`,
    difficulty: 'Easy',
    tags: ['Array', 'Binary Search'],
    constraints: '1 <= nums.length <= 10^4\n-10^4 <= nums[i], target <= 10^4\nnums is sorted in ascending order',
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists at index 4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist' },
    ],
    testCases: [
      { input: '6\n-1 0 3 5 9 12\n9', expectedOutput: '4', isHidden: false },
      { input: '6\n-1 0 3 5 9 12\n2', expectedOutput: '-1', isHidden: false },
      { input: '1\n5\n5', expectedOutput: '0', isHidden: true },
    ],
    starterCode: {
      python: `def search(nums, target):\n    # Write your solution here\n    pass\n\nimport sys\ndata = sys.stdin.read().split()\nn = int(data[0])\nnums = list(map(int, data[1:n+1]))\ntarget = int(data[n+1])\nprint(search(nums, target))`,
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint search(vector<int>& nums, int target) {\n    // Write your solution\n}\nint main() {\n    int n; cin >> n;\n    vector<int> nums(n);\n    for (int& x : nums) cin >> x;\n    int target; cin >> target;\n    cout << search(nums, target) << endl;\n}`,
    },
    points: 50,
  },
  {
    title: 'Longest Common Subsequence',
    slug: 'longest-common-subsequence',
    description: `Given two strings \`text1\` and \`text2\`, return the length of their **longest common subsequence**. If there is no common subsequence, return \`0\`.

A **subsequence** of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.`,
    difficulty: 'Medium',
    tags: ['String', 'Dynamic Programming'],
    constraints: '1 <= text1.length, text2.length <= 1000\ntext1 and text2 consist of only lowercase English characters.',
    examples: [
      { input: 'text1 = "abcde", text2 = "ace"', output: '3', explanation: 'LCS is "ace"' },
      { input: 'text1 = "abc", text2 = "abc"', output: '3', explanation: 'LCS is "abc"' },
    ],
    testCases: [
      { input: 'abcde\nace', expectedOutput: '3', isHidden: false },
      { input: 'abc\nabc', expectedOutput: '3', isHidden: false },
      { input: 'abc\ndef', expectedOutput: '0', isHidden: true },
    ],
    starterCode: {
      python: `def longestCommonSubsequence(text1, text2):\n    # Write your solution here\n    pass\n\nimport sys\nlines = sys.stdin.read().strip().split('\\n')\nprint(longestCommonSubsequence(lines[0], lines[1]))`,
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint longestCommonSubsequence(string text1, string text2) {\n    // Write your solution\n}\nint main() {\n    string a, b;\n    cin >> a >> b;\n    cout << longestCommonSubsequence(a, b) << endl;\n}`,
    },
    points: 100,
  },
  {
    title: 'Number of Islands',
    slug: 'number-of-islands',
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.`,
    difficulty: 'Medium',
    tags: ['Array', 'BFS', 'DFS', 'Graph'],
    constraints: 'm == grid.length\nn == grid[i].length\n1 <= m, n <= 300\ngrid[i][j] is \'0\' or \'1\'',
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' },
    ],
    testCases: [
      { input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', expectedOutput: '1', isHidden: false },
      { input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', expectedOutput: '3', isHidden: false },
      { input: '1 1\n1', expectedOutput: '1', isHidden: true },
    ],
    starterCode: {
      python: `def numIslands(grid):\n    # Write your solution here\n    pass\n\nimport sys\nlines = sys.stdin.read().strip().split('\\n')\nm, n = map(int, lines[0].split())\ngrid = []\nfor i in range(1, m+1):\n    grid.append(lines[i].split())\nprint(numIslands(grid))`,
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint numIslands(vector<vector<char>>& grid) {\n    // Write your solution\n}\nint main() {\n    int m, n; cin >> m >> n;\n    vector<vector<char>> grid(m, vector<char>(n));\n    for (int i=0;i<m;i++) for(int j=0;j<n;j++) { int x; cin>>x; grid[i][j]='0'+x; }\n    cout << numIslands(grid) << endl;\n}`,
    },
    points: 100,
  },
  {
    title: 'Merge K Sorted Lists',
    slug: 'merge-k-sorted-lists',
    description: `You are given an array of \`k\` linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

**Input format:** First line is k (number of lists). Each subsequent line contains space-separated integers for each list (-1 marks end).`,
    difficulty: 'Hard',
    tags: ['Linked List', 'Divide and Conquer', 'Heap', 'Merge Sort'],
    constraints: 'k == lists.length\n0 <= k <= 10^4\n0 <= lists[i].length <= 500\n-10^4 <= lists[i][j] <= 10^4',
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' },
    ],
    testCases: [
      { input: '3\n1 4 5\n1 3 4\n2 6', expectedOutput: '1 1 2 3 4 4 5 6', isHidden: false },
      { input: '0', expectedOutput: '', isHidden: false },
      { input: '2\n1 2 3\n4 5 6', expectedOutput: '1 2 3 4 5 6', isHidden: true },
    ],
    starterCode: {
      python: `import heapq\ndef mergeKLists(lists):\n    # Write your solution here\n    pass\n\nimport sys\nlines = sys.stdin.read().strip().split('\\n')\nk = int(lines[0])\nlists = []\nfor i in range(1, k+1):\n    if i < len(lines):\n        lists.append(list(map(int, lines[i].split())))\nresult = mergeKLists(lists)\nprint(' '.join(map(str, result)))`,
    },
    points: 200,
  },
  {
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    difficulty: 'Hard',
    tags: ['Array', 'Two Pointers', 'Stack', 'Dynamic Programming'],
    constraints: 'n == height.length\n1 <= n <= 2 * 10^4\n0 <= height[i] <= 10^5',
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'Elevation map traps 6 units of rain water' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' },
    ],
    testCases: [
      { input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', expectedOutput: '6', isHidden: false },
      { input: '6\n4 2 0 3 2 5', expectedOutput: '9', isHidden: false },
      { input: '3\n3 0 3', expectedOutput: '3', isHidden: true },
    ],
    starterCode: {
      python: `def trap(height):\n    # Write your solution here\n    pass\n\nimport sys\ndata = sys.stdin.read().split()\nn = int(data[0])\nheight = list(map(int, data[1:]))\nprint(trap(height))`,
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint trap(vector<int>& height) {\n    // Write your solution\n}\nint main() {\n    int n; cin >> n;\n    vector<int> h(n);\n    for (int& x : h) cin >> x;\n    cout << trap(h) << endl;\n}`,
    },
    points: 200,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Problem.deleteMany({});
    await Problem.insertMany(problems);
    console.log(`✅ Seeded ${problems.length} problems`);

    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
