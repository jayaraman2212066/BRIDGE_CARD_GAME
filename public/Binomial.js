// class Bid {
//     constructor(suit, level, player) {
//         this.suit = suit;
//         this.level = level;
//         this.player = player;
//     }
// }

// class BinomialNode {
//     constructor(bid) {
//         this.bid = bid;
//         this.degree = 0;
//         this.parent = null;
//         this.child = null;
//         this.sibling = null;
//     }
// }

// class BinomialHeap {
//     constructor() {
//         this.head = null;
//     }

//     merge(heap2) {
//         const newHeap = new BinomialHeap();
//         newHeap.head = this._mergeRoots(this.head, heap2.head);
//         this.head = null;
//         heap2.head = null;
//         return newHeap;
//     }

//     _mergeRoots(root1, root2) {
//         if (root1 === null) {
//             return root2;
//         } else if (root2 === null) {
//             return root1;
//         } else {
//             if (root1.bid.level >= root2.bid.level) {
//                 root1.sibling = this._mergeRoots(root1.sibling, root2);
//                 return root1;
//             } else {
//                 root2.sibling = this._mergeRoots(root2.sibling, root1);
//                 return root2;
//             }
//         }
//     }

//     insert(bid, prevHighestBid) {
//         if (prevHighestBid === null || (bid.level >= prevHighestBid.level && bid.suit >= prevHighestBid.suit && parseInt(bid.level) <= 7) || (bid.level > prevHighestBid.level && bid.suit === prevHighestBid.suit && parseInt(bid.level) <= 7)) {
//             const newNode = new BinomialNode(bid);
//             const newHeap = new BinomialHeap();
//             newHeap.head = newNode;
//             this.head = this.merge(newHeap).head;
//             return 1;
//         } else {
//             console.log("Invalid bid");
//             return 0;
//         }
//     }

//     extractMax() {
//         if (this.head === null) {
//             return null;
//         }
//         let maxNode = this.head;
//         let prevNode = null;
//         let current = this.head;

//         while (current.sibling) {
//             if (current.sibling.bid.level > maxNode.bid.level) {
//                 maxNode = current.sibling;
//                 prevNode = current;
//             }
//             current = current.sibling;
//         }

//         if (prevNode) {
//             prevNode.sibling = maxNode.sibling;
//         } else if (maxNode === this.head) {
//             this.head = maxNode.sibling;
//         }

//         const newHeap = new BinomialHeap();
//         newHeap.head = this._reverseChildren(maxNode.child);
//         this.head = this.merge(newHeap).head;

//         return maxNode.bid;
//     }

//     _reverseChildren(node) {
//         let prevNode = null;
//         let current = node;

//         while (current) {
//             const nextNode = current.sibling;
//             current.sibling = prevNode;
//             prevNode = current;
//             current = nextNode;
//         }

//         return prevNode;
//     }
// }

// // Example usage
// const bidHeap = new BinomialHeap();
// let phb = new Bid('Club', 0, 'Base');
// bidHeap.insert(new Bid('Spades', 3, 'North'), phb);
// phb = new Bid('Spades', 3, 'North');
// bidHeap.insert(new Bid('Hearts', 2, 'East'), phb);
// bidHeap.insert(new Bid('Diamonds', 4, 'South'), phb);


// console.log(bidHeap.extractMax().level); // Output: 4
// console.log(bidHeap.extractMax().level); // Output: 3
// console.log(bidHeap.extractMax().level); // Output: 2
// console.log(bidHeap.extractMax());       // Output: null (Empty heap)


// export function bidInput(){
//     const bidHeap = new BinomialHeap();
//     let phb = new Bid('Club', 0, 'Base');
// };

// window.bidInput = bidInput;



class Bid {
    constructor(suit, level, player) {
        this.suit = suit;
        this.level = level;
        this.player = player;
    }
}

class BinomialNode {
    constructor(bid) {
        this.bid = bid;
        this.degree = 0;
        this.parent = null;
        this.child = null;
        this.sibling = null;
    }
}

class BinomialHeap {
    constructor() {
        this.head = null;
    }

    merge(heap2) {
        this.head = this._mergeRoots(this.head, heap2.head);
        heap2.head = null;
        this._consolidate();
    }

    _mergeRoots(root1, root2) {
        if (!root1) return root2;
        if (!root2) return root1;

        let newHead = null;
        let tail = null;

        while (root1 && root2) {
            let min;
            if (root1.degree <= root2.degree) {
                min = root1;
                root1 = root1.sibling;
            } else {
                min = root2;
                root2 = root2.sibling;
            }
            if (!newHead) {
                newHead = min;
                tail = min;
            } else {
                tail.sibling = min;
                tail = min;
            }
        }

        if (root1) tail.sibling = root1;
        else if (root2) tail.sibling = root2;

        return newHead;
    }

    _consolidate() {
        if (!this.head) return;

        let prev = null;
        let curr = this.head;
        let next = curr.sibling;

        while (next) {
            if (curr.degree !== next.degree || (next.sibling && next.sibling.degree === curr.degree)) {
                prev = curr;
                curr = next;
            } else {
                if (this._compareBids(curr.bid, next.bid) >= 0) {
                    curr.sibling = next.sibling;
                    this._linkTrees(curr, next);
                } else {
                    if (prev) {
                        prev.sibling = next;
                    } else {
                        this.head = next;
                    }
                    this._linkTrees(next, curr);
                    curr = next;
                }
            }
            next = curr.sibling;
        }
    }

    _linkTrees(parent, child) {
        child.parent = parent;
        child.sibling = parent.child;
        parent.child = child;
        parent.degree += 1;
    }

    _compareBids(bid1, bid2) {
        const suitOrder = { 'Spades': 3, 'Hearts': 2, 'Diamonds': 1, 'Clubs': 0 };

        if (bid1.level !== bid2.level) {
            return bid1.level - bid2.level;
        } else {
            return suitOrder[bid1.suit] - suitOrder[bid2.suit];
        }
    }

    findPreviousHighestBid() {
        if (!this.head) return null;

        let maxBid = this.head.bid;
        let current = this.head.sibling;

        while (current) {
            if (this._compareBids(current.bid, maxBid) > 0) {
                maxBid = current.bid;
            }
            current = current.sibling;
        }

        return maxBid;
    }

    insert(bid) {
        const newNode = new BinomialNode(bid);
        const newHeap = new BinomialHeap();
        newHeap.head = newNode;

        this.merge(newHeap);
        return 1;
    }

    extractMax() {
        if (!this.head) return null;

        let maxNode = this.head;
        let maxNodePrev = null;
        let prev = null;
        let curr = this.head;

        while (curr.sibling) {
            if (this._compareBids(curr.sibling.bid, maxNode.bid) > 0) {
                maxNode = curr.sibling;
                maxNodePrev = prev;
            }
            prev = curr;
            curr = curr.sibling;
        }

        if (maxNodePrev) {
            maxNodePrev.sibling = maxNode.sibling;
        } else {
            this.head = maxNode.sibling;
        }

        const newHeap = new BinomialHeap();
        newHeap.head = this._reverseChildren(maxNode.child);
        this.merge(newHeap);

        return maxNode.bid;
    }

    _reverseChildren(node) {
        let prev = null;
        let current = node;

        while (current) {
            const next = current.sibling;
            current.sibling = prev;
            prev = current;
            current = next;
        }

        return prev;
    }
}

// Example usage
const bidHeap = new BinomialHeap();
bidHeap.insert(new Bid('Spades', 3, 'North'));
bidHeap.insert(new Bid('Hearts', 2, 'East'));
bidHeap.insert(new Bid('Diamonds', 4, 'South'));
bidHeap.insert(new Bid('Spades', 4, 'South'));

console.log(bidHeap.extractMax()?.suit); // Output: Diamonds
console.log(bidHeap.extractMax()?.suit); // Output: Spades
console.log(bidHeap.extractMax()?.suit); // Output: Hearts
console.log(bidHeap.extractMax());       // Output: null (Empty heap)
