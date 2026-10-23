# LinkedList Lab 🧪

> An interactive, beginner-friendly educational visualizer for the classic Data Structures & Algorithms problem: **"Add Two Numbers Represented by Linked Lists"** (LeetCode #2).

Built with **vanilla HTML5, CSS3, and JavaScript** — zero frameworks, zero external dependencies, zero build steps.

---

## 🌟 Features

- **Modern Dark Navy Aesthetic:** High-contrast dark navy palette (`#070b19`, `#111a38`) with vibrant purple and cyan glowing gradients, rounded glassmorphism cards, and fluid transitions.
- **Node-by-Node Linked List Construction:** Numbers are parsed into genuine singly-linked `ListNode` objects in **reverse-order** (least significant digit at the head), pointing to successive digits and ending in a distinct `NULL` node.
- **Standard DSA Addition Algorithm:** Full implementation using the classic dummy head pointer, simultaneous node traversal, and carry propagation.
- **Comprehensive Step-by-Step Inspector:**
  Displays the 6 key variables calculated at every iteration:
  1. `digit1` (from List 1 node, or `0` if exhausted)
  2. `digit2` (from List 2 node, or `0` if exhausted)
  3. `carry-in` (brought forward from previous position)
  4. `sum` (`digit1 + digit2 + carry-in`)
  5. `output digit` (`sum % 10` for new node)
  6. `carry-out` (`⌊sum / 10⌋` for next position)
- **Active Node Highlighting:** Real-time visual pulses and glowing rings on active nodes in List 1 (cyan glow), List 2 (purple glow), and newly generated result nodes (emerald glow).
- **Stepping & Playback Controls:** Previous step, Next step, Auto-Play / Pause, and selectable animation speeds (Slow 1.8s, Normal 1.0s, Fast 0.5s).
- **Preset Test Cases:** Quick-test buttons for:
  - `342 + 465 = 807` (Standard case)
  - `999 + 1 = 1000` (Cascading carry & list expansion)
  - `0 + 0 = 0` (Zero edge case)
  - `9999 + 99 = 10098` (Unequal list lengths)
- **Input Validation:** Restricts input to non-negative whole numbers (`0-9`), rejects empty fields and non-digit characters with accessible error messages, and normalizes leading zeros.
- **Deep Technical Section:** Clean conceptual breakdown, animated execution timeline, syntax-highlighted pseudocode and JavaScript code with one-click copy, and rigorous time & space complexity analysis.
- **Fully Responsive & Accessible:** Semantic HTML, ARIA labels, live error announcements, keyboard controls (Left/Right arrows for stepping, Spacebar for auto-play), and mobile-friendly touch targets.

---

## 🧮 How the Algorithm Works

### Why Reverse Order?
In standard grade-school addition, numbers are added right-to-left starting with the units place ($10^0$). Singly linked lists can only be traversed forward. Placing the **least significant digit at the head**:
1. Aligns the heads of both lists with the units place ($10^0$) immediately without needing list reversal or recursion.
2. Naturally advances to higher powers of $10$ ($10^1, 10^2, \dots$) as pointers advance (`curr = curr.next`).
3. Handles arbitrarily large numbers without 64-bit integer overflow.

### Step-by-Step Algorithm Invariant:
1. Initialize a dummy head node: `const dummy = new ListNode(0)`.
2. Maintain pointer `curr = dummy` and integer `carry = 0`.
3. Loop while `l1 !== null || l2 !== null || carry !== 0`:
   - `digit1 = l1 !== null ? l1.val : 0`
   - `digit2 = l2 !== null ? l2.val : 0`
   - `sum = digit1 + digit2 + carry`
   - `carry = Math.floor(sum / 10)`
   - `curr.next = new ListNode(sum % 10)`
   - Advance `curr = curr.next`
   - Advance `l1` and `l2` if not null.
4. Return `dummy.next`.

---

## ⏱️ Complexity Analysis

| Metric | Complexity | Explanation |
| :--- | :--- | :--- |
| **Time Complexity** | $\mathcal{O}(\max(m, n))$ | The loop runs at most $\max(m, n) + 1$ iterations (where $m$ and $n$ are the digit counts of List 1 and List 2). Each iteration performs $O(1)$ constant-time node operations. |
| **Space Complexity** | $\mathcal{O}(\max(m, n))$ | The resulting linked list contains at most $\max(m, n) + 1$ nodes. Auxiliary space is $\mathcal{O}(1)$ beyond the required output list. |

---

## 📁 Project Structure

```text
DSA_Project/
├── index.html        # Semantic HTML5 layout, accessible ARIA roles, visualizer canvas
├── style.css         # Modern dark navy theme, purple/cyan gradients, responsive layout
├── script.js         # ListNode class, addition algorithm, step recorder, UI controller, test suite
└── README.md         # Documentation, algorithmic analysis, test verification, deployment
```

---

## 🚀 How to Launch Locally

LinkedList Lab requires no server or dependencies — you can run it right in your browser!

### Option 1: Direct File Opening (Simplest)
1. Double-click `index.html` in your file explorer, or right-click and choose **Open with > Google Chrome / Microsoft Edge / Firefox**.

### Option 2: Python Built-in HTTP Server
If you prefer running through a local development server:
```bash
# Navigate to the project directory
cd "c:\Users\Vaishnavi Gengaje\OneDrive\DSA_Project"

# Start Python's built-in web server on port 8000
python -m http.server 8000
```
Then open your browser and navigate to:
```text
http://localhost:8000
```

### Option 3: VS Code Live Server
1. Open the `DSA_Project` folder in Visual Studio Code.
2. Install the **Live Server** extension (by Ritwick Dey) if you haven't already.
3. Right-click `index.html` and click **"Open with Live Server"**.

---

## 🌐 How to Deploy for Free

### Deploy to GitHub Pages:
1. Create a new public repository on GitHub (e.g. `linked-list-lab`).
2. Push your files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of LinkedList Lab"
   git branch -M main
   git remote add origin https://github.com/<your-username>/linked-list-lab.git
   git push -u origin main
   ```
3. In GitHub, go to **Settings > Pages**.
4. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
5. Your website will be live in 1-2 minutes at: `https://<your-username>.github.io/linked-list-lab/`.

### Deploy to Vercel or Netlify:
- **Netlify**: Drag and drop the `DSA_Project` folder into [Netlify Drop](https://app.netlify.com/drop).
- **Vercel**: Import your GitHub repository into Vercel with default settings (framework preset: "Other").

---

## ✅ Verified Test Cases

LinkedList Lab includes an automated unit test suite built directly into `script.js` (`window.runLinkedListTestSuite()`). All test cases have been executed and verified:

| Input 1 ($l_1$) | Input 2 ($l_2$) | Expected Sum | List 1 ($Head \to Tail$) | List 2 ($Head \to Tail$) | Result List ($Head \to Tail$) | Status |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `342` | `465` | **`807`** | $2 \to 4 \to 3 \to \emptyset$ | $5 \to 6 \to 4 \to \emptyset$ | $7 \to 0 \to 8 \to \emptyset$ | **PASS** |
| `999` | `1` | **`1000`** | $9 \to 9 \to 9 \to \emptyset$ | $1 \to \emptyset$ | $0 \to 0 \to 0 \to 1 \to \emptyset$ | **PASS** |
| `0` | `0` | **`0`** | $0 \to \emptyset$ | $0 \to \emptyset$ | $0 \to \emptyset$ | **PASS** |
| `9999` | `99` | **`10098`** | $9 \to 9 \to 9 \to 9 \to \emptyset$ | $9 \to 9 \to \emptyset$ | $8 \to 9 \to 0 \to 0 \to 1 \to \emptyset$ | **PASS** |
| `007` | `3` | **`10`** | $7 \to \emptyset$ | $3 \to \emptyset$ | $0 \to 1 \to \emptyset$ | **PASS** |

---

## 💡 Keyboard Shortcuts

- <kbd>→</kbd> : Advance to Next Step
- <kbd>←</kbd> : Return to Previous Step
- <kbd>Space</kbd> : Toggle Auto-Play / Pause

---

## 📜 License & Credits

Built for DSA Learning. Free to use, adapt, and share for educational and interview preparation purposes.
