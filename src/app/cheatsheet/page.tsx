import AppLayout from "@/components/AppLayout";
import CodeBlock from "@/components/CodeBlock";

const sections = [
  { title: "Array", code: `arr.push(x)           // add to end\narr.pop()             // remove from end\narr.shift()           // remove from front\narr.unshift(x)        // add to front\narr.slice(i, j)       // copy subarray [i, j)\narr.splice(i, n)      // remove n elements at i\narr.includes(x)\narr.indexOf(x)\narr.reverse()\narr.flat()\narr.filter(fn)\narr.map(fn)\narr.reduce(fn, init)\narr.sort((a, b) => a - b)` },
  { title: "Math", code: `Math.floor(x)\nMath.ceil(x)\nMath.round(x)\nMath.abs(x)\nMath.max(...arr)\nMath.min(...arr)\nMath.pow(x, n)        // x^n\nx % y                 // modulo — YOUR NEW BEST FRIEND\nNumber.MAX_SAFE_INTEGER\nNumber.MIN_SAFE_INTEGER\nInfinity` },
  { title: "Strings", code: `s.split('')           // string to array of chars\ns.split(' ')          // split by spaces\narr.join('')          // array back to string\ns.toLowerCase()\ns.toUpperCase()\ns.includes('x')\ns.indexOf('x')\ns.slice(start, end)\ns.replace('a', 'b')\ns.trim()\ns.charCodeAt(i)       // ASCII value\nString.fromCharCode(n)` },
  { title: "Object / Map", code: `const map = new Map()\nmap.set(key, val)\nmap.get(key)\nmap.has(key)\nmap.delete(key)\nmap.size` },
  { title: "Set", code: `const set = new Set(arr)  // removes duplicates\nset.add(x)\nset.has(x)\nset.delete(x)\nset.size\n[...set]              // back to array` },
  { title: "Binary Search (Copy-Paste Starter)", code: `function binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2)\n    if (arr[mid] === target) return mid\n    else if (arr[mid] < target) lo = mid + 1\n    else hi = mid - 1\n  }\n  return -1\n}` },
  { title: "Linked List Node", code: `class ListNode {\n  constructor(val = 0, next = null) {\n    this.val = val\n    this.next = next\n  }\n}` },
];

export default function CheatsheetPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white">JS Cheatsheet</h1>
          <p className="mt-1 text-sm text-white/50">Copy-paste reference. Keep this open during practice until you don&apos;t need it anymore.</p>
        </div>
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-white/40">{section.title}</h2>
              <CodeBlock code={section.code} language="javascript" title={section.title} />
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
