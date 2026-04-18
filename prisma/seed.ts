import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

import { PrismaClient } from "../orm/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// ─── Pattern Seed Data ──────────────────────────────────────────────

const patterns = [
  {
    number: 1,
    name: "Math & Modulo",
    description:
      "Problems involving division, remainders, digit extraction, converting amounts.",
    recognitionCues:
      "Is it about DIGITS / REMAINDERS / CONVERSION? Does it involve modulo (%), division, or digit extraction?",
    template: `n % 10        // last digit of n
Math.floor(n / 10)  // remove last digit
n % 5         // remainder after dividing by 5
Math.floor(n / 5)   // how many fives fit

// Dollar bills problem
function countBills(amount) {
  const tens = Math.floor(amount / 10)
  const remainder = amount % 10
  const fives = Math.floor(remainder / 5)
  const ones = remainder % 5
  return { tens, fives, ones }
}`,
    flowchartHint: "Is it about DIGITS / REMAINDERS / CONVERSION? → Yes → Math & Modulo",
  },
  {
    number: 2,
    name: "Arrays & Hashing",
    description:
      "Counting occurrences, finding duplicates, looking up values in O(1).",
    recognitionCues:
      'Problem asks about counts, duplicates, "has appeared before", or "most frequent."',
    template: `// Frequency counter template
const freq = {}
for (const num of nums) {
  freq[num] = (freq[num] || 0) + 1
}`,
    flowchartHint:
      "Does it ask about COUNTS / DUPLICATES / LOOKUPS? → Yes → HashMap / HashSet",
  },
  {
    number: 3,
    name: "Two Pointers",
    description:
      "Using two indices moving toward each other (or in the same direction) to avoid nested loops.",
    recognitionCues:
      'Sorted array + "find pair that sums to X" or "reverse" or "palindrome check."',
    template: `let left = 0
let right = nums.length - 1

while (left < right) {
  // do something with nums[left] and nums[right]
  if (condition) left++
  else right--
}`,
    flowchartHint:
      "Is the input SORTED? → Yes → Binary Search or Two Pointers",
  },
  {
    number: 4,
    name: "Sliding Window",
    description:
      'A subarray/substring of variable or fixed size that "slides" through the array.',
    recognitionCues:
      '"Longest substring", "maximum sum subarray of size k", "minimum window", "smallest subarray with sum ≥ X."',
    template: `// Fixed window of size k
let windowSum = 0
for (let i = 0; i < k; i++) windowSum += nums[i]

let maxSum = windowSum
for (let i = k; i < nums.length; i++) {
  windowSum += nums[i]       // add right
  windowSum -= nums[i - k]   // remove left
  maxSum = Math.max(maxSum, windowSum)
}

// Variable window
let left = 0
let maxLen = 0

for (let right = 0; right < s.length; right++) {
  // expand window: add s[right]

  while (/* window is invalid */) {
    // shrink window: remove s[left]
    left++
  }

  maxLen = Math.max(maxLen, right - left + 1)
}`,
    flowchartHint:
      "Does it ask about a SUBARRAY or SUBSTRING? → Yes → Sliding Window",
  },
  {
    number: 5,
    name: "Binary Search",
    description:
      "Efficiently finding a target in a sorted array by halving the search space each step. O(log n).",
    recognitionCues:
      'Sorted array, "find target", "search for position", "guess a number." Any problem where brute force is O(n) but array is sorted.',
    template: `function binarySearch(nums, target) {
  let left = 0
  let right = nums.length - 1

  while (left <= right) {           // NOTE: <= not <
    const mid = Math.floor((left + right) / 2)

    if (nums[mid] === target) return mid
    else if (nums[mid] < target) left = mid + 1
    else right = mid - 1
  }

  return -1  // not found
}`,
    flowchartHint:
      "Is the input SORTED? → Yes → Binary Search or Two Pointers",
  },
  {
    number: 6,
    name: "Strings",
    description: "String manipulation, parsing, character operations.",
    recognitionCues:
      "String-related operations, parsing, character manipulation, palindromes.",
    template: `s.split('')           // string to array of chars
s.split(' ')          // split by spaces
arr.join('')          // array back to string
s.toLowerCase()
s.toUpperCase()
s.includes('x')
s.indexOf('x')
s.slice(start, end)
s.replace('a', 'b')
s.trim()
s.charCodeAt(i)       // ASCII value
String.fromCharCode(n)`,
    flowchartHint: "String manipulation problem → Strings pattern",
  },
  {
    number: 7,
    name: "Stack & Queue",
    description: "Using a stack (LIFO) or queue (FIFO) to track state.",
    recognitionCues:
      'Matching brackets, "undo" operations, next greater element, anything where order of processing matters.',
    template: `// Stack template
const stack = []
stack.push(x)       // add to top
stack.pop()         // remove from top
stack[stack.length - 1]  // peek top`,
    flowchartHint:
      "Does it involve MATCHING / NESTING / UNDO? → Yes → Stack",
  },
  {
    number: 8,
    name: "Sorting + Greedy",
    description:
      "Sort first, then make locally optimal choices to reach a globally optimal solution.",
    recognitionCues:
      '"Minimum number of X", "can you achieve Y", scheduling problems, coin change variants.',
    template: `// Sort ascending
nums.sort((a, b) => a - b)

// Sort descending
nums.sort((a, b) => b - a)

// Sort strings
strs.sort((a, b) => a.localeCompare(b))`,
    flowchartHint:
      'Does it say "MINIMUM number of X" or involve SCHEDULING? → Yes → Sort + Greedy',
  },
  {
    number: 9,
    name: "Recursion & Basic Trees",
    description:
      "Functions that call themselves, often used for tree traversal.",
    recognitionCues:
      'Tree problems, "all combinations", "all subsets."',
    template: `// Tree traversal template
function dfs(node) {
  if (!node) return  // base case

  // do something with node.val
  dfs(node.left)     // recurse left
  dfs(node.right)    // recurse right
}`,
    flowchartHint:
      'Is it a TREE or asks for "ALL combinations"? → Yes → Recursion / DFS',
  },
  {
    number: 10,
    name: "Linked Lists",
    description:
      "Sequential data where each node points to the next. You can't index into it — you have to walk it.",
    recognitionCues:
      '"Given the head of a linked list...", cycle detection, merging sorted lists.',
    template: `// Traverse a linked list
let current = head
while (current) {
  // do something with current.val
  current = current.next
}

// Reverse a linked list (the classic)
function reverseList(head) {
  let prev = null
  let current = head
  while (current) {
    const next = current.next
    current.next = prev
    prev = current
    current = next
  }
  return prev
}`,
    flowchartHint:
      'Does it say "head of a linked list"? → Yes → Linked List pattern',
  },
];

// ─── Problem Seed Data ──────────────────────────────────────────────
// Maps pattern number → array of problems

const problems = [
  // Pattern 1: Math & Modulo
  { leetcodeNumber: 412, title: "Fizz Buzz", difficulty: "EASY" as const, url: "https://leetcode.com/problems/fizz-buzz/", patternNum: 1, isStarred: false, dayInPlan: 1, weekInPlan: 1 },
  { leetcodeNumber: 9, title: "Palindrome Number", difficulty: "EASY" as const, url: "https://leetcode.com/problems/palindrome-number/", patternNum: 1, isStarred: false, dayInPlan: 2, weekInPlan: 1 },
  { leetcodeNumber: 1323, title: "Maximum 69 Number", difficulty: "EASY" as const, url: "https://leetcode.com/problems/maximum-69-number/", patternNum: 1, isStarred: false, dayInPlan: 6, weekInPlan: 1 },
  { leetcodeNumber: 1342, title: "Number of Steps to Reduce to Zero", difficulty: "EASY" as const, url: "https://leetcode.com/problems/number-of-steps-to-reduce-a-number-to-zero/", patternNum: 1, isStarred: false, dayInPlan: null, weekInPlan: null },

  // Pattern 2: Arrays & Hashing
  { leetcodeNumber: 1, title: "Two Sum", difficulty: "EASY" as const, url: "https://leetcode.com/problems/two-sum/", patternNum: 2, isStarred: true, dayInPlan: 3, weekInPlan: 1 },
  { leetcodeNumber: 217, title: "Contains Duplicate", difficulty: "EASY" as const, url: "https://leetcode.com/problems/contains-duplicate/", patternNum: 2, isStarred: false, dayInPlan: 4, weekInPlan: 1 },
  { leetcodeNumber: 242, title: "Valid Anagram", difficulty: "EASY" as const, url: "https://leetcode.com/problems/valid-anagram/", patternNum: 2, isStarred: false, dayInPlan: 5, weekInPlan: 1 },
  { leetcodeNumber: 383, title: "Ransom Note", difficulty: "EASY" as const, url: "https://leetcode.com/problems/ransom-note/", patternNum: 2, isStarred: false, dayInPlan: 6, weekInPlan: 1 },
  { leetcodeNumber: 347, title: "Top K Frequent Elements", difficulty: "MEDIUM" as const, url: "https://leetcode.com/problems/top-k-frequent-elements/", patternNum: 2, isStarred: false, dayInPlan: 29, weekInPlan: 5 },

  // Pattern 3: Two Pointers
  { leetcodeNumber: 125, title: "Valid Palindrome", difficulty: "EASY" as const, url: "https://leetcode.com/problems/valid-palindrome/", patternNum: 3, isStarred: false, dayInPlan: 9, weekInPlan: 2 },
  { leetcodeNumber: 167, title: "Two Sum II", difficulty: "MEDIUM" as const, url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", patternNum: 3, isStarred: false, dayInPlan: 12, weekInPlan: 2 },
  { leetcodeNumber: 11, title: "Container With Most Water", difficulty: "MEDIUM" as const, url: "https://leetcode.com/problems/container-with-most-water/", patternNum: 3, isStarred: false, dayInPlan: null, weekInPlan: null },
  { leetcodeNumber: 15, title: "3Sum", difficulty: "MEDIUM" as const, url: "https://leetcode.com/problems/3sum/", patternNum: 3, isStarred: false, dayInPlan: 13, weekInPlan: 2 },

  // Pattern 4: Sliding Window
  { leetcodeNumber: 643, title: "Maximum Average Subarray I", difficulty: "EASY" as const, url: "https://leetcode.com/problems/maximum-average-subarray-i/", patternNum: 4, isStarred: false, dayInPlan: 15, weekInPlan: 3 },
  { leetcodeNumber: 209, title: "Minimum Size Subarray Sum", difficulty: "MEDIUM" as const, url: "https://leetcode.com/problems/minimum-size-subarray-sum/", patternNum: 4, isStarred: true, dayInPlan: 16, weekInPlan: 3 },
  { leetcodeNumber: 3, title: "Longest Substring Without Repeating Characters", difficulty: "MEDIUM" as const, url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", patternNum: 4, isStarred: true, dayInPlan: 17, weekInPlan: 3 },
  { leetcodeNumber: 424, title: "Longest Repeating Character Replacement", difficulty: "MEDIUM" as const, url: "https://leetcode.com/problems/longest-repeating-character-replacement/", patternNum: 4, isStarred: false, dayInPlan: 29, weekInPlan: 5 },

  // Pattern 5: Binary Search
  { leetcodeNumber: 704, title: "Binary Search", difficulty: "EASY" as const, url: "https://leetcode.com/problems/binary-search/", patternNum: 5, isStarred: true, dayInPlan: 18, weekInPlan: 3 },
  { leetcodeNumber: 35, title: "Search Insert Position", difficulty: "EASY" as const, url: "https://leetcode.com/problems/search-insert-position/", patternNum: 5, isStarred: false, dayInPlan: 19, weekInPlan: 3 },
  { leetcodeNumber: 374, title: "Guess Number Higher or Lower", difficulty: "EASY" as const, url: "https://leetcode.com/problems/guess-number-higher-or-lower/", patternNum: 5, isStarred: false, dayInPlan: 20, weekInPlan: 3 },

  // Pattern 6: Strings
  { leetcodeNumber: 344, title: "Reverse String", difficulty: "EASY" as const, url: "https://leetcode.com/problems/reverse-string/", patternNum: 6, isStarred: false, dayInPlan: 8, weekInPlan: 2 },
  { leetcodeNumber: 14, title: "Longest Common Prefix", difficulty: "EASY" as const, url: "https://leetcode.com/problems/longest-common-prefix/", patternNum: 6, isStarred: false, dayInPlan: 10, weekInPlan: 2 },
  { leetcodeNumber: 20, title: "Valid Parentheses", difficulty: "EASY" as const, url: "https://leetcode.com/problems/valid-parentheses/", patternNum: 6, isStarred: true, dayInPlan: 11, weekInPlan: 2 },
  { leetcodeNumber: 49, title: "Group Anagrams", difficulty: "MEDIUM" as const, url: "https://leetcode.com/problems/group-anagrams/", patternNum: 6, isStarred: false, dayInPlan: null, weekInPlan: null },

  // Pattern 7: Stack & Queue
  { leetcodeNumber: 155, title: "Min Stack", difficulty: "MEDIUM" as const, url: "https://leetcode.com/problems/min-stack/", patternNum: 7, isStarred: false, dayInPlan: null, weekInPlan: null },
  { leetcodeNumber: 150, title: "Evaluate Reverse Polish Notation", difficulty: "MEDIUM" as const, url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/", patternNum: 7, isStarred: false, dayInPlan: null, weekInPlan: null },

  // Pattern 8: Sorting + Greedy
  { leetcodeNumber: 455, title: "Assign Cookies", difficulty: "EASY" as const, url: "https://leetcode.com/problems/assign-cookies/", patternNum: 8, isStarred: false, dayInPlan: 22, weekInPlan: 4 },
  { leetcodeNumber: 860, title: "Lemonade Change", difficulty: "EASY" as const, url: "https://leetcode.com/problems/lemonade-change/", patternNum: 8, isStarred: true, dayInPlan: 23, weekInPlan: 4 },
  { leetcodeNumber: 56, title: "Merge Intervals", difficulty: "MEDIUM" as const, url: "https://leetcode.com/problems/merge-intervals/", patternNum: 8, isStarred: false, dayInPlan: 24, weekInPlan: 4 },
  { leetcodeNumber: 435, title: "Non-overlapping Intervals", difficulty: "MEDIUM" as const, url: "https://leetcode.com/problems/non-overlapping-intervals/", patternNum: 8, isStarred: false, dayInPlan: null, weekInPlan: null },

  // Pattern 9: Recursion & Basic Trees
  { leetcodeNumber: 104, title: "Maximum Depth of Binary Tree", difficulty: "EASY" as const, url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", patternNum: 9, isStarred: false, dayInPlan: 30, weekInPlan: 5 },
  { leetcodeNumber: 226, title: "Invert Binary Tree", difficulty: "EASY" as const, url: "https://leetcode.com/problems/invert-binary-tree/", patternNum: 9, isStarred: false, dayInPlan: 30, weekInPlan: 5 },
  { leetcodeNumber: 100, title: "Same Tree", difficulty: "EASY" as const, url: "https://leetcode.com/problems/same-tree/", patternNum: 9, isStarred: false, dayInPlan: 30, weekInPlan: 5 },

  // Pattern 10: Linked Lists
  { leetcodeNumber: 206, title: "Reverse Linked List", difficulty: "EASY" as const, url: "https://leetcode.com/problems/reverse-linked-list/", patternNum: 10, isStarred: true, dayInPlan: 25, weekInPlan: 4 },
  { leetcodeNumber: 21, title: "Merge Two Sorted Lists", difficulty: "EASY" as const, url: "https://leetcode.com/problems/merge-two-sorted-lists/", patternNum: 10, isStarred: true, dayInPlan: 26, weekInPlan: 4 },
  { leetcodeNumber: 141, title: "Linked List Cycle", difficulty: "EASY" as const, url: "https://leetcode.com/problems/linked-list-cycle/", patternNum: 10, isStarred: false, dayInPlan: 27, weekInPlan: 4 },
];

// ─── Main Seed Function ─────────────────────────────────────────────

export async function main() {
  console.log("🌱 Seeding database...\n");

  // Clear existing data in reverse dependency order
  await prisma.dailyCheckIn.deleteMany();
  await prisma.repetitionItem.deleteMany();
  await prisma.practiceLog.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.pattern.deleteMany();

  console.log("✅ Cleared existing data\n");

  // Seed patterns
  const patternMap: Record<number, string> = {};

  for (const p of patterns) {
    const created = await prisma.pattern.create({
      data: {
        number: p.number,
        name: p.name,
        description: p.description,
        recognitionCues: p.recognitionCues,
        template: p.template,
        flowchartHint: p.flowchartHint,
      },
    });
    patternMap[p.number] = created.id;
    console.log(`  📦 Pattern ${p.number}: ${p.name}`);
  }

  console.log(`\n✅ Seeded ${patterns.length} patterns\n`);

  // Seed problems
  let problemCount = 0;
  for (const prob of problems) {
    const patternId = patternMap[prob.patternNum];
    await prisma.problem.create({
      data: {
        leetcodeNumber: prob.leetcodeNumber,
        title: prob.title,
        difficulty: prob.difficulty,
        url: prob.url,
        patternId,
        isStarred: prob.isStarred,
        dayInPlan: prob.dayInPlan,
        weekInPlan: prob.weekInPlan,
      },
    });
    problemCount++;
    console.log(
      `  📝 #${prob.leetcodeNumber} ${prob.title} ${prob.isStarred ? "⭐" : ""}`
    );
  }

  console.log(`\n✅ Seeded ${problemCount} problems`);
  console.log("\n🎉 Database seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
