import java.util.*;

// ═══════════════════════════════════════════════════════════
//  AlgoViz.java  —  All DSA Implementations in Java
//  Matches the AlgoViz visualizer (algoviz.html)
// ═══════════════════════════════════════════════════════════

public class AlgoViz {

    // ────────────────────────────────────────
    //  1. BUBBLE SORT  — O(n²) time  O(1) space
    // ────────────────────────────────────────
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int tmp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tmp;
                }
            }
        }
    }

    // ────────────────────────────────────────
    //  2. SELECTION SORT  — O(n²) time  O(1) space
    // ────────────────────────────────────────
    public static void selectionSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) minIdx = j;
            }
            int tmp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = tmp;
        }
    }

    // ────────────────────────────────────────
    //  3. INSERTION SORT  — O(n²) time  O(1) space
    // ────────────────────────────────────────
    public static void insertionSort(int[] arr) {
        int n = arr.length;
        for (int i = 1; i < n; i++) {
            int key = arr[i], j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }

    // ────────────────────────────────────────
    //  4. MERGE SORT  — O(n log n) time  O(n) space
    // ────────────────────────────────────────
    public static void mergeSort(int[] arr, int l, int r) {
        if (l >= r) return;
        int mid = (l + r) / 2;
        mergeSort(arr, l, mid);
        mergeSort(arr, mid + 1, r);
        merge(arr, l, mid, r);
    }

    private static void merge(int[] arr, int l, int mid, int r) {
        int[] left  = Arrays.copyOfRange(arr, l, mid + 1);
        int[] right = Arrays.copyOfRange(arr, mid + 1, r + 1);
        int i = 0, j = 0, k = l;
        while (i < left.length && j < right.length)
            arr[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];
        while (i < left.length)  arr[k++] = left[i++];
        while (j < right.length) arr[k++] = right[j++];
    }

    // ────────────────────────────────────────
    //  5. QUICK SORT  — O(n log n) avg  O(log n) space
    // ────────────────────────────────────────
    public static void quickSort(int[] arr, int lo, int hi) {
        if (lo < hi) {
            int p = partition(arr, lo, hi);
            quickSort(arr, lo, p - 1);
            quickSort(arr, p + 1, hi);
        }
    }

    private static int partition(int[] arr, int lo, int hi) {
        int pivot = arr[hi], i = lo - 1;
        for (int j = lo; j < hi; j++) {
            if (arr[j] <= pivot) {
                i++;
                int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
            }
        }
        int tmp = arr[i + 1]; arr[i + 1] = arr[hi]; arr[hi] = tmp;
        return i + 1;
    }

    // ────────────────────────────────────────
    //  6. LINEAR SEARCH  — O(n) time  O(1) space
    // ────────────────────────────────────────
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++)
            if (arr[i] == target) return i;
        return -1;
    }

    // ────────────────────────────────────────
    //  7. BINARY SEARCH  — O(log n) time  O(1) space
    //     Array must be sorted
    // ────────────────────────────────────────
    public static int binarySearch(int[] arr, int target) {
        int lo = 0, hi = arr.length - 1;
        while (lo <= hi) {
            int mid = (lo + hi) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }

    // ════════════════════════════════════════
    //  LINKED LIST
    // ════════════════════════════════════════
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val) { this.val = val; }
    }

    static class LinkedList {
        ListNode head;

        void insertHead(int val) {
            ListNode node = new ListNode(val);
            node.next = head;
            head = node;
        }

        void insertTail(int val) {
            ListNode node = new ListNode(val);
            if (head == null) { head = node; return; }
            ListNode curr = head;
            while (curr.next != null) curr = curr.next;
            curr.next = node;
        }

        void delete(int val) {
            if (head == null) return;
            if (head.val == val) { head = head.next; return; }
            ListNode curr = head;
            while (curr.next != null && curr.next.val != val) curr = curr.next;
            if (curr.next != null) curr.next = curr.next.next;
        }

        void traverse() {
            ListNode curr = head;
            while (curr != null) {
                System.out.print(curr.val + " -> ");
                curr = curr.next;
            }
            System.out.println("NULL");
        }
    }

    // ════════════════════════════════════════
    //  SLOW & FAST POINTER (Floyd's Algorithm)
    // ════════════════════════════════════════

    // 8a. Detect cycle — O(n) time  O(1) space
    public static boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;          // 1 step
            fast = fast.next.next;     // 2 steps
            if (slow == fast) return true;
        }
        return false;
    }

    // 8b. Find middle of linked list
    public static ListNode findMiddle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow; // slow is at middle
    }

    // 8c. Find cycle entry point
    public static ListNode detectCycleStart(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                slow = head;
                while (slow != fast) { slow = slow.next; fast = fast.next; }
                return slow; // cycle start
            }
        }
        return null;
    }

    // ════════════════════════════════════════
    //  BINARY SEARCH TREE
    // ════════════════════════════════════════
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    static class BST {
        TreeNode root;

        void insert(int val) { root = insertRec(root, val); }

        private TreeNode insertRec(TreeNode node, int val) {
            if (node == null) return new TreeNode(val);
            if (val < node.val) node.left  = insertRec(node.left,  val);
            else if (val > node.val) node.right = insertRec(node.right, val);
            return node;
        }

        boolean search(int val) { return searchRec(root, val); }

        private boolean searchRec(TreeNode node, int val) {
            if (node == null) return false;
            if (val == node.val) return true;
            return val < node.val ? searchRec(node.left, val) : searchRec(node.right, val);
        }
    }

    // ════════════════════════════════════════
    //  TREE TRAVERSALS  — O(n) time  O(h) space
    // ════════════════════════════════════════

    // 9a. Pre-order: Root → Left → Right
    public static List<Integer> preOrder(TreeNode node) {
        List<Integer> res = new ArrayList<>();
        preOrderRec(node, res);
        return res;
    }
    private static void preOrderRec(TreeNode node, List<Integer> res) {
        if (node == null) return;
        res.add(node.val);
        preOrderRec(node.left, res);
        preOrderRec(node.right, res);
    }

    // 9b. In-order: Left → Root → Right
    public static List<Integer> inOrder(TreeNode node) {
        List<Integer> res = new ArrayList<>();
        inOrderRec(node, res);
        return res;
    }
    private static void inOrderRec(TreeNode node, List<Integer> res) {
        if (node == null) return;
        inOrderRec(node.left, res);
        res.add(node.val);
        inOrderRec(node.right, res);
    }

    // 9c. Post-order: Left → Right → Root
    public static List<Integer> postOrder(TreeNode node) {
        List<Integer> res = new ArrayList<>();
        postOrderRec(node, res);
        return res;
    }
    private static void postOrderRec(TreeNode node, List<Integer> res) {
        if (node == null) return;
        postOrderRec(node.left, res);
        postOrderRec(node.right, res);
        res.add(node.val);
    }

    // 9d. Level-order (BFS)
    public static List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            int size = q.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                level.add(node.val);
                if (node.left  != null) q.add(node.left);
                if (node.right != null) q.add(node.right);
            }
            res.add(level);
        }
        return res;
    }

    // ════════════════════════════════════════
    //  TREE HEIGHT  — O(n) time  O(h) space
    // ════════════════════════════════════════
    public static int treeHeight(TreeNode node) {
        if (node == null) return 0;
        int leftH  = treeHeight(node.left);
        int rightH = treeHeight(node.right);
        return 1 + Math.max(leftH, rightH);
    }

    // ════════════════════════════════════════
    //  TREE DIAMETER  — O(n) time  O(h) space
    // ════════════════════════════════════════
    private static int maxDiameter = 0;

    public static int treeDiameter(TreeNode root) {
        maxDiameter = 0;
        diamDFS(root);
        return maxDiameter;
    }

    private static int diamDFS(TreeNode node) {
        if (node == null) return 0;
        int left  = diamDFS(node.left);
        int right = diamDFS(node.right);
        maxDiameter = Math.max(maxDiameter, left + right);  // path through this node
        return 1 + Math.max(left, right);
    }

    // ════════════════════════════════════════
    //  GRAPH — BFS  — O(V+E) time  O(V) space
    // ════════════════════════════════════════
    public static List<Integer> bfs(Map<Integer, List<Integer>> graph, int start) {
        List<Integer> visited = new ArrayList<>();
        Queue<Integer> queue = new LinkedList<>();
        Set<Integer> seen = new HashSet<>();
        queue.add(start);
        seen.add(start);
        while (!queue.isEmpty()) {
            int node = queue.poll();
            visited.add(node);
            for (int neighbor : graph.getOrDefault(node, new ArrayList<>())) {
                if (!seen.contains(neighbor)) {
                    seen.add(neighbor);
                    queue.add(neighbor);
                }
            }
        }
        return visited;
    }

    // ════════════════════════════════════════
    //  GRAPH — DFS  — O(V+E) time  O(V) space
    // ════════════════════════════════════════
    public static List<Integer> dfs(Map<Integer, List<Integer>> graph, int start) {
        List<Integer> visited = new ArrayList<>();
        Set<Integer> seen = new HashSet<>();
        dfsRec(graph, start, seen, visited);
        return visited;
    }

    private static void dfsRec(Map<Integer, List<Integer>> graph,
                                int node, Set<Integer> seen, List<Integer> visited) {
        seen.add(node);
        visited.add(node);
        for (int neighbor : graph.getOrDefault(node, new ArrayList<>())) {
            if (!seen.contains(neighbor)) dfsRec(graph, neighbor, seen, visited);
        }
    }

    // ════════════════════════════════════════
    //  DIJKSTRA'S  — O(V²) time  O(V) space
    //  Undirected weighted graph
    // ════════════════════════════════════════
    public static int[] dijkstra(int[][] adjMatrix, int src) {
        int n = adjMatrix.length;
        int[] dist = new int[n];
        boolean[] visited = new boolean[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;

        for (int iter = 0; iter < n - 1; iter++) {
            // pick unvisited node with min distance
            int u = -1;
            for (int i = 0; i < n; i++)
                if (!visited[i] && (u == -1 || dist[i] < dist[u])) u = i;

            if (dist[u] == Integer.MAX_VALUE) break;
            visited[u] = true;

            // relax edges
            for (int v = 0; v < n; v++) {
                if (!visited[v] && adjMatrix[u][v] > 0) {
                    int newDist = dist[u] + adjMatrix[u][v];
                    if (newDist < dist[v]) dist[v] = newDist;
                }
            }
        }
        return dist;
    }

    // ════════════════════════════════════════
    //  MAIN — Demo / Test
    // ════════════════════════════════════════
    public static void main(String[] args) {
        System.out.println("═══ AlgoViz Java Demo ═══\n");

        // Sorting
        int[] arr = {64, 25, 12, 22, 11};
        bubbleSort(arr.clone());
        selectionSort(arr.clone());
        insertionSort(arr.clone());
        mergeSort(arr, 0, arr.length - 1);
        System.out.println("Sorted: " + Arrays.toString(arr));

        int[] arr2 = {10, 7, 8, 9, 1, 5};
        quickSort(arr2, 0, arr2.length - 1);
        System.out.println("Quick sorted: " + Arrays.toString(arr2));

        // Search
        int[] sorted = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
        System.out.println("Linear search 23: index " + linearSearch(sorted, 23));
        System.out.println("Binary search 23: index " + binarySearch(sorted, 23));

        // BST
        BST bst = new BST();
        for (int v : new int[]{50, 30, 70, 20, 40, 60, 80}) bst.insert(v);
        System.out.println("BST In-order:   " + inOrder(bst.root));
        System.out.println("BST Pre-order:  " + preOrder(bst.root));
        System.out.println("BST Post-order: " + postOrder(bst.root));
        System.out.println("BST Level-order:" + levelOrder(bst.root));
        System.out.println("Tree Height: "    + treeHeight(bst.root));
        System.out.println("Tree Diameter: "  + treeDiameter(bst.root));

        // Linked List + Slow/Fast
        LinkedList ll = new LinkedList();
        for (int v : new int[]{1, 2, 3, 4, 5, 6, 7}) ll.insertTail(v);
        ll.traverse();
        System.out.println("Middle node: " + findMiddle(ll.head).val);
        System.out.println("Has cycle: "   + hasCycle(ll.head));

        // Graph BFS / DFS
        Map<Integer, List<Integer>> graph = new HashMap<>();
        graph.put(0, Arrays.asList(1, 2));
        graph.put(1, Arrays.asList(0, 3, 4));
        graph.put(2, Arrays.asList(0, 5, 6));
        graph.put(3, Arrays.asList(1));
        graph.put(4, Arrays.asList(1, 5));
        graph.put(5, Arrays.asList(2, 4));
        graph.put(6, Arrays.asList(2));
        System.out.println("BFS from 0: " + bfs(graph, 0));
        System.out.println("DFS from 0: " + dfs(graph, 0));

        // Dijkstra (7 nodes, 0=A..6=G matching the visualizer)
        // adjMatrix[i][j] = weight, 0 = no edge
        int[][] adj = new int[7][7];
        int[][] edges = {{0,1,4},{0,2,2},{1,3,5},{1,4,1},{2,4,8},{2,5,10},{3,4,2},{4,5,2},{5,6,3},{2,6,7}};
        for (int[] e : edges) { adj[e[0]][e[1]] = e[2]; adj[e[1]][e[0]] = e[2]; }
        int[] dist = dijkstra(adj, 0);
        System.out.println("Dijkstra from A: " + Arrays.toString(dist));

        System.out.println("\n═══ All demos complete ═══");
    }
}
