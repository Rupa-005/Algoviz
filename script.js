// ═══════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════
let currentAlgo = 'bubble';
let array = [];
let steps = [];
let stepIdx = 0;
let running = false;
let paused = false;
let animTimer = null;
let startTime = 0;
let comparisons = 0;
let swaps = 0;
let speed = 5;
let arraySize = 20;

// LL state
let llList = [];
let llHead = 0;

// BST state
let bstRoot = null;

// Graph state
let graphNodes = [];
let graphEdges = [];
let graphVisited = [];

// ═══════════════════════════════════════════
//  ALGO METADATA
// ═══════════════════════════════════════════
const ALGOS = {
  bubble:     { title:'BUBBLE SORT',      time:'O(n²)',      space:'O(1)',    type:'Comparison',   file:'bubble_sort.js',       desc:'Repeatedly steps through the list, compares adjacent elements and swaps them if in the wrong order. Simple but inefficient for large datasets.' },
  selection:  { title:'SELECTION SORT',   time:'O(n²)',      space:'O(1)',    type:'Comparison',   file:'selection_sort.js',    desc:'Divides the list into sorted and unsorted regions, repeatedly selecting the minimum element from the unsorted region and placing it at the end of the sorted region.' },
  insertion:  { title:'INSERTION SORT',   time:'O(n²)',      space:'O(1)',    type:'Comparison',   file:'insertion_sort.js',    desc:'Builds the sorted array one item at a time, inserting each new element into its correct position among the already-sorted elements.' },
  merge:      { title:'MERGE SORT',       time:'O(n log n)', space:'O(n)',    type:'Divide & Conquer', file:'merge_sort.js',   desc:'Divides the array in half, recursively sorts each half, then merges the sorted halves. Guaranteed O(n log n) performance.' },
  quick:      { title:'QUICK SORT',       time:'O(n log n)', space:'O(log n)',type:'Divide & Conquer', file:'quick_sort.js',   desc:'Selects a pivot element and partitions the array around it. Elements smaller go left, larger go right, then recurses on both sides.' },
  linear:     { title:'LINEAR SEARCH',    time:'O(n)',       space:'O(1)',    type:'Search',       file:'linear_search.js',     desc:'Sequentially checks each element of the list until a match is found or the whole list has been searched.' },
  binary:     { title:'BINARY SEARCH',    time:'O(log n)',   space:'O(1)',    type:'Search',       file:'binary_search.js',     desc:'Efficiently finds an element in a sorted array by repeatedly halving the search interval. Requires a sorted array.' },
  linkedlist: { title:'LINKED LIST',      time:'O(n)',       space:'O(n)',    type:'Data Structure', file:'linked_list.js',    desc:'A linear data structure where elements (nodes) are stored in a sequence, each node pointing to the next. Supports insert, delete, and traversal operations.' },
  bst:        { title:'BINARY SEARCH TREE', time:'O(log n)', space:'O(n)',   type:'Data Structure', file:'bst.js',            desc:'A tree where each node has at most two children. Left child is always smaller, right child is always larger. Supports efficient search, insert, and delete.' },
  graph:      { title:'GRAPH BFS / DFS',  time:'O(V+E)',     space:'O(V)',   type:'Graph Traversal', file:'graph.js',         desc:'Breadth-First Search explores level by level using a queue. Depth-First Search explores as deep as possible using a stack or recursion.' },
  dijkstra:   { title:"DIJKSTRA'S ALGO",  time:'O(V²)',      space:'O(V)',   type:'Shortest Path',   file:'dijkstra.js',      desc:"Finds the shortest path from a source node to all other nodes in a weighted graph using a greedy approach with a priority queue." },
  slowfast:   { title:'SLOW & FAST POINTER', time:'O(n)',    space:'O(1)',   type:'Two Pointers',    file:'slow_fast.js',     desc:'Uses two pointers moving at different speeds to detect cycles in a linked list (Floyd\'s algorithm). Slow moves 1 step, fast moves 2 steps.' },
  treetraversal:{ title:'TREE TRAVERSALS',time:'O(n)',       space:'O(h)',   type:'Tree',            file:'tree_traversal.js',desc:'Pre-order (Root→Left→Right), In-order (Left→Root→Right), and Post-order (Left→Right→Root) depth-first traversals of a binary tree.' },
  treeheight: { title:'TREE HEIGHT',      time:'O(n)',       space:'O(h)',   type:'Tree',            file:'tree_height.js',   desc:'Computes the height (max depth) of a binary tree recursively. Height = 1 + max(height(left), height(right)).' },
  treediameter:{ title:'TREE DIAMETER',   time:'O(n)',       space:'O(h)',   type:'Tree',            file:'tree_diameter.js', desc:'Finds the longest path between any two nodes in a tree. At each node, diameter = left height + right height.' },
};

const CODES = {
  bubble: `<span class="cmt">// Bubble Sort - O(n²) time, O(1) space</span>
<span class="kw">function</span> <span class="fn">bubbleSort</span>(arr) {
  <span class="kw">const</span> n = arr.length;
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="num">0</span>; i < n - <span class="num">1</span>; i++) {
<span class="hl">    <span class="kw">for</span> (<span class="kw">let</span> j = <span class="num">0</span>; j < n - i - <span class="num">1</span>; j++) {</span>
<span class="hl">      <span class="kw">if</span> (arr[j] > arr[j + <span class="num">1</span>]) {</span>
        <span class="cmt">// Swap</span>
        [arr[j], arr[j+<span class="num">1</span>]] = [arr[j+<span class="num">1</span>], arr[j]];
      }
    }
  }
  <span class="kw">return</span> arr;
}`,
  selection: `<span class="cmt">// Selection Sort - O(n²) time, O(1) space</span>
<span class="kw">function</span> <span class="fn">selectionSort</span>(arr) {
  <span class="kw">const</span> n = arr.length;
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="num">0</span>; i < n - <span class="num">1</span>; i++) {
<span class="hl">    <span class="kw">let</span> minIdx = i;</span>
    <span class="kw">for</span> (<span class="kw">let</span> j = i + <span class="num">1</span>; j < n; j++) {
<span class="hl">      <span class="kw">if</span> (arr[j] < arr[minIdx]) minIdx = j;</span>
    }
    <span class="kw">if</span> (minIdx !== i)
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  <span class="kw">return</span> arr;
}`,
  insertion: `<span class="cmt">// Insertion Sort - O(n²) time, O(1) space</span>
<span class="kw">function</span> <span class="fn">insertionSort</span>(arr) {
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="num">1</span>; i < arr.length; i++) {
<span class="hl">    <span class="kw">let</span> key = arr[i], j = i - <span class="num">1</span>;</span>
<span class="hl">    <span class="kw">while</span> (j >= <span class="num">0</span> && arr[j] > key) {</span>
      arr[j + <span class="num">1</span>] = arr[j];
      j--;
    }
    arr[j + <span class="num">1</span>] = key;
  }
  <span class="kw">return</span> arr;
}`,
  merge: `<span class="cmt">// Merge Sort - O(n log n) time, O(n) space</span>
<span class="kw">function</span> <span class="fn">mergeSort</span>(arr, l, r) {
  <span class="kw">if</span> (l >= r) <span class="kw">return</span>;
<span class="hl">  <span class="kw">const</span> mid = Math.<span class="fn">floor</span>((l + r) / <span class="num">2</span>);</span>
  <span class="fn">mergeSort</span>(arr, l, mid);
  <span class="fn">mergeSort</span>(arr, mid+<span class="num">1</span>, r);
<span class="hl">  <span class="fn">merge</span>(arr, l, mid, r); <span class="cmt">// merge halves</span></span>
}
<span class="kw">function</span> <span class="fn">merge</span>(arr, l, mid, r) {
  <span class="kw">const</span> left = arr.slice(l, mid+<span class="num">1</span>);
  <span class="kw">const</span> right = arr.slice(mid+<span class="num">1</span>, r+<span class="num">1</span>);
  <span class="kw">let</span> i=<span class="num">0</span>,j=<span class="num">0</span>,k=l;
  <span class="kw">while</span>(i<left.length&&j<right.length)
    arr[k++]=left[i]<=right[j]?left[i++]:right[j++];
  <span class="kw">while</span>(i<left.length) arr[k++]=left[i++];
  <span class="kw">while</span>(j<right.length) arr[k++]=right[j++];
}`,
  quick: `<span class="cmt">// Quick Sort - O(n log n) avg, O(n²) worst</span>
<span class="kw">function</span> <span class="fn">quickSort</span>(arr, lo, hi) {
  <span class="kw">if</span> (lo < hi) {
<span class="hl">    <span class="kw">const</span> p = <span class="fn">partition</span>(arr, lo, hi);</span>
    <span class="fn">quickSort</span>(arr, lo, p - <span class="num">1</span>);
    <span class="fn">quickSort</span>(arr, p + <span class="num">1</span>, hi);
  }
}
<span class="kw">function</span> <span class="fn">partition</span>(arr, lo, hi) {
<span class="hl">  <span class="kw">const</span> pivot = arr[hi]; <span class="cmt">// last element</span></span>
  <span class="kw">let</span> i = lo - <span class="num">1</span>;
  <span class="kw">for</span> (<span class="kw">let</span> j=lo; j<hi; j++) {
    <span class="kw">if</span> (arr[j] <= pivot)
      [arr[++i],arr[j]]=[arr[j],arr[i]];
  }
  [arr[i+<span class="num">1</span>],arr[hi]]=[arr[hi],arr[i+<span class="num">1</span>]];
  <span class="kw">return</span> i + <span class="num">1</span>;
}`,
  linear: `<span class="cmt">// Linear Search - O(n) time, O(1) space</span>
<span class="kw">function</span> <span class="fn">linearSearch</span>(arr, target) {
  <span class="kw">for</span> (<span class="kw">let</span> i = <span class="num">0</span>; i < arr.length; i++) {
<span class="hl">    <span class="kw">if</span> (arr[i] === target) {</span>
      <span class="kw">return</span> i; <span class="cmt">// found!</span>
    }
  }
  <span class="kw">return</span> -<span class="num">1</span>; <span class="cmt">// not found</span>
}`,
  binary: `<span class="cmt">// Binary Search - O(log n), requires sorted array</span>
<span class="kw">function</span> <span class="fn">binarySearch</span>(arr, target) {
  <span class="kw">let</span> lo = <span class="num">0</span>, hi = arr.length - <span class="num">1</span>;
  <span class="kw">while</span> (lo <= hi) {
<span class="hl">    <span class="kw">const</span> mid = Math.<span class="fn">floor</span>((lo + hi) / <span class="num">2</span>);</span>
<span class="hl">    <span class="kw">if</span> (arr[mid] === target) <span class="kw">return</span> mid;</span>
    <span class="kw">else if</span> (arr[mid] < target) lo = mid + <span class="num">1</span>;
    <span class="kw">else</span> hi = mid - <span class="num">1</span>;
  }
  <span class="kw">return</span> -<span class="num">1</span>;
}`,
  linkedlist: `<span class="cmt">// Singly Linked List</span>
<span class="kw">class</span> <span class="fn">Node</span> {
  <span class="fn">constructor</span>(val) {
    <span class="kw">this</span>.val = val;
    <span class="kw">this</span>.next = <span class="kw">null</span>;
  }
}
<span class="kw">class</span> <span class="fn">LinkedList</span> {
<span class="hl">  <span class="fn">insertHead</span>(val) {</span>
    <span class="kw">const</span> node = <span class="kw">new</span> <span class="fn">Node</span>(val);
    node.next = <span class="kw">this</span>.head;
    <span class="kw">this</span>.head = node;
  }
<span class="hl">  <span class="fn">insertTail</span>(val) {</span>
    <span class="kw">let</span> curr = <span class="kw">this</span>.head;
    <span class="kw">while</span> (curr.next) curr = curr.next;
    curr.next = <span class="kw">new</span> <span class="fn">Node</span>(val);
  }
  <span class="fn">delete</span>(val) {
    <span class="kw">let</span> curr = <span class="kw">this</span>.head, prev = <span class="kw">null</span>;
    <span class="kw">while</span> (curr && curr.val !== val) {
      prev = curr; curr = curr.next;
    }
    <span class="kw">if</span> (prev) prev.next = curr.next;
    <span class="kw">else this</span>.head = curr.next;
  }
}`,
  bst: `<span class="cmt">// Binary Search Tree</span>
<span class="kw">class</span> <span class="fn">BST</span> {
<span class="hl">  <span class="fn">insert</span>(val) {</span>
    <span class="kw">this</span>.root = <span class="fn">_insert</span>(<span class="kw">this</span>.root, val);
  }
}
<span class="kw">function</span> <span class="fn">_insert</span>(node, val) {
  <span class="kw">if</span> (!node) <span class="kw">return new</span> <span class="fn">Node</span>(val);
<span class="hl">  <span class="kw">if</span> (val < node.val)</span>
    node.left = <span class="fn">_insert</span>(node.left, val);
  <span class="kw">else if</span> (val > node.val)
    node.right = <span class="fn">_insert</span>(node.right, val);
  <span class="kw">return</span> node;
}
<span class="cmt">// In-Order Traversal (Left → Root → Right)</span>
<span class="kw">function</span> <span class="fn">inOrder</span>(node, result=[]) {
  <span class="kw">if</span> (!node) <span class="kw">return</span> result;
<span class="hl">  <span class="fn">inOrder</span>(node.left, result);</span>
  result.push(node.val);
  <span class="fn">inOrder</span>(node.right, result);
  <span class="kw">return</span> result;
}`,
  graph: `<span class="cmt">// BFS - uses a Queue, explores level by level</span>
<span class="kw">function</span> <span class="fn">bfs</span>(graph, start) {
<span class="hl">  <span class="kw">const</span> queue = [start], visited = <span class="kw">new</span> Set([start]);</span>
  <span class="kw">while</span> (queue.length) {
<span class="hl">    <span class="kw">const</span> node = queue.<span class="fn">shift</span>(); <span class="cmt">// dequeue</span></span>
    <span class="kw">for</span> (<span class="kw">const</span> neighbor <span class="kw">of</span> graph[node]) {
      <span class="kw">if</span> (!visited.<span class="fn">has</span>(neighbor)) {
        visited.<span class="fn">add</span>(neighbor);
        queue.<span class="fn">push</span>(neighbor);
      }
    }
  }
}
<span class="cmt">// DFS - uses a Stack (or recursion)</span>
<span class="kw">function</span> <span class="fn">dfs</span>(graph, node, visited=<span class="kw">new</span> Set()) {
<span class="hl">  visited.<span class="fn">add</span>(node);</span>
  <span class="kw">for</span> (<span class="kw">const</span> n <span class="kw">of</span> graph[node])
    <span class="kw">if</span> (!visited.<span class="fn">has</span>(n)) <span class="fn">dfs</span>(graph, n, visited);
}`,
  dijkstra: `<span class="cmt">// Dijkstra's - O(V²) with array, O((V+E)logV) with heap</span>
<span class="kw">function</span> <span class="fn">dijkstra</span>(graph, src) {
  <span class="kw">const</span> dist = {}, visited = <span class="kw">new</span> Set();
  <span class="kw">for</span> (<span class="kw">const</span> node <span class="kw">of</span> Object.<span class="fn">keys</span>(graph))
    dist[node] = Infinity;
<span class="hl">  dist[src] = <span class="num">0</span>;</span>
  <span class="kw">while</span> (visited.size < Object.<span class="fn">keys</span>(graph).length) {
<span class="hl">    <span class="cmt">// pick unvisited node with min dist</span>
    <span class="kw">const</span> u = Object.<span class="fn">keys</span>(dist)
      .<span class="fn">filter</span>(n => !visited.<span class="fn">has</span>(n))
      .<span class="fn">reduce</span>((a,b) => dist[a]<dist[b]?a:b);</span>
    visited.<span class="fn">add</span>(u);
    <span class="kw">for</span> (<span class="kw">const</span> [v, w] <span class="kw">of</span> graph[u]) {
<span class="hl">      <span class="kw">if</span> (dist[u] + w < dist[v]) dist[v] = dist[u] + w;</span>
    }
  }
  <span class="kw">return</span> dist;
}`,
  slowfast: `<span class="cmt">// Floyd's Cycle Detection - O(n) time, O(1) space</span>
<span class="kw">function</span> <span class="fn">hasCycle</span>(head) {
<span class="hl">  <span class="kw">let</span> slow = head, fast = head;</span>
  <span class="kw">while</span> (fast && fast.next) {
<span class="hl">    slow = slow.next;       <span class="cmt">// 1 step</span></span>
<span class="hl">    fast = fast.next.next;  <span class="cmt">// 2 steps</span></span>
    <span class="kw">if</span> (slow === fast) <span class="kw">return true</span>; <span class="cmt">// cycle!</span>
  }
  <span class="kw">return false</span>;
}
<span class="cmt">// Find middle of linked list</span>
<span class="kw">function</span> <span class="fn">findMiddle</span>(head) {
  <span class="kw">let</span> slow = head, fast = head;
  <span class="kw">while</span> (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  <span class="kw">return</span> slow; <span class="cmt">// slow is at middle</span>
}`,
  treetraversal: `<span class="cmt">// Pre-order: Root → Left → Right</span>
<span class="kw">function</span> <span class="fn">preOrder</span>(node, res=[]) {
<span class="hl">  <span class="kw">if</span> (!node) <span class="kw">return</span> res;</span>
  res.<span class="fn">push</span>(node.val);      <span class="cmt">// visit root first</span>
  <span class="fn">preOrder</span>(node.left, res);
  <span class="fn">preOrder</span>(node.right, res);
  <span class="kw">return</span> res;
}
<span class="cmt">// In-order: Left → Root → Right</span>
<span class="kw">function</span> <span class="fn">inOrder</span>(node, res=[]) {
  <span class="kw">if</span> (!node) <span class="kw">return</span> res;
  <span class="fn">inOrder</span>(node.left, res);
<span class="hl">  res.<span class="fn">push</span>(node.val);      <span class="cmt">// visit root in middle</span></span>
  <span class="fn">inOrder</span>(node.right, res);
  <span class="kw">return</span> res;
}
<span class="cmt">// Post-order: Left → Right → Root</span>
<span class="kw">function</span> <span class="fn">postOrder</span>(node, res=[]) {
  <span class="kw">if</span> (!node) <span class="kw">return</span> res;
  <span class="fn">postOrder</span>(node.left, res);
  <span class="fn">postOrder</span>(node.right, res);
<span class="hl">  res.<span class="fn">push</span>(node.val);      <span class="cmt">// visit root last</span></span>
  <span class="kw">return</span> res;
}`,
  treeheight: `<span class="cmt">// Tree Height - max depth from root to any leaf</span>
<span class="kw">function</span> <span class="fn">height</span>(node) {
<span class="hl">  <span class="kw">if</span> (!node) <span class="kw">return</span> <span class="num">0</span>; <span class="cmt">// base case</span></span>
  <span class="kw">const</span> leftH  = <span class="fn">height</span>(node.left);
  <span class="kw">const</span> rightH = <span class="fn">height</span>(node.right);
<span class="hl">  <span class="kw">return</span> <span class="num">1</span> + Math.<span class="fn">max</span>(leftH, rightH);</span>
}
<span class="cmt">// Count nodes at each level (BFS)</span>
<span class="kw">function</span> <span class="fn">levelCount</span>(root) {
  <span class="kw">const</span> q = [root], levels = [];
  <span class="kw">while</span> (q.length) {
    <span class="kw">const</span> size = q.length;
    <span class="kw">const</span> level = [];
<span class="hl">    <span class="kw">for</span> (<span class="kw">let</span> i=<span class="num">0</span>; i<size; i++) {</span>
      <span class="kw">const</span> n = q.<span class="fn">shift</span>();
      level.<span class="fn">push</span>(n.val);
      <span class="kw">if</span> (n.left) q.<span class="fn">push</span>(n.left);
      <span class="kw">if</span> (n.right) q.<span class="fn">push</span>(n.right);
    }
    levels.<span class="fn">push</span>(level);
  }
  <span class="kw">return</span> levels;
}`,
  treediameter: `<span class="cmt">// Tree Diameter - longest path between any 2 nodes</span>
<span class="kw">let</span> maxDiam = <span class="num">0</span>;
<span class="kw">function</span> <span class="fn">diameter</span>(root) {
  maxDiam = <span class="num">0</span>;
  <span class="fn">dfs</span>(root);
  <span class="kw">return</span> maxDiam;
}
<span class="kw">function</span> <span class="fn">dfs</span>(node) {
  <span class="kw">if</span> (!node) <span class="kw">return</span> <span class="num">0</span>;
  <span class="kw">const</span> left  = <span class="fn">dfs</span>(node.left);
  <span class="kw">const</span> right = <span class="fn">dfs</span>(node.right);
<span class="hl">  <span class="cmt">// path through this node</span>
  maxDiam = Math.<span class="fn">max</span>(maxDiam, left + right);</span>
<span class="hl">  <span class="kw">return</span> <span class="num">1</span> + Math.<span class="fn">max</span>(left, right);</span>
}`,
};

// ═══════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════
function init() {
  generateData();
  loadAlgo('bubble');
}

function loadAlgo(name) {
  currentAlgo = name;
  document.querySelectorAll('.algo-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('btn-' + name);
  if (btn) btn.classList.add('active');
  resetAlgo();
  const meta = ALGOS[name];
  document.getElementById('algoTitle').textContent = meta.title;
  document.getElementById('algoDesc').textContent = meta.desc;
  document.getElementById('algoMeta').innerHTML = `
    <div class="meta-chip time">⏱ Time: ${meta.time}</div>
    <div class="meta-chip space">◻ Space: ${meta.space}</div>
    <div class="meta-chip type">⬡ Type: ${meta.type}</div>`;
  document.getElementById('codeTitle').textContent = '// ' + meta.file;
  document.getElementById('codeBlock').innerHTML = CODES[name] || '';
  document.getElementById('extraControls').innerHTML = '';
  document.getElementById('sizeSlider').parentElement.style.display =
    ['linkedlist','bst','graph','dijkstra','slowfast','treetraversal','treeheight','treediameter'].includes(name) ? 'none' : 'flex';

  if (name === 'linkedlist') setupLinkedList();
  else if (name === 'bst') setupBST();
  else if (name === 'graph') setupGraph();
  else if (name === 'dijkstra') setupDijkstra();
  else if (name === 'slowfast') setupSlowFast();
  else if (name === 'treetraversal') setupTreeTraversal();
  else if (name === 'treeheight') setupTreeHeight();
  else if (name === 'treediameter') setupTreeDiameter();
  else { generateData(); renderBars(); }

  addLog('Loaded: ' + meta.title, 'info');
  setStatus('READY');
}

// ═══════════════════════════════════════════
//  DATA GENERATION
// ═══════════════════════════════════════════
function generateData() {
  if (['linkedlist','bst','graph','dijkstra','slowfast','treetraversal','treeheight','treediameter'].includes(currentAlgo)) return;
  array = [];
  const n = arraySize;
  for (let i = 0; i < n; i++) array.push(Math.floor(Math.random() * 90) + 10);
  if (currentAlgo === 'binary') array.sort((a,b) => a - b);
  steps = []; stepIdx = 0; comparisons = 0; swaps = 0;
  updateStats();
  renderBars();
  document.getElementById('progressFill').style.width = '0%';
}

// ═══════════════════════════════════════════
//  BAR RENDERING
// ═══════════════════════════════════════════
function renderBars(highlights = {}) {
  const container = document.getElementById('vizContent');
  container.innerHTML = '';
  container.style.display = 'flex';
  container.style.alignItems = 'flex-end';
  container.style.justifyContent = 'center';
  container.style.padding = '2rem 2rem 0';
  container.style.gap = '3px';
  const maxVal = Math.max(...array);
  const maxH = 320;
  array.forEach((val, i) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = Math.max(12, (val / maxVal) * maxH) + 'px';
    bar.setAttribute('data-val', val);
    if (highlights.comparing && highlights.comparing.includes(i)) bar.classList.add('comparing');
    if (highlights.swapping && highlights.swapping.includes(i)) bar.classList.add('swapping');
    if (highlights.sorted && highlights.sorted.includes(i)) bar.classList.add('sorted');
    if (highlights.pivot === i) bar.classList.add('pivot');
    container.appendChild(bar);
  });
}

// ═══════════════════════════════════════════
//  STEP GENERATION
// ═══════════════════════════════════════════
function buildSteps() {
  const arr = [...array];
  steps = [];
  const sortedSet = new Set();

  function record(type, indices, arr, msg, extra = {}) {
    steps.push({ type, indices, arr: [...arr], msg, extra, sorted: new Set(sortedSet) });
  }

  if (currentAlgo === 'bubble') {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        record('compare', [j, j+1], arr, `Comparing arr[${j}]=${arr[j]} and arr[${j+1}]=${arr[j+1]}`);
        if (arr[j] > arr[j+1]) {
          [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
          record('swap', [j, j+1], arr, `Swapped → arr[${j}]=${arr[j]}, arr[${j+1}]=${arr[j+1]}`);
        }
      }
      sortedSet.add(n - 1 - i);
      record('sorted', [n-1-i], arr, `Index ${n-1-i} is now in correct position`);
    }
    sortedSet.add(0);
    record('done', [], arr, 'Array fully sorted!');
  }

  else if (currentAlgo === 'selection') {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      record('pivot', [i, minIdx], arr, `Looking for minimum from index ${i}`);
      for (let j = i + 1; j < n; j++) {
        record('compare', [minIdx, j], arr, `Comparing arr[${j}]=${arr[j]} with current min arr[${minIdx}]=${arr[minIdx]}`);
        if (arr[j] < arr[minIdx]) { minIdx = j; record('compare', [minIdx, j], arr, `New minimum: arr[${minIdx}]=${arr[minIdx]}`); }
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        record('swap', [i, minIdx], arr, `Swapped minimum to position ${i}`);
      }
      sortedSet.add(i);
      record('sorted', [i], arr, `Index ${i} sorted`);
    }
    sortedSet.add(n-1); record('done', [], arr, 'Selection Sort complete!');
  }

  else if (currentAlgo === 'insertion') {
    const n = arr.length;
    sortedSet.add(0);
    for (let i = 1; i < n; i++) {
      let key = arr[i], j = i - 1;
      record('compare', [i], arr, `Inserting arr[${i}]=${key} into sorted section`);
      while (j >= 0 && arr[j] > key) {
        record('compare', [j, j+1], arr, `arr[${j}]=${arr[j]} > ${key}, shifting right`);
        arr[j+1] = arr[j];
        record('swap', [j, j+1], arr, `Shifted arr[${j}] to position ${j+1}`);
        j--;
      }
      arr[j+1] = key;
      sortedSet.add(i);
      record('sorted', [j+1], arr, `Placed ${key} at index ${j+1}`);
    }
    record('done', [], arr, 'Insertion Sort complete!');
  }

  else if (currentAlgo === 'merge') {
    function mergeRec(arr, l, r) {
      if (l >= r) return;
      const mid = Math.floor((l + r) / 2);
      record('compare', [l, mid], arr, `Dividing: left[${l}..${mid}] right[${mid+1}..${r}]`);
      mergeRec(arr, l, mid);
      mergeRec(arr, mid+1, r);
      const left = arr.slice(l, mid+1), right = arr.slice(mid+1, r+1);
      let i = 0, j = 0, k = l;
      while (i < left.length && j < right.length) {
        record('compare', [k, mid+1+j], arr, `Merging: ${left[i]} vs ${right[j]}`);
        if (left[i] <= right[j]) { arr[k++] = left[i++]; }
        else { arr[k++] = right[j++]; record('swap', [k-1], arr, `Picked from right subarray`); }
      }
      while (i < left.length) arr[k++] = left[i++];
      while (j < right.length) arr[k++] = right[j++];
      for (let x = l; x <= r; x++) sortedSet.add(x);
      record('sorted', Array.from({length:r-l+1},(_,x)=>l+x), arr, `Merged segment [${l}..${r}]`);
    }
    mergeRec(arr, 0, arr.length - 1);
    record('done', [], arr, 'Merge Sort complete!');
  }

  else if (currentAlgo === 'quick') {
    function quickRec(arr, lo, hi) {
      if (lo >= hi) return;
      const pivot = arr[hi];
      record('pivot', [hi], arr, `Pivot: arr[${hi}]=${pivot}`);
      let i = lo - 1;
      for (let j = lo; j < hi; j++) {
        record('compare', [j, hi], arr, `Comparing arr[${j}]=${arr[j]} with pivot ${pivot}`);
        if (arr[j] <= pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          if (i !== j) record('swap', [i, j], arr, `Swapped arr[${i}] and arr[${j}]`);
        }
      }
      [arr[i+1], arr[hi]] = [arr[hi], arr[i+1]];
      const pi = i + 1;
      sortedSet.add(pi);
      record('sorted', [pi], arr, `Pivot ${pivot} placed at index ${pi}`);
      quickRec(arr, lo, pi - 1);
      quickRec(arr, pi + 1, hi);
    }
    quickRec(arr, 0, arr.length - 1);
    record('done', [], arr, 'Quick Sort complete!');
  }

  else if (currentAlgo === 'linear') {
    const target = arr[Math.floor(Math.random() * arr.length)];
    record('compare', [], arr, `Searching for target: ${target}`, { target });
    for (let i = 0; i < arr.length; i++) {
      record('compare', [i], arr, `Checking arr[${i}]=${arr[i]}`, { target });
      if (arr[i] === target) {
        sortedSet.add(i);
        record('done', [i], arr, `Found ${target} at index ${i}!`, { target });
        break;
      }
    }
  }

  else if (currentAlgo === 'binary') {
    const sortedArr = [...arr].sort((a,b) => a - b);
    array = sortedArr;
    const target = sortedArr[Math.floor(Math.random() * sortedArr.length)];
    let lo = 0, hi = sortedArr.length - 1;
    record('compare', [], sortedArr, `Binary Search for target: ${target}`, { target, lo, hi });
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      record('compare', [lo, mid, hi], sortedArr, `lo=${lo}, mid=${mid}, hi=${hi} → arr[mid]=${sortedArr[mid]}`, { target, lo, mid, hi });
      if (sortedArr[mid] === target) {
        sortedSet.add(mid);
        record('done', [mid], sortedArr, `Found ${target} at index ${mid}!`, { target });
        break;
      } else if (sortedArr[mid] < target) {
        lo = mid + 1;
        record('compare', [mid], sortedArr, `${sortedArr[mid]} < ${target}, search right half`, { target, lo, hi });
      } else {
        hi = mid - 1;
        record('compare', [mid], sortedArr, `${sortedArr[mid]} > ${target}, search left half`, { target, lo, hi });
      }
    }
  }
}

// ═══════════════════════════════════════════
//  ANIMATION RUNNER
// ═══════════════════════════════════════════
function startAlgo() {
  if (['linkedlist','bst','graph','dijkstra','slowfast','treetraversal','treeheight','treediameter'].includes(currentAlgo)) return;
  if (paused) { paused = false; runSteps(); document.getElementById('btnPlay').disabled = true; document.getElementById('btnPause').disabled = false; return; }
  buildSteps();
  stepIdx = 0; comparisons = 0; swaps = 0; running = true; paused = false;
  startTime = Date.now();
  document.getElementById('btnPlay').disabled = true;
  document.getElementById('btnPause').disabled = false;
  setStatus('RUNNING');
  runSteps();
}

function runSteps() {
  if (!running || paused || stepIdx >= steps.length) {
    if (stepIdx >= steps.length) {
      running = false;
      document.getElementById('btnPlay').disabled = false;
      document.getElementById('btnPause').disabled = true;
      setStatus('DONE');
    }
    return;
  }
  const s = steps[stepIdx];
  array = [...s.arr];
  const hl = {};
  if (s.type === 'compare') { hl.comparing = s.indices; comparisons++; }
  if (s.type === 'swap') { hl.swapping = s.indices; swaps++; }
  if (s.type === 'sorted') hl.sorted = Array.from(s.sorted);
  if (s.type === 'pivot') hl.pivot = s.indices[0];
  if (s.type === 'done') hl.sorted = s.arr.map((_,i) => i);
  renderBars(hl);
  addLog(s.msg, s.type === 'done' ? 'done' : s.type === 'swap' ? 'swap' : s.type === 'compare' ? 'compare' : 'step');
  updateStats();
  document.getElementById('progressFill').style.width = (stepIdx / steps.length * 100) + '%';
  stepIdx++;
  const delay = Math.max(20, 400 / speed);
  animTimer = setTimeout(runSteps, delay);
}

function pauseAlgo() {
  paused = !paused;
  document.getElementById('btnPause').textContent = paused ? '▶ RESUME' : '⏸ PAUSE';
  document.getElementById('btnPlay').disabled = !paused;
  setStatus(paused ? 'PAUSED' : 'RUNNING');
  if (!paused) runSteps();
}

function resetAlgo() {
  clearTimeout(animTimer);
  running = false; paused = false; stepIdx = 0; comparisons = 0; swaps = 0;
  document.getElementById('btnPlay').disabled = false;
  document.getElementById('btnPause').disabled = true;
  document.getElementById('btnPause').textContent = '⏸ PAUSE';
  document.getElementById('progressFill').style.width = '0%';
  if (!['linkedlist','bst','graph','dijkstra','slowfast','treetraversal','treeheight','treediameter'].includes(currentAlgo)) { generateData(); renderBars(); }
  updateStats(); setStatus('READY');
}

// ═══════════════════════════════════════════
//  LINKED LIST
// ═══════════════════════════════════════════
function setupLinkedList() {
  llList = [42, 17, 88, 33, 65];
  document.getElementById('extraControls').innerHTML = `
    <div style="display:flex;gap:.6rem;align-items:center;flex-wrap:wrap">
      <input class="ll-input" id="llVal" type="number" placeholder="value" min="1" max="99">
      <button class="ctrl-btn btn-gen" onclick="llInsertHead()">+HEAD</button>
      <button class="ctrl-btn btn-gen" onclick="llInsertTail()">+TAIL</button>
      <button class="ctrl-btn btn-reset" onclick="llDelete()">DELETE</button>
      <button class="ctrl-btn btn-play" onclick="llTraverse()">TRAVERSE</button>
    </div>`;
  renderLL();
}

function renderLL(highlight = -1) {
  const c = document.getElementById('vizContent');
  c.innerHTML = '';
  c.style.display = 'flex';
  c.style.alignItems = 'center';
  c.style.justifyContent = 'center';
  c.style.padding = '2rem';
  c.style.flexWrap = 'wrap';
  c.style.gap = '0';
  llList.forEach((val, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'll-node';
    wrap.style.animationDelay = (i * 0.05) + 's';
    const box = document.createElement('div');
    box.className = 'node-box' + (i === 0 ? ' head-node' : '') + (i === highlight ? ' highlight' : '');
    box.innerHTML = `<div class="nval">${val}</div><div class="nlabel">${i===0?'HEAD':'node'}</div>`;
    wrap.appendChild(box);
    if (i < llList.length - 1) {
      const arrow = document.createElement('div');
      arrow.className = 'node-arrow';
      arrow.textContent = ' → ';
      wrap.appendChild(arrow);
    }
    c.appendChild(wrap);
  });
  const nullWrap = document.createElement('div');
  nullWrap.className = 'll-node';
  nullWrap.innerHTML = `<div class="node-arrow"> → </div><div class="node-null">NULL</div>`;
  c.appendChild(nullWrap);
}

function llInsertHead() {
  const v = parseInt(document.getElementById('llVal').value);
  if (!v) return;
  llList.unshift(v);
  addLog(`Inserted ${v} at HEAD`, 'step');
  renderLL(0);
}
function llInsertTail() {
  const v = parseInt(document.getElementById('llVal').value);
  if (!v) return;
  llList.push(v);
  addLog(`Inserted ${v} at TAIL`, 'step');
  renderLL(llList.length - 1);
}
function llDelete() {
  const v = parseInt(document.getElementById('llVal').value);
  const idx = llList.indexOf(v);
  if (idx === -1) { addLog(`Value ${v} not found`, 'compare'); return; }
  llList.splice(idx, 1);
  addLog(`Deleted node with value ${v}`, 'swap');
  renderLL();
}
async function llTraverse() {
  addLog('Traversing list...', 'info');
  for (let i = 0; i < llList.length; i++) {
    renderLL(i);
    addLog(`Visiting node[${i}] = ${llList[i]}`, 'compare');
    await sleep(400);
  }
  renderLL(-1);
  addLog('Traversal complete!', 'done');
}

// ═══════════════════════════════════════════
//  BST
// ═══════════════════════════════════════════
function setupBST() {
  bstRoot = null;
  const vals = [50, 30, 70, 20, 40, 60, 80, 10, 35];
  document.getElementById('extraControls').innerHTML = `
    <div style="display:flex;gap:.6rem;align-items:center;flex-wrap:wrap">
      <input class="ll-input" id="bstVal" type="number" placeholder="value" min="1" max="99">
      <button class="ctrl-btn btn-gen" onclick="bstInsertUI()">INSERT</button>
      <button class="ctrl-btn btn-play" onclick="bstInorder()">IN-ORDER</button>
      <button class="ctrl-btn btn-pause" onclick="bstLevelOrder()">LEVEL-ORDER</button>
      <button class="ctrl-btn btn-reset" onclick="bstReset()">RESET</button>
    </div>`;
  vals.forEach(v => bstRoot = bstInsert(bstRoot, v));
  renderBST();
}

function bstInsert(node, val) {
  if (!node) return { val, left: null, right: null };
  if (val < node.val) node.left = bstInsert(node.left, val);
  else if (val > node.val) node.right = bstInsert(node.right, val);
  return node;
}

function renderBST(traversed = new Set(), current = null) {
  const c = document.getElementById('vizContent');
  c.innerHTML = '';
  c.style.display = 'flex';
  c.style.alignItems = 'flex-start';
  c.style.justifyContent = 'center';
  c.style.padding = '1.5rem';
  c.style.overflow = 'auto';
  if (!bstRoot) { c.innerHTML = '<div style="color:var(--muted);margin:auto">Empty tree</div>'; return; }
  c.appendChild(buildTreeDOM(bstRoot, traversed, current));
}

function buildTreeDOM(node, traversed, current) {
  if (!node) return document.createElement('div');
  const wrap = document.createElement('div');
  wrap.className = 'tree-node-wrap';
  const box = document.createElement('div');
  box.className = 'tree-box' + (traversed.has(node.val) ? ' traversed' : '') + (current === node.val ? ' current' : '');
  box.textContent = node.val;
  wrap.appendChild(box);
  if (node.left || node.right) {
    const conn = document.createElement('div');
    conn.className = 'tree-connector' + (node.left ? ' has-left' : '') + (node.right ? ' has-right' : '');
    wrap.appendChild(conn);
    const children = document.createElement('div');
    children.className = 'tree-children';
    if (node.left) children.appendChild(buildTreeDOM(node.left, traversed, current));
    if (node.right) children.appendChild(buildTreeDOM(node.right, traversed, current));
    wrap.appendChild(children);
  }
  return wrap;
}

function bstInsertUI() {
  const v = parseInt(document.getElementById('bstVal').value);
  if (!v) return;
  bstRoot = bstInsert(bstRoot, v);
  addLog(`Inserted ${v} into BST`, 'step');
  renderBST();
}

async function bstInorder() {
  const result = [];
  const traversed = new Set();
  async function inOrder(node) {
    if (!node) return;
    await inOrder(node.left);
    traversed.add(node.val);
    renderBST(traversed, node.val);
    addLog(`Visiting: ${node.val}`, 'compare');
    result.push(node.val);
    await sleep(500);
    await inOrder(node.right);
  }
  addLog('In-Order Traversal (Left→Root→Right)', 'info');
  await inOrder(bstRoot);
  addLog(`Result: [${result.join(', ')}]`, 'done');
  renderBST(traversed);
}

async function bstLevelOrder() {
  if (!bstRoot) return;
  const queue = [bstRoot];
  const traversed = new Set();
  addLog('Level-Order (BFS) Traversal', 'info');
  while (queue.length) {
    const node = queue.shift();
    traversed.add(node.val);
    renderBST(traversed, node.val);
    addLog(`Level visit: ${node.val}`, 'compare');
    await sleep(500);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  addLog('Level-Order complete!', 'done');
  renderBST(traversed);
}

function bstReset() {
  bstRoot = null;
  const vals = [50, 30, 70, 20, 40, 60, 80];
  vals.forEach(v => bstRoot = bstInsert(bstRoot, v));
  renderBST();
  addLog('BST reset to default', 'info');
}

// ═══════════════════════════════════════════
//  GRAPH
// ═══════════════════════════════════════════
function setupGraph() {
  document.getElementById('extraControls').innerHTML = `
    <div style="display:flex;gap:.6rem;align-items:center">
      <button class="ctrl-btn btn-play" onclick="runBFS()">▶ BFS</button>
      <button class="ctrl-btn btn-pause" onclick="runDFS()">▶ DFS</button>
      <button class="ctrl-btn btn-reset" onclick="setupGraph()">RESET</button>
    </div>`;
  buildGraph();
}

function buildGraph() {
  const c = document.getElementById('vizContent');
  c.innerHTML = '';
  c.style.display = 'block';
  c.style.padding = '0';
  const canvas = document.createElement('canvas');
  canvas.id = 'graphCanvas';
  canvas.width = c.offsetWidth || 700;
  canvas.height = 360;
  c.appendChild(canvas);

  graphNodes = [
    {id:0,x:350,y:60,label:'A'},
    {id:1,x:180,y:160,label:'B'},
    {id:2,x:520,y:160,label:'C'},
    {id:3,x:80,y:280,label:'D'},
    {id:4,x:280,y:280,label:'E'},
    {id:5,x:440,y:280,label:'F'},
    {id:6,x:620,y:280,label:'G'},
  ];
  graphEdges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6],[4,5]];
  graphVisited = [];
  drawGraph();
  addLog('Graph ready. Run BFS or DFS from node A', 'info');
}

function drawGraph(visited = [], current = -1, queue = []) {
  const canvas = document.getElementById('graphCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Edges
  graphEdges.forEach(([a, b]) => {
    const na = graphNodes[a], nb = graphNodes[b];
    ctx.beginPath();
    ctx.moveTo(na.x, na.y); ctx.lineTo(nb.x, nb.y);
    ctx.strokeStyle = '#1a3a1a'; ctx.lineWidth = 2; ctx.stroke();
  });

  // Nodes
  graphNodes.forEach((n, i) => {
    const inVisited = visited.includes(i);
    const isCurrent = i === current;
    const inQueue = queue.includes(i);

    ctx.beginPath();
    ctx.arc(n.x, n.y, 26, 0, Math.PI * 2);
    ctx.fillStyle = isCurrent ? 'rgba(0,207,255,.15)' : inVisited ? 'rgba(0,255,65,.08)' : '#0d1f0d';
    ctx.fill();
    ctx.strokeStyle = isCurrent ? '#00cfff' : inVisited ? '#00ff41' : inQueue ? '#ffb800' : '#2a5a2a';
    ctx.lineWidth = isCurrent ? 2.5 : 1.5;
    ctx.stroke();

    if (isCurrent || inVisited) {
      ctx.shadowColor = isCurrent ? '#00cfff' : '#00ff41';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    ctx.fillStyle = isCurrent ? '#00cfff' : inVisited ? '#00ff41' : '#4a8a4a';
    ctx.font = 'bold 15px JetBrains Mono, monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(n.label, n.x, n.y);
  });

  // Legend
  ctx.font = '11px JetBrains Mono, monospace';
  ctx.fillStyle = '#2d5a2d';
  ctx.textAlign = 'left';
  ctx.fillText('■ VISITED', 10, canvas.height - 30);
  ctx.fillStyle = '#ffb80088';
  ctx.fillText('■ IN QUEUE', 100, canvas.height - 30);
  ctx.fillStyle = '#00cfff88';
  ctx.fillText('■ CURRENT', 200, canvas.height - 30);
}

async function runBFS() {
  addLog('BFS from node A (0)', 'info');
  const visited = [], queue = [0];
  while (queue.length) {
    const node = queue.shift();
    if (visited.includes(node)) continue;
    visited.push(node);
    drawGraph(visited, node, queue);
    addLog(`BFS visiting: ${graphNodes[node].label}`, 'compare');
    await sleep(700);
    graphEdges.forEach(([a, b]) => {
      if (a === node && !visited.includes(b) && !queue.includes(b)) queue.push(b);
      if (b === node && !visited.includes(a) && !queue.includes(a)) queue.push(a);
    });
  }
  drawGraph(visited, -1, []);
  addLog(`BFS complete! Order: ${visited.map(i => graphNodes[i].label).join(' → ')}`, 'done');
}

async function runDFS() {
  addLog('DFS from node A (0)', 'info');
  const visited = [];
  async function dfs(node) {
    if (visited.includes(node)) return;
    visited.push(node);
    drawGraph(visited, node, []);
    addLog(`DFS visiting: ${graphNodes[node].label}`, 'compare');
    await sleep(700);
    for (const [a, b] of graphEdges) {
      if (a === node && !visited.includes(b)) await dfs(b);
      if (b === node && !visited.includes(a)) await dfs(a);
    }
  }
  await dfs(0);
  drawGraph(visited, -1, []);
  addLog(`DFS complete! Order: ${visited.map(i => graphNodes[i].label).join(' → ')}`, 'done');
}

// ═══════════════════════════════════════════
//  UTILS
// ═══════════════════════════════════════════
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function addLog(msg, type = 'info') {
  const log = document.getElementById('stepLog');
  const ts = new Date().toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  entry.innerHTML = `<span class="ts">[${ts}]</span><span class="msg">${msg}</span>`;
  log.insertBefore(entry, log.firstChild);
  while (log.children.length > 50) log.removeChild(log.lastChild);
}

function updateStats() {
  document.getElementById('statComps').textContent = comparisons;
  document.getElementById('statSwaps').textContent = swaps;
  const elapsed = running ? Date.now() - startTime : 0;
  document.getElementById('statTime').textContent = elapsed + 'ms';
  document.getElementById('statN').textContent = array.length;
}

function setStatus(s) {
  document.getElementById('statusText').textContent = s;
}

function updateSpeed(v) {
  speed = parseInt(v);
  document.getElementById('speedVal').textContent = v;
}

function updateSize(v) {
  arraySize = parseInt(v);
  document.getElementById('sizeVal').textContent = v;
  generateData();
}

// Update time while running
setInterval(() => {
  if (running && !paused) {
    document.getElementById('statTime').textContent = (Date.now() - startTime) + 'ms';
  }
}, 100);

// ═══════════════════════════════════════════
//  DIJKSTRA'S ALGORITHM
// ═══════════════════════════════════════════
let dijkstraNodes = [], dijkstraEdges = [];

function setupDijkstra() {
  document.getElementById('extraControls').innerHTML = `
    <div style="display:flex;gap:.6rem;align-items:center">
      <button class="ctrl-btn btn-play" onclick="runDijkstra()">▶ RUN from A</button>
      <button class="ctrl-btn btn-reset" onclick="setupDijkstra()">RESET</button>
    </div>`;
  buildDijkstraGraph();
}

function buildDijkstraGraph() {
  const c = document.getElementById('vizContent');
  c.innerHTML = '';
  c.style.display = 'block';
  c.style.padding = '0';
  const canvas = document.createElement('canvas');
  canvas.id = 'dijkCanvas';
  canvas.width = c.offsetWidth || 700;
  canvas.height = 380;
  c.appendChild(canvas);

  dijkstraNodes = [
    {id:0,x:340,y:55,label:'A'},
    {id:1,x:160,y:160,label:'B'},
    {id:2,x:520,y:160,label:'C'},
    {id:3,x:60,y:300,label:'D'},
    {id:4,x:270,y:300,label:'E'},
    {id:5,x:430,y:300,label:'F'},
    {id:6,x:620,y:300,label:'G'},
  ];
  // [from, to, weight]
  dijkstraEdges = [
    [0,1,4],[0,2,2],[1,3,5],[1,4,1],[2,4,8],[2,5,10],[3,4,2],[4,5,2],[5,6,3],[2,6,7]
  ];
  drawDijkstraGraph({}, -1, {});
  addLog("Dijkstra graph ready. Run from node A.", 'info');
}

function drawDijkstraGraph(dist = {}, current = -1, prev = {}) {
  const canvas = document.getElementById('dijkCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Edges with weights
  dijkstraEdges.forEach(([a, b, w]) => {
    const na = dijkstraNodes[a], nb = dijkstraNodes[b];
    const settled = dist[a] !== undefined && dist[b] !== undefined;
    ctx.beginPath();
    ctx.moveTo(na.x, na.y); ctx.lineTo(nb.x, nb.y);
    ctx.strokeStyle = settled ? '#2a5a2a' : '#1a3a1a';
    ctx.lineWidth = 1.5; ctx.stroke();
    const mx = (na.x + nb.x) / 2, my = (na.y + nb.y) / 2;
    ctx.fillStyle = '#ffb80099';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(w, mx, my - 8);
  });

  // Nodes
  dijkstraNodes.forEach((n, i) => {
    const isCurrent = i === current;
    const hasD = dist[i] !== undefined && dist[i] !== Infinity;
    ctx.beginPath();
    ctx.arc(n.x, n.y, 26, 0, Math.PI * 2);
    ctx.fillStyle = isCurrent ? 'rgba(0,207,255,.15)' : hasD ? 'rgba(0,255,65,.08)' : '#0d1f0d';
    ctx.fill();
    ctx.strokeStyle = isCurrent ? '#00cfff' : hasD ? '#00ff41' : '#2a5a2a';
    ctx.lineWidth = isCurrent ? 2.5 : 1.5;
    if (isCurrent) { ctx.shadowColor = '#00cfff'; ctx.shadowBlur = 15; }
    else if (hasD) { ctx.shadowColor = '#00ff41'; ctx.shadowBlur = 10; }
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = isCurrent ? '#00cfff' : hasD ? '#00ff41' : '#4a8a4a';
    ctx.font = 'bold 14px JetBrains Mono, monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(n.label, n.x, n.y - 5);
    const d = dist[i] === undefined ? '∞' : dist[i] === Infinity ? '∞' : dist[i];
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = isCurrent ? '#00cfffcc' : hasD ? '#00ff41cc' : '#2a5a2a';
    ctx.fillText('d=' + d, n.x, n.y + 9);
  });

  // Legend
  ctx.font = '11px JetBrains Mono, monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#00ff4188'; ctx.fillText('■ SETTLED', 10, canvas.height - 30);
  ctx.fillStyle = '#00cfff88'; ctx.fillText('■ CURRENT', 110, canvas.height - 30);
  ctx.fillStyle = '#ffb80088'; ctx.fillText('■ EDGE WEIGHT', 210, canvas.height - 30);
}

async function runDijkstra() {
  const n = dijkstraNodes.length;
  const dist = Array(n).fill(Infinity);
  const visited = new Set();
  dist[0] = 0;

  addLog("Dijkstra: Start A (node 0), dist[A]=0", 'info');
  drawDijkstraGraph(dist.map(d => d), -1, {});

  for (let iter = 0; iter < n; iter++) {
    // pick min dist unvisited
    let u = -1;
    for (let i = 0; i < n; i++) {
      if (!visited.has(i) && (u === -1 || dist[i] < dist[u])) u = i;
    }
    if (dist[u] === Infinity) break;
    visited.add(u);
    const distObj = {};
    dist.forEach((d, i) => { if (d !== Infinity) distObj[i] = d; });
    drawDijkstraGraph(distObj, u, {});
    addLog(`Settled node ${dijkstraNodes[u].label} with dist=${dist[u]}`, 'compare');
    await sleep(700);

    // relax edges
    for (const [a, b, w] of dijkstraEdges) {
      let neighbor = -1;
      if (a === u) neighbor = b;
      else if (b === u) neighbor = a;
      if (neighbor === -1 || visited.has(neighbor)) continue;
      if (dist[u] + w < dist[neighbor]) {
        dist[neighbor] = dist[u] + w;
        const dObj2 = {};
        dist.forEach((d, i) => { if (d !== Infinity) dObj2[i] = d; });
        drawDijkstraGraph(dObj2, u, {});
        addLog(`Relaxed edge ${dijkstraNodes[u].label}→${dijkstraNodes[neighbor].label}: dist=${dist[neighbor]}`, 'step');
        await sleep(400);
      }
    }
  }

  const finalD = {};
  dist.forEach((d, i) => { finalD[i] = d; });
  drawDijkstraGraph(finalD, -1, {});
  addLog(`Done! Shortest distances from A: ${dijkstraNodes.map((n,i)=>n.label+'='+dist[i]).join(', ')}`, 'done');
}

// ═══════════════════════════════════════════
//  SLOW & FAST POINTER
// ═══════════════════════════════════════════
let sfList = [], sfCycleAt = -1;

function setupSlowFast() {
  sfList = [10, 22, 4, 16, 8, 33, 51];
  sfCycleAt = -1;
  document.getElementById('extraControls').innerHTML = `
    <div style="display:flex;gap:.6rem;align-items:center;flex-wrap:wrap">
      <button class="ctrl-btn btn-play" onclick="sfFindMiddle()">▶ FIND MIDDLE</button>
      <button class="ctrl-btn btn-pause" onclick="sfAddCycle()">ADD CYCLE</button>
      <button class="ctrl-btn btn-gen" onclick="sfDetectCycle()">DETECT CYCLE</button>
      <button class="ctrl-btn btn-reset" onclick="setupSlowFast()">RESET</button>
    </div>`;
  renderSF(-1, -1, false);
  addLog('Slow & Fast Pointer: List initialized', 'info');
}

function renderSF(slow = -1, fast = -1, hasCycle = false, meetAt = -1) {
  const c = document.getElementById('vizContent');
  c.innerHTML = '';
  c.style.display = 'block';
  c.style.padding = '0';
  const canvas = document.createElement('canvas');
  canvas.id = 'sfCanvas';
  const w = c.offsetWidth || 700;
  canvas.width = w;
  canvas.height = 280;
  c.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, canvas.height);

  const n = sfList.length;
  const nodeW = 60, nodeH = 40, startX = 40, y = 100, gap = 20;
  const step = (w - startX * 2) / Math.max(n, 1);

  // Draw cycle arc if cycle
  if (sfCycleAt >= 0) {
    const cx1 = startX + (n - 1) * step + nodeW / 2;
    const cx2 = startX + sfCycleAt * step + nodeW / 2;
    ctx.beginPath();
    ctx.strokeStyle = '#ff333366';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.arc((cx1 + cx2) / 2, y + nodeH + 50, Math.abs(cx1 - cx2) / 2 + 10, 0, Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ff333399';
    ctx.font = '10px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText('CYCLE → node ' + sfCycleAt, (cx1 + cx2) / 2, y + nodeH + 95);
  }

  sfList.forEach((val, i) => {
    const x = startX + i * step;
    const isSlow = i === slow;
    const isFast = i === fast;
    const isBoth = isSlow && isFast;
    const isMeet = i === meetAt;

    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, nodeW, nodeH, 6) : ctx.rect(x, y, nodeW, nodeH);
    ctx.fillStyle = isMeet ? 'rgba(204,68,255,.15)' : isBoth ? 'rgba(0,207,255,.12)' : isSlow ? 'rgba(255,184,0,.1)' : isFast ? 'rgba(0,255,65,.08)' : '#0d1f0d';
    ctx.fill();
    ctx.strokeStyle = isMeet ? '#cc44ff' : isBoth ? '#00cfff' : isSlow ? '#ffb800' : isFast ? '#00ff41' : '#2a5a2a';
    ctx.lineWidth = (isSlow || isFast || isMeet) ? 2 : 1;
    if (isSlow || isFast || isMeet) { ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 12; }
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = isMeet ? '#cc44ff' : isBoth ? '#00cfff' : isSlow ? '#ffb800' : isFast ? '#00ff41' : '#4a8a4a';
    ctx.font = 'bold 14px JetBrains Mono, monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(val, x + nodeW / 2, y + nodeH / 2);

    // arrows
    if (i < n - 1 || sfCycleAt >= 0) {
      ctx.beginPath();
      const ax = x + nodeW, ay = y + nodeH / 2;
      const toX = (i < n - 1) ? startX + (i + 1) * step : startX + sfCycleAt * step;
      if (i < n - 1) {
        ctx.moveTo(ax, ay); ctx.lineTo(toX, ay);
        ctx.strokeStyle = '#2a5a2a'; ctx.lineWidth = 1.5; ctx.stroke();
        // arrowhead
        ctx.beginPath();
        ctx.moveTo(toX, ay); ctx.lineTo(toX - 8, ay - 4); ctx.lineTo(toX - 8, ay + 4); ctx.closePath();
        ctx.fillStyle = '#2a5a2a'; ctx.fill();
      }
    }

    // pointer labels
    if (isSlow && !isBoth) { ctx.fillStyle = '#ffb800'; ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'center'; ctx.fillText('SLOW', x + nodeW/2, y - 12); }
    if (isFast && !isBoth) { ctx.fillStyle = '#00ff41'; ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'center'; ctx.fillText('FAST', x + nodeW/2, y - 12); }
    if (isBoth) { ctx.fillStyle = '#00cfff'; ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'center'; ctx.fillText('S+F', x + nodeW/2, y - 12); }
    if (isMeet) { ctx.fillStyle = '#cc44ff'; ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'center'; ctx.fillText('MEET', x + nodeW/2, y - 12); }

    // index label
    ctx.fillStyle = '#2d5a2d'; ctx.font = '9px JetBrains Mono'; ctx.textAlign = 'center';
    ctx.fillText('[' + i + ']', x + nodeW/2, y + nodeH + 12);
  });

  if (!hasCycle && sfCycleAt < 0) {
    const nx = startX + n * step;
    ctx.strokeStyle = '#1a3a1a'; ctx.lineWidth = 1;
    ctx.strokeRect(nx, y, 46, nodeH);
    ctx.fillStyle = '#2d5a2d'; ctx.font = '11px JetBrains Mono'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('NULL', nx + 23, y + nodeH / 2);
  }

  // Legend
  ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'left';
  ctx.fillStyle = '#ffb80099'; ctx.fillText('■ SLOW (1 step)', 10, canvas.height - 20);
  ctx.fillStyle = '#00ff4199'; ctx.fillText('■ FAST (2 steps)', 140, canvas.height - 20);
  ctx.fillStyle = '#cc44ff99'; ctx.fillText('■ MEET POINT', 290, canvas.height - 20);
}

async function sfFindMiddle() {
  addLog('Finding middle: Slow=1 step, Fast=2 steps', 'info');
  let slow = 0, fast = 0;
  renderSF(slow, fast);
  await sleep(500);
  while (fast < sfList.length - 1 && fast + 1 < sfList.length - 1) {
    slow++;
    fast = Math.min(sfList.length - 1, fast + 2);
    renderSF(slow, fast);
    addLog(`Slow→[${slow}]=${sfList[slow]}, Fast→[${fast}]=${sfList[fast]}`, 'compare');
    await sleep(600);
  }
  addLog(`Middle node is [${slow}] = ${sfList[slow]}`, 'done');
  renderSF(slow, fast, false, slow);
}

function sfAddCycle() {
  sfCycleAt = 2;
  renderSF(-1, -1, true);
  addLog('Cycle added: tail → node[2] (value=' + sfList[2] + ')', 'step');
}

async function sfDetectCycle() {
  if (sfCycleAt < 0) { addLog('No cycle. Add a cycle first!', 'compare'); return; }
  addLog('Detecting cycle with Floyd\'s algorithm...', 'info');
  let slow = 0, fast = 0;
  const maxIter = sfList.length * 3;

  for (let i = 0; i < maxIter; i++) {
    const nextSlow = slow + 1 < sfList.length ? slow + 1 : sfCycleAt;
    const f1 = fast + 1 < sfList.length ? fast + 1 : sfCycleAt;
    const nextFast = f1 + 1 < sfList.length ? f1 + 1 : sfCycleAt;
    slow = nextSlow;
    fast = nextFast;
    renderSF(slow, fast, true);
    addLog(`Slow=[${slow}] Fast=[${fast}]`, 'compare');
    await sleep(500);
    if (slow === fast) {
      addLog(`⚡ CYCLE DETECTED! Slow & Fast meet at node[${slow}]=${sfList[slow]}`, 'done');
      renderSF(slow, fast, true, slow);
      return;
    }
  }
  addLog('No cycle detected.', 'done');
}

// ═══════════════════════════════════════════
//  SHARED TREE STATE (for tree algos)
// ═══════════════════════════════════════════
let treeAlgoRoot = null;

function buildDefaultTree() {
  // Build a simple balanced tree
  function ins(node, val) {
    if (!node) return { val, left: null, right: null };
    if (val < node.val) node.left = ins(node.left, val);
    else node.right = ins(node.right, val);
    return node;
  }
  let r = null;
  [50, 30, 70, 20, 40, 60, 80, 10, 35, 45].forEach(v => r = ins(r, v));
  return r;
}

function renderTreeAlgo(traversed = new Set(), current = null, highlighted = new Set()) {
  const c = document.getElementById('vizContent');
  c.innerHTML = '';
  c.style.display = 'flex';
  c.style.alignItems = 'flex-start';
  c.style.justifyContent = 'center';
  c.style.padding = '1.5rem';
  c.style.overflow = 'auto';
  if (!treeAlgoRoot) return;
  c.appendChild(buildTreeAlgoDOM(treeAlgoRoot, traversed, current, highlighted));
}

function buildTreeAlgoDOM(node, traversed, current, highlighted) {
  if (!node) return document.createElement('div');
  const wrap = document.createElement('div');
  wrap.className = 'tree-node-wrap';
  const box = document.createElement('div');
  const isTraversed = traversed.has(node.val);
  const isCurrent = current === node.val;
  const isHL = highlighted && highlighted.has(node.val);
  box.className = 'tree-box' +
    (isCurrent ? ' current' : isHL ? ' traversed' : isTraversed ? ' traversed' : '');
  if (isHL && !isCurrent) box.style.borderColor = '#cc44ff';
  box.textContent = node.val;
  wrap.appendChild(box);
  if (node.left || node.right) {
    const conn = document.createElement('div');
    conn.className = 'tree-connector' + (node.left ? ' has-left' : '') + (node.right ? ' has-right' : '');
    wrap.appendChild(conn);
    const children = document.createElement('div');
    children.className = 'tree-children';
    if (node.left) children.appendChild(buildTreeAlgoDOM(node.left, traversed, current, highlighted));
    else children.appendChild(document.createElement('div'));
    if (node.right) children.appendChild(buildTreeAlgoDOM(node.right, traversed, current, highlighted));
    wrap.appendChild(children);
  }
  return wrap;
}

// ═══════════════════════════════════════════
//  TREE TRAVERSALS (Pre / In / Post)
// ═══════════════════════════════════════════
function setupTreeTraversal() {
  treeAlgoRoot = buildDefaultTree();
  document.getElementById('extraControls').innerHTML = `
    <div style="display:flex;gap:.6rem;align-items:center;flex-wrap:wrap">
      <button class="ctrl-btn btn-play" onclick="runPreOrder()">PRE-ORDER</button>
      <button class="ctrl-btn btn-pause" onclick="runInOrder()">IN-ORDER</button>
      <button class="ctrl-btn btn-gen" onclick="runPostOrder()">POST-ORDER</button>
      <button class="ctrl-btn btn-reset" onclick="setupTreeTraversal()">RESET</button>
    </div>`;
  renderTreeAlgo();
  addLog('Tree Traversals ready. Choose Pre / In / Post order.', 'info');
}

async function runPreOrder() {
  const result = [], traversed = new Set();
  addLog('Pre-Order: Root → Left → Right', 'info');
  async function pre(node) {
    if (!node) return;
    traversed.add(node.val);
    result.push(node.val);
    renderTreeAlgo(traversed, node.val);
    addLog(`Visit: ${node.val}`, 'compare');
    await sleep(500);
    await pre(node.left);
    await pre(node.right);
  }
  await pre(treeAlgoRoot);
  renderTreeAlgo(traversed);
  addLog(`Pre-Order: [${result.join(', ')}]`, 'done');
}

async function runInOrder() {
  const result = [], traversed = new Set();
  addLog('In-Order: Left → Root → Right', 'info');
  async function ino(node) {
    if (!node) return;
    await ino(node.left);
    traversed.add(node.val);
    result.push(node.val);
    renderTreeAlgo(traversed, node.val);
    addLog(`Visit: ${node.val}`, 'compare');
    await sleep(500);
    await ino(node.right);
  }
  await ino(treeAlgoRoot);
  renderTreeAlgo(traversed);
  addLog(`In-Order: [${result.join(', ')}]`, 'done');
}

async function runPostOrder() {
  const result = [], traversed = new Set();
  addLog('Post-Order: Left → Right → Root', 'info');
  async function post(node) {
    if (!node) return;
    await post(node.left);
    await post(node.right);
    traversed.add(node.val);
    result.push(node.val);
    renderTreeAlgo(traversed, node.val);
    addLog(`Visit: ${node.val}`, 'compare');
    await sleep(500);
  }
  await post(treeAlgoRoot);
  renderTreeAlgo(traversed);
  addLog(`Post-Order: [${result.join(', ')}]`, 'done');
}

// ═══════════════════════════════════════════
//  TREE HEIGHT
// ═══════════════════════════════════════════
function setupTreeHeight() {
  treeAlgoRoot = buildDefaultTree();
  document.getElementById('extraControls').innerHTML = `
    <div style="display:flex;gap:.6rem;align-items:center;flex-wrap:wrap">
      <button class="ctrl-btn btn-play" onclick="runTreeHeight()">▶ COMPUTE HEIGHT</button>
      <button class="ctrl-btn btn-reset" onclick="setupTreeHeight()">RESET</button>
    </div>`;
  renderTreeAlgo();
  addLog('Tree Height: Click to compute recursively.', 'info');
}

async function runTreeHeight() {
  const visited = new Set();
  addLog('Computing tree height recursively...', 'info');
  async function h(node) {
    if (!node) return 0;
    renderTreeAlgo(visited, node.val);
    addLog(`At node ${node.val}, computing left/right heights...`, 'compare');
    await sleep(400);
    const l = await h(node.left);
    const r = await h(node.right);
    const result = 1 + Math.max(l, r);
    visited.add(node.val);
    renderTreeAlgo(visited, node.val);
    addLog(`Node ${node.val}: height = 1 + max(${l}, ${r}) = ${result}`, 'step');
    await sleep(300);
    return result;
  }
  const height = await h(treeAlgoRoot);
  renderTreeAlgo(visited);
  addLog(`Tree Height = ${height}`, 'done');
}

// ═══════════════════════════════════════════
//  TREE DIAMETER
// ═══════════════════════════════════════════
function setupTreeDiameter() {
  treeAlgoRoot = buildDefaultTree();
  document.getElementById('extraControls').innerHTML = `
    <div style="display:flex;gap:.6rem;align-items:center;flex-wrap:wrap">
      <button class="ctrl-btn btn-play" onclick="runTreeDiameter()">▶ COMPUTE DIAMETER</button>
      <button class="ctrl-btn btn-reset" onclick="setupTreeDiameter()">RESET</button>
    </div>`;
  renderTreeAlgo();
  addLog('Tree Diameter: Longest path between any 2 nodes.', 'info');
}

async function runTreeDiameter() {
  let maxDiam = 0;
  let diamPath = new Set();
  const visited = new Set();
  addLog('Computing tree diameter...', 'info');
  async function dfs(node) {
    if (!node) return 0;
    renderTreeAlgo(visited, node.val, diamPath);
    addLog(`DFS at node ${node.val}`, 'compare');
    await sleep(350);
    const l = await dfs(node.left);
    const r = await dfs(node.right);
    const through = l + r;
    if (through > maxDiam) {
      maxDiam = through;
      addLog(`New max diameter = ${maxDiam} (through node ${node.val})`, 'step');
    }
    visited.add(node.val);
    renderTreeAlgo(visited, node.val, diamPath);
    await sleep(250);
    return 1 + Math.max(l, r);
  }
  await dfs(treeAlgoRoot);
  renderTreeAlgo(visited);
  addLog(`Tree Diameter = ${maxDiam} edges`, 'done');
}

// ═══════════════════════════════════════════
//  BOOT
// ═══════════════════════════════════════════
init();
