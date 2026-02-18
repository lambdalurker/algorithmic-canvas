import { DataStructureStep, DSAlgorithm } from './types';

// ============ STACK ============
function stackOperations(): DSAlgorithm {
  return {
    id: 'stack',
    name: 'Stack',
    description: 'A LIFO (Last In, First Out) data structure. Elements are pushed onto and popped from the top.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    operations: ['push', 'pop'],
    code: [
      'class Stack {',
      '  items = [];',
      '',
      '  push(value) {',
      '    this.items.push(value);',
      '  }',
      '',
      '  pop() {',
      '    return this.items.pop();',
      '  }',
      '',
      '  peek() {',
      '    return this.items[this.items.length - 1];',
      '  }',
      '}',
    ],
    run: (ops: { type: 'push' | 'pop'; value?: number }[]): DataStructureStep[] => {
      const steps: DataStructureStep[] = [];
      const items: number[] = [];

      steps.push({
        elements: [...items],
        highlighted: [],
        description: 'Empty stack initialized.',
        codeLine: 0,
        action: 'init',
        pointers: {},
      });

      for (const op of ops) {
        if (op.type === 'push' && op.value !== undefined) {
          items.push(op.value);
          steps.push({
            elements: [...items],
            highlighted: [items.length - 1],
            description: `Push ${op.value} onto the stack. Stack size: ${items.length}`,
            codeLine: 4,
            action: 'push',
            pointers: { top: items.length - 1 },
          });
        } else if (op.type === 'pop' && items.length > 0) {
          const idx = items.length - 1;
          const val = items[idx];
          steps.push({
            elements: [...items],
            highlighted: [idx],
            description: `Pop ${val} from the top. Stack size will be: ${items.length - 1}`,
            codeLine: 8,
            action: 'pop',
            pointers: { top: idx },
          });
          items.pop();
          steps.push({
            elements: [...items],
            highlighted: [],
            description: `Removed ${val}. Stack size: ${items.length}`,
            codeLine: 8,
            action: 'pop',
            pointers: items.length > 0 ? { top: items.length - 1 } : {},
          });
        }
      }
      return steps;
    },
  };
}

// ============ QUEUE ============
function queueOperations(): DSAlgorithm {
  return {
    id: 'queue',
    name: 'Queue',
    description: 'A FIFO (First In, First Out) data structure. Elements are enqueued at the back and dequeued from the front.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    operations: ['enqueue', 'dequeue'],
    code: [
      'class Queue {',
      '  items = [];',
      '',
      '  enqueue(value) {',
      '    this.items.push(value);',
      '  }',
      '',
      '  dequeue() {',
      '    return this.items.shift();',
      '  }',
      '',
      '  front() {',
      '    return this.items[0];',
      '  }',
      '}',
    ],
    run: (ops: { type: 'enqueue' | 'dequeue'; value?: number }[]): DataStructureStep[] => {
      const steps: DataStructureStep[] = [];
      const items: number[] = [];

      steps.push({
        elements: [...items],
        highlighted: [],
        description: 'Empty queue initialized.',
        codeLine: 0,
        action: 'init',
        pointers: {},
      });

      for (const op of ops) {
        if (op.type === 'enqueue' && op.value !== undefined) {
          items.push(op.value);
          steps.push({
            elements: [...items],
            highlighted: [items.length - 1],
            description: `Enqueue ${op.value} at the back. Queue size: ${items.length}`,
            codeLine: 4,
            action: 'enqueue',
            pointers: { front: 0, back: items.length - 1 },
          });
        } else if (op.type === 'dequeue' && items.length > 0) {
          const val = items[0];
          steps.push({
            elements: [...items],
            highlighted: [0],
            description: `Dequeue ${val} from the front. Queue size will be: ${items.length - 1}`,
            codeLine: 8,
            action: 'dequeue',
            pointers: { front: 0, back: items.length - 1 },
          });
          items.shift();
          steps.push({
            elements: [...items],
            highlighted: [],
            description: `Removed ${val}. Queue size: ${items.length}`,
            codeLine: 8,
            action: 'dequeue',
            pointers: items.length > 0 ? { front: 0, back: items.length - 1 } : {},
          });
        }
      }
      return steps;
    },
  };
}

// ============ LINKED LIST ============
function linkedListOperations(): DSAlgorithm {
  return {
    id: 'linked-list',
    name: 'Linked List',
    description: 'A linear data structure where each element (node) contains a value and a pointer to the next node.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    operations: ['insert', 'delete'],
    code: [
      'class Node {',
      '  constructor(val) {',
      '    this.val = val;',
      '    this.next = null;',
      '  }',
      '}',
      '',
      'function insert(head, val, pos) {',
      '  const node = new Node(val);',
      '  if (pos === 0) {',
      '    node.next = head;',
      '    return node;',
      '  }',
      '  let curr = head, i = 0;',
      '  while (i < pos - 1 && curr) {',
      '    curr = curr.next; i++;',
      '  }',
      '  node.next = curr.next;',
      '  curr.next = node;',
      '  return head;',
      '}',
    ],
    run: (ops: { type: 'insert' | 'delete'; value?: number; index?: number }[]): DataStructureStep[] => {
      const steps: DataStructureStep[] = [];
      const items: number[] = [];

      steps.push({
        elements: [...items],
        highlighted: [],
        description: 'Empty linked list initialized.',
        codeLine: 0,
        action: 'init',
        pointers: {},
      });

      for (const op of ops) {
        if (op.type === 'insert' && op.value !== undefined) {
          const idx = op.index !== undefined ? Math.min(op.index, items.length) : items.length;
          // Show traversal
          for (let i = 0; i < idx && i < items.length; i++) {
            steps.push({
              elements: [...items],
              highlighted: [i],
              description: `Traversing to position ${idx}... at node ${i}`,
              codeLine: 14,
              action: 'traverse',
              pointers: { current: i },
            });
          }
          items.splice(idx, 0, op.value);
          steps.push({
            elements: [...items],
            highlighted: [idx],
            description: `Inserted ${op.value} at position ${idx}. List size: ${items.length}`,
            codeLine: 18,
            action: 'insert',
            pointers: { head: 0 },
          });
        } else if (op.type === 'delete' && items.length > 0) {
          const idx = op.index !== undefined ? Math.min(op.index, items.length - 1) : items.length - 1;
          for (let i = 0; i < idx; i++) {
            steps.push({
              elements: [...items],
              highlighted: [i],
              description: `Traversing to position ${idx}... at node ${i}`,
              codeLine: 14,
              action: 'traverse',
              pointers: { current: i },
            });
          }
          const val = items[idx];
          steps.push({
            elements: [...items],
            highlighted: [idx],
            description: `Deleting node with value ${val} at position ${idx}`,
            codeLine: 17,
            action: 'delete',
            pointers: { current: idx },
          });
          items.splice(idx, 1);
          steps.push({
            elements: [...items],
            highlighted: [],
            description: `Removed ${val}. List size: ${items.length}`,
            codeLine: 18,
            action: 'delete',
            pointers: items.length > 0 ? { head: 0 } : {},
          });
        }
      }
      return steps;
    },
  };
}

// ============ BST ============
interface BSTNode {
  val: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

function flattenBST(node: BSTNode | null): number[] {
  if (!node) return [];
  // level-order for visualization
  const result: number[] = [];
  const queue: (BSTNode | null)[] = [node];
  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (curr) {
      result.push(curr.val);
      queue.push(curr.left);
      queue.push(curr.right);
    } else {
      result.push(-1); // placeholder for null
    }
  }
  // trim trailing -1s
  while (result.length > 0 && result[result.length - 1] === -1) result.pop();
  return result;
}

function bstInsert(root: BSTNode | null, val: number, steps: DataStructureStep[]): BSTNode {
  if (!root) {
    const node: BSTNode = { val, left: null, right: null };
    steps.push({
      elements: flattenBST(node),
      highlighted: [0],
      description: `Inserted ${val} as root.`,
      codeLine: 4,
      action: 'insert',
      pointers: {},
      treeData: node,
    });
    return node;
  }

  const path: string[] = [];
  let curr: BSTNode | null = root;
  let parent: BSTNode | null = null;
  let dir: 'left' | 'right' = 'left';

  while (curr) {
    path.push(String(curr.val));
    steps.push({
      elements: flattenBST(root),
      highlighted: [],
      description: `Comparing ${val} with ${curr.val}...`,
      codeLine: 7,
      action: 'traverse',
      pointers: {},
      treeData: root,
    });
    parent = curr;
    if (val < curr.val) {
      dir = 'left';
      curr = curr.left;
    } else {
      dir = 'right';
      curr = curr.right;
    }
  }

  const newNode: BSTNode = { val, left: null, right: null };
  if (parent) {
    parent[dir] = newNode;
  }

  steps.push({
    elements: flattenBST(root),
    highlighted: [],
    description: `Inserted ${val} as ${dir} child of ${parent?.val}.`,
    codeLine: 12,
    action: 'insert',
    pointers: {},
    treeData: root,
  });

  return root;
}

function bstOperations(): DSAlgorithm {
  return {
    id: 'bst',
    name: 'Binary Search Tree',
    description: 'A tree where each node\'s left children are smaller and right children are larger. Enables O(log n) search.',
    timeComplexity: 'O(log n) avg',
    spaceComplexity: 'O(n)',
    operations: ['insert', 'search'],
    code: [
      'class BSTNode {',
      '  constructor(val) {',
      '    this.val = val;',
      '    this.left = this.right = null;',
      '  }',
      '}',
      '',
      'function insert(root, val) {',
      '  if (!root) return new BSTNode(val);',
      '  if (val < root.val)',
      '    root.left = insert(root.left, val);',
      '  else',
      '    root.right = insert(root.right, val);',
      '  return root;',
      '}',
      '',
      'function search(root, val) {',
      '  if (!root) return null;',
      '  if (val === root.val) return root;',
      '  if (val < root.val)',
      '    return search(root.left, val);',
      '  return search(root.right, val);',
      '}',
    ],
    run: (ops: { type: 'insert' | 'search'; value?: number }[]): DataStructureStep[] => {
      const steps: DataStructureStep[] = [];
      let root: BSTNode | null = null;

      steps.push({
        elements: [],
        highlighted: [],
        description: 'Empty BST initialized.',
        codeLine: 0,
        action: 'init',
        pointers: {},
        treeData: null,
      });

      for (const op of ops) {
        if (op.type === 'insert' && op.value !== undefined) {
          root = bstInsert(root, op.value, steps);
        } else if (op.type === 'search' && op.value !== undefined && root) {
          let curr: BSTNode | null = root;
          while (curr) {
            steps.push({
              elements: flattenBST(root),
              highlighted: [],
              description: `Searching: comparing ${op.value} with ${curr.val}`,
              codeLine: 18,
              action: 'traverse',
              pointers: {},
              treeData: root,
            });
            if (op.value === curr.val) {
              steps.push({
                elements: flattenBST(root),
                highlighted: [],
                description: `Found ${op.value}!`,
                codeLine: 18,
                action: 'found',
                pointers: {},
                treeData: root,
              });
              break;
            }
            curr = op.value < curr.val ? curr.left : curr.right;
          }
          if (!curr) {
            steps.push({
              elements: flattenBST(root),
              highlighted: [],
              description: `${op.value} not found in the tree.`,
              codeLine: 17,
              action: 'not-found',
              pointers: {},
              treeData: root,
            });
          }
        }
      }
      return steps;
    },
  };
}

// ============ AVL TREE ============
interface AVLNode {
  val: number;
  left: AVLNode | null;
  right: AVLNode | null;
  height: number;
}

function avlHeight(node: AVLNode | null): number {
  return node ? node.height : 0;
}

function avlBalance(node: AVLNode | null): number {
  return node ? avlHeight(node.left) - avlHeight(node.right) : 0;
}

function flattenAVL(node: AVLNode | null): number[] {
  if (!node) return [];
  const result: number[] = [];
  const queue: (AVLNode | null)[] = [node];
  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (curr) {
      result.push(curr.val);
      queue.push(curr.left);
      queue.push(curr.right);
    } else {
      result.push(-1);
    }
  }
  while (result.length > 0 && result[result.length - 1] === -1) result.pop();
  return result;
}

function rotateRight(y: AVLNode, steps: DataStructureStep[], root: AVLNode): AVLNode {
  const x = y.left!;
  const T2 = x.right;
  x.right = y;
  y.left = T2;
  y.height = Math.max(avlHeight(y.left), avlHeight(y.right)) + 1;
  x.height = Math.max(avlHeight(x.left), avlHeight(x.right)) + 1;
  steps.push({
    elements: flattenAVL(root),
    highlighted: [],
    description: `Right rotation on node ${y.val}`,
    codeLine: 8,
    action: 'rotate',
    pointers: {},
    treeData: root,
  });
  return x;
}

function rotateLeft(x: AVLNode, steps: DataStructureStep[], root: AVLNode): AVLNode {
  const y = x.right!;
  const T2 = y.left;
  y.left = x;
  x.right = T2;
  x.height = Math.max(avlHeight(x.left), avlHeight(x.right)) + 1;
  y.height = Math.max(avlHeight(y.left), avlHeight(y.right)) + 1;
  steps.push({
    elements: flattenAVL(root),
    highlighted: [],
    description: `Left rotation on node ${x.val}`,
    codeLine: 12,
    action: 'rotate',
    pointers: {},
    treeData: root,
  });
  return y;
}

function avlInsertNode(node: AVLNode | null, val: number, steps: DataStructureStep[], rootRef: { root: AVLNode | null }): AVLNode {
  if (!node) {
    const n: AVLNode = { val, left: null, right: null, height: 1 };
    return n;
  }

  steps.push({
    elements: flattenAVL(rootRef.root),
    highlighted: [],
    description: `Comparing ${val} with ${node.val}...`,
    codeLine: 3,
    action: 'traverse',
    pointers: {},
    treeData: rootRef.root,
  });

  if (val < node.val) {
    node.left = avlInsertNode(node.left, val, steps, rootRef);
  } else if (val > node.val) {
    node.right = avlInsertNode(node.right, val, steps, rootRef);
  } else {
    return node; // no duplicates
  }

  node.height = 1 + Math.max(avlHeight(node.left), avlHeight(node.right));
  const balance = avlBalance(node);

  // Left Left
  if (balance > 1 && val < node.left!.val) {
    return rotateRight(node, steps, rootRef.root!);
  }
  // Right Right
  if (balance < -1 && val > node.right!.val) {
    return rotateLeft(node, steps, rootRef.root!);
  }
  // Left Right
  if (balance > 1 && val > node.left!.val) {
    node.left = rotateLeft(node.left!, steps, rootRef.root!);
    return rotateRight(node, steps, rootRef.root!);
  }
  // Right Left
  if (balance < -1 && val < node.right!.val) {
    node.right = rotateRight(node.right!, steps, rootRef.root!);
    return rotateLeft(node, steps, rootRef.root!);
  }

  return node;
}

function avlOperations(): DSAlgorithm {
  return {
    id: 'avl',
    name: 'AVL Tree',
    description: 'A self-balancing BST where the heights of subtrees differ by at most 1. Rotations maintain balance after insertions.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    operations: ['insert'],
    code: [
      'function insert(node, val) {',
      '  if (!node) return new Node(val);',
      '',
      '  if (val < node.val)',
      '    node.left = insert(node.left, val);',
      '  else if (val > node.val)',
      '    node.right = insert(node.right, val);',
      '',
      '  node.height = 1 + max(h(left), h(right));',
      '  balance = h(left) - h(right);',
      '',
      '  // Left Left → rotateRight',
      '  // Right Right → rotateLeft',
      '  // Left Right → rotateLeft(left), rotateRight',
      '  // Right Left → rotateRight(right), rotateLeft',
      '  return node;',
      '}',
    ],
    run: (ops: { type: 'insert'; value?: number }[]): DataStructureStep[] => {
      const steps: DataStructureStep[] = [];
      const rootRef: { root: AVLNode | null } = { root: null };

      steps.push({
        elements: [],
        highlighted: [],
        description: 'Empty AVL tree initialized.',
        codeLine: 0,
        action: 'init',
        pointers: {},
        treeData: null,
      });

      for (const op of ops) {
        if (op.type === 'insert' && op.value !== undefined) {
          rootRef.root = avlInsertNode(rootRef.root, op.value, steps, rootRef);
          steps.push({
            elements: flattenAVL(rootRef.root),
            highlighted: [],
            description: `Inserted ${op.value}. Tree is balanced.`,
            codeLine: 15,
            action: 'insert',
            pointers: {},
            treeData: rootRef.root,
          });
        }
      }
      return steps;
    },
  };
}

export const dsAlgorithms: DSAlgorithm[] = [
  stackOperations(),
  queueOperations(),
  linkedListOperations(),
  bstOperations(),
  avlOperations(),
];
