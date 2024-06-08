class Node {
  constructor(key = null, value = null) {
    this.key = key;
    this.value = value;
    this.parent = null;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor(key = null, value = null) {
    if (key !== null) {
      this.root = new Node(key, value);
      this.list = [];
    } else {
      this.root = null;
    }
  }

  insert(key, value, root = this.root) {
    if (root === null) {
      if (this.root === null) {
        this.root = new Node(key, value);
        this.list = [];
        return this.root;
      }
      return new Node(key, value);
    } else if (root.key < key) {
      root.right = this.insert(key, value, root.right);
      root.right.parent = root;
    } else {
      root.left = this.insert(key, value, root.left);
      root.left.parent = root;
    }
    return root;
  }

  search(key, root = this.root) {
    if (root === null) {
      return null;
    }

    if (root.key === key) {
      return root;
    } else if (root.key < key) {
      return this.search(key, root.right);
    } else {
      return this.search(key, root.left);
    }
  }

  delete(key, root = this.root) {
    let pos = this.search(key, root);

    if (pos === null) {
      console.log("ID is not found");
      return "ID is not found";
    }

    if (pos.left === null && pos.right === null) {
      if (pos.parent === null) {
        this.root = null;
      } else if (pos.parent.right === pos) {
        pos.parent.right = null;
        pos.parent = null;
      } else if (pos.parent.left === pos) {
        pos.parent.left = null;
        pos.parent = null;
      }
    } else if (pos.right === null) {
      if (pos.parent === null) {
        this.root = pos.left;
        pos.left.parent = null;
      } else if (pos.parent.left === pos) {
        pos.parent.left = pos.left;
        pos.left.parent = pos.parent;
      } else if (pos.parent.right === pos) {
        pos.parent.right = pos.left;
        pos.left.parent = pos.parent;
      }
    } else if (pos.left === null) {
      if (pos.parent === null) {
        this.root = pos.right;
        pos.right.parent = null;
      } else if (pos.parent.left === pos) {
        pos.parent.left = pos.right;
        pos.right.parent = pos.parent;
      } else if (pos.parent.right === pos) {
        pos.parent.right = pos.right;
        pos.right.parent = pos.parent;
      }
    } else {
      let temp = this.findMax(pos.left);
      pos.key = temp.key;
      this.delete(temp.key, pos.left);
    }
  }

  isRootDeleted() {
    return this.root === null;
  }

  findMax(root) {
    if (root === null) {
      return null;
    }
    if (root.right === null) {
      return root;
    } else {
      return this.findMax(root.right);
    }
  }

  preorder(root) {
    if (root !== null) {
      this.list.push([root.key, root.value]);
      // console.log(root.key, " - ", root.value);
      this.preorder(root.left);
      this.preorder(root.right);
    }
    return this.list;
  }

  inorder(root) {
    let result = "";
    if (root !== null) {
      result += this.inorder(root.left);
      result += "(" + String(root.key) + "," + String(root.value) + ")";
      result += this.inorder(root.right);
    }
    return result;
  }
}

// let BST = new BinarySearchTree()
// BST.insert(10)
// BST.insert(20)
// BST.insert(5)
// BST.insert(15)
// BST.insert(7)

// console.log((BST.preorder(BST.root)));
// console.log((BST.inorder(BST.root)));

class Hashing {
  constructor(size = 26) {
    this.size = size;
    this.table = new Array(size).fill(null);
    this.length = 0;
  }

  hashFunction(value) {
    let alpha = value[0];
    alpha = alpha.toLowerCase();
    const order = alpha.charCodeAt(0) - 97;
    return order;
  }

  search(key) {
    const index = this.hashFunction(key);
    const tree = this.table[index];

    if (tree === null) {
      return true;
    }
    const result = tree.search(key, tree.root);
    return result === null;
  }

  checkUser(key,pass){
    const index = this.hashFunction(key);
    const tree = this.table[index];
    let isVerified = null;

    if (tree !== null){
      const node = tree.search(key);
      if (node.value == pass)
        return true
      else
        return false
    }
    else
      return false
  }

  insert(key, value) {
    const index = this.hashFunction(key);
    const tree = this.table[index];
    if (tree !== null) {
      tree.insert(key, value, tree.root);
      this.length += 1;
    } else {
      this.table[index] = new BinarySearchTree(key, value);
      this.length += 1;
    }
  }

  delete(key) {
    const index = this.hashFunction(key);
    const root = this.table[index] && this.table[index].root;

    if (this.table[index] === null) {
      console.log("---Check the UserName");
      return;
    }
    const varReturn = this.table[index].delete(key, root);
    if (varReturn === "ID is not found") {
      if (this.table[index].isRootDeleted()) {
        this.table[index] = null;
      }
      console.log("---Key is incorrect");
    } else {
      console.log("---User id Removed");
    }
  }

  convertToString() {
    let string = [];
    for (let tree of this.table) {
      if (tree) {
        string.push(tree.inorder(tree.root));
      } else {
        string.push("None");
      }
    }
    // console.log(this.convertToString())
    return string;
  }

  // don't touch
  toList() {
    const list = [];
    this.table.forEach((element) => {
      if (element !== null) {
        element.list = [];
        list.push(element.preorder(element.root, []));
      }
    });
    // console.log(1234, list);
    return list;
  }
}

let hashingTable = new Hashing();

hashingTable.insert("Mohan", "234912");
hashingTable.insert("Dharun", "785854");
hashingTable.insert("John", "934743");
hashingTable.insert("Alice", "123456");
hashingTable.insert("Bob", "654321");
hashingTable.insert("Charlie", "987654");
hashingTable.insert("David", "567890");
hashingTable.insert("Eve", "901234");
hashingTable.insert("Frank", "345678");
hashingTable.insert("Grace", "876543");
hashingTable.insert("Henry", "234567");
hashingTable.insert("Ivy", "890123");
hashingTable.insert("Jack", "456789");
hashingTable.insert("Kevin", "987654");
hashingTable.insert("Lucy", "234567");
hashingTable.insert("Mary", "890123");
hashingTable.insert("Nancy", "456789");
hashingTable.insert("Oliver", "987654");
hashingTable.insert("Peter", "234567");
hashingTable.insert("Quinn", "890123");
hashingTable.insert("Rose", "456789");
hashingTable.insert("Sam", "987654");
hashingTable.insert("Tom", "234567");
hashingTable.insert("Ursula", "890123");
hashingTable.insert("Victoria", "456789");
hashingTable.insert("Will", "987654");
hashingTable.insert("Xavier", "234567");
hashingTable.insert("Yolanda", "890123");
hashingTable.insert("Zara", "456789");

// console.log(hashingTable.toList());

// function getData(){

// }

// let noClass = 0;
// let hashingTable;

function createInstance() {
  return new Hashing();
}

function insertToHash(obj, array) {
  if (obj === null) {
    obj = new Hashing();
  }
  // console.log(4321, array);
  obj.insert(array[0], array[1]);
  // console.log(obj.convertToString());
  return obj.toList();
}

module.exports = {
  insertToHash,
  createInstance,
};
// export function store() {
//   const user = document.getElementById("username").value;
//   const pass = document.getElementById("password").value;

//   console.log(user, pass);
//   insertToHash([user, pass]);

//   return hashingTable;
// }

// function insertToHash(array) {
//     if (noClass === 0) {
//     hashingTable = new Hashing();
//     console.log(hashingTable.convertToString());
//     hashingTable.insert(array[0], array[1]);
//     noClass = 1;

//     const jsonstr = JSON.stringify(hashingTable);
//     fs.writeFileSync('data.json', jsonString, 'utf-8', (err) => {
//         if (err) throw err;
//         console.log('Data added to file');
//     });

//     return;
//     }
//     hashingTable.insert(array[0], array[1]);
// }

// hashingTable.insert("Zara", "456789");
// console.log(hashingTable.convertToString());

// console.log(hashingTable.search("Jack"));

// hashingTable.delete("Jack");
