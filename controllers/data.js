const treeData = [
  {
    id: 2,
    name: 'Child 1.1',
    children: [
      {
        id: 3,
        name: 'Child 1.1.1',
        children: [],
      },
      { 
        id: 4, 
        name: 'Child 1.1.2', 
        children: [
          { 
            id: 5, 
            name: 'Child 1.1.2', 
            children: [] 
          },
        ],
      },
    ],
  },
];

// Sample tree data
const treeData = [
  {
    id: 1,
    name: 'Parent 1',
    children: [
      {
        id: 2,
        name: 'Child 1.1',
        children: [
          {
            id: 3,
            name: 'Child 1.1.1',
            children: [],
          },
          { id: 4, name: 'Child 1.1.2', children: [] },
        ],
      },
      {
        id: 5,
        name: 'Child 1.2',
        children: [],
      },
    ],
  },
  {
    id: 6,
    name: 'Parent 2',
    children: [
      { id: 7, name: 'Child 2.1', children: [] },
      { id: 8, name: 'Child 2.2', children: [] },
    ],
  },
];

// Function to find a node by id
function findNode(tree, nodeId) {
  for (let node of tree) {
    if (node.id === nodeId) {
      return node; // Return the node if found
    }
    if (node.children.length > 0) {
      const found = findNode(node.children, nodeId); // Recursively search in children
      if (found) return found; // Return the found node if not null
    }
  }
  return null; // Return null if node not found
}

// Example usage
const node = findNode(treeData, 2);
console.log(node);



const data = [
  {
    name: "David",
    attributes: { id: "CSI202401" },
    nodeSvgShape: {
      shape: "image",
      shapeProps: { href: pic, width: 50, height: 50 },
    },
    children: [
      {
        name: "Reenu",
        attributes: { id: "CSI202403" },
        nodeSvgShape: {
          shape: "image",
          shapeProps: { href: pic, width: 50, height: 50 },
        },
        children: [
          {
            name: "Joseph",
            attributes: { id: "CSI202405" },
            nodeSvgShape: {
              shape: "image",
              shapeProps: {
                href: pic,
                width: 50,
                height: 50,
              },
            },
            children: [
              {
                name: "mercy",
                attributes: { id: "CSI202405" },
                nodeSvgShape: {
                  shape: "image",
                  shapeProps: {
                    href: pic,
                    width: 50,
                    height: 50,
                  },
                },
                children: [
                  {
                    name: "livin",
                    attributes: { id: "CSI202405" },
                    nodeSvgShape: {
                      shape: "image",
                      shapeProps: {
                        href: pic,
                        width: 50,
                        height: 50,
                      },
                    },
                    children: [
                      {
                        name: "Add",
                        attributes: "",
                        nodeSvgShape: {
                          shape: "image",
                          shapeProps: {
                            href: add,
                            width: 50,
                            height: 50,
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

function traverseAndAdd(node, parentId, newObject) {
  if (node.attributes.id === parentId) {
    if (!node.children) {
      node.children = [];
    }
    node.children.push(newObject);
    return true;
  }
  if (node.children) {
    for (const child of node.children) {
      const added = traverseAndAdd(child, parentId, newObject);
      if (added) return true;
    }
  }
  return false;
}

const newObject = {
  name: "New Node",
  attributes: { id: "CSI202406" },
  nodeSvgShape: {
    shape: "image",
    shapeProps: {
      href: newPic,
      width: 50,
      height: 50,
    },
  },
  children: [],
};

const parentId = "CSI202405"; // Specify the parent ID where you want to add the new object
traverseAndAdd(data[0], parentId, newObject);

console.log(JSON.stringify(data, null, 2));



























my mongodb data is :
famyli collection: [{
  "_id": {
    "$oid": "66750176ea8629de4a2c3bf0"
  },
  "family_id": "VKDFAM00001",
  "head": "VKDMBR000001",
  "members": [
    {
      "relationship_with_family_head": "Wife",
      "ref_id": "VKDMBR000002"
    },
    {
      "relationship_with_family_head": "Son",
      "ref_id": "VKDMBR000003"
    },
    {
      "relationship_with_family_head": "Daughter",
      "ref_id": "VKDMBR000004"
    },
    {
      "relationship_with_family_head": "Son",
      "ref_id": "VKDMBR000018"
    }
  ],
  "__v": 4
},
{
  "_id": {
    "$oid": "667502b8ea8629de4a2c3c57"
  },
  "family_id": "VKDFAM00002",
  "head": "VKDMBR000003",
  "members": [],
  "__v": 0
},
{
  "_id": {
    "$oid": "66750365ea8629de4a2c3c7c"
  },
  "family_id": "VKDFAM00003",
  "head": "VKDMBR000004",
  "members": [],
  "__v": 0
},
{
  "_id": {
    "$oid": "667542ca1fa846e1ef46ae45"
  },
  "family_id": "VKDFAM00004",
  "head": "VKDMBR000005",
  "members": [
    {
      "relationship_with_family_head": "Wife",
      "ref_id": "VKDMBR000006"
    },
    {
      "relationship_with_family_head": "Son",
      "ref_id": "VKDMBR000007"
    },
    {
      "relationship_with_family_head": "Daughter",
      "ref_id": "VKDMBR000008"
    }
  ],
  "__v": 3
},
{
  "_id": {
    "$oid": "667544aa1fa846e1ef46aef9"
  },
  "family_id": "VKDFAM00005",
  "head": "VKDMBR000007",
  "members": [],
  "__v": 0
},
{
  "_id": {
    "$oid": "667546351fa846e1ef46af43"
  },
  "family_id": "VKDFAM00006",
  "head": "VKDMBR000008",
  "members": [],
  "__v": 0
},
{
  "_id": {
    "$oid": "66755a5032c826d651a4a287"
  },
  "family_id": "VKDFAM00007",
  "head": "VKDMBR000009",
  "members": [
    {
      "relationship_with_family_head": "Wife",
      "ref_id": "VKDMBR000010"
    },
    {
      "relationship_with_family_head": "Daughter",
      "ref_id": "VKDMBR000011"
    },
    {
      "relationship_with_family_head": "Son",
      "ref_id": "VKDMBR000012"
    },
    {
      "relationship_with_family_head": "Son",
      "ref_id": "VKDMBR000013"
    }
  ],
  "__v": 4
},
{
  "_id": {
    "$oid": "66755ce432c826d651a4a3e1"
  },
  "family_id": "VKDFAM00008",
  "head": "VKDMBR000013",
  "members": [],
  "__v": 0
},
{
  "_id": {
    "$oid": "66755de432c826d651a4a53d"
  },
  "family_id": "VKDFAM00009",
  "head": "VKDMBR000012",
  "members": [
    {
      "relationship_with_family_head": "Wife",
      "ref_id": "VKDMBR000014"
    },
    {
      "relationship_with_family_head": "Son",
      "ref_id": "VKDMBR000015"
    }
  ],
  "__v": 2
},
{
  "_id": {
    "$oid": "6675604432c826d651a4a631"
  },
  "family_id": "VKDFAM00010",
  "head": "VKDMBR000015",
  "members": [
    {
      "relationship_with_family_head": "Wife",
      "ref_id": "VKDMBR000016"
    },
    {
      "relationship_with_family_head": "Son",
      "ref_id": "VKDMBR000017"
    }
  ],
  "__v": 2
}]

and 
member collection is: [
  {
    "_id": {
      "$oid": "667e8f04d6630fbc1c2703dd"
    },
    "primary_family_id": "VKDFAM00001",
    "secondary_family_id": null,
    "member_id": "VKDMBR000001",
    "assigned_member_id": "1234",
    "mobile_number": "1242424",
    "member_name": "abcd",
    "member_tamil_name": "wieunw",
    "gender": "Male",
    "date_of_birth": {
      "$date": "3223-12-22T00:00:00.000Z"
    },
    "email": "ascsd@gmail.com",
    "occupation": "elaiya",
    "community": "comi",
    "nationality": "india",
    "member_photo": "/uploads/1719570179397.png",
    "permanent_address": {
      "address": "xyz",
      "city": "xzy",
      "district": "sdfs",
      "state": "tn",
      "zip_code": "123456",
      "country": "india"
    },
    "present_address": {
      "address": "xyz",
      "city": "xzy",
      "district": "sdfs",
      "state": "tn",
      "zip_code": "123456",
      "country": "india"
    },
    "baptized_date": {
      "$date": "2024-06-14T00:00:00.000Z"
    },
    "communion_date": {
      "$date": "2024-06-21T00:00:00.000Z"
    },
    "marriage_date": {
      "$date": "2024-06-28T00:00:00.000Z"
    },
    "joined_date": {
      "$date": "2024-06-28T10:20:40.000Z"
    },
    "left_date": null,
    "reason_for_inactive": null,
    "description": null,
    "rejoining_date": null,
    "reason_for_rejoining": null,
    "status": "Active",
    "createdAt": {
      "$date": "2024-06-28T10:23:00.184Z"
    },
    "updatedAt": {
      "$date": "2024-06-28T10:23:00.184Z"
    },
    "__v": 0
  },
  {
    "_id": {
      "$oid": "667501b8ea8629de4a2c3c03"
    },
    "primary_family_id": "VKDFAM00001",
    "secondary_family_id": null,
    "member_id": "VKDMBR000002",
    "assigned_member_id": "1234567",
    "mobile_number": "123456789",
    "member_name": "Reenu",
    "member_tamil_name": "Reenu",
    "gender": "Female",
    "date_of_birth": {
      "$date": "2024-06-21T00:00:00.000Z"
    },
    "email": "reenu@gmail.com",
    "occupation": "Nurse",
    "community": "BC",
    "nationality": "India",
    "permanent_address": {
      "address": "37/8",
      "city": "ambathur",
      "district": "chennai",
      "state": "tamil Nadu",
      "zip_code": "600018",
      "country": "india"
    },
    "member_photo": "/uploads/1719570179397.png",
    "present_address": {
      "address": "37/8",
      "city": "ambathur",
      "district": "chennai",
      "state": "tamil Nadu",
      "zip_code": "600018",
      "country": "india"
    },
    "baptized_date": {
      "$date": "2024-06-21T00:00:00.000Z"
    },
    "communion_date": {
      "$date": "2024-06-21T00:00:00.000Z"
    },
    "marriage_date": {
      "$date": "2024-06-21T00:00:00.000Z"
    },
    "joined_date": {
      "$date": "2024-06-21T04:29:01.000Z"
    },
    "left_date": null,
    "reason_for_inactive": null,
    "description": null,
    "rejoining_date": null,
    "reason_for_rejoining": null,
    "status": "Active",
    "__v": 0
  },
  {
    "_id": {
      "$oid": "66750213ea8629de4a2c3c16"
    },
    "primary_family_id": "VKDFAM00001",
    "secondary_family_id": "VKDFAM00002",
    "member_id": "VKDMBR000003",
    "assigned_member_id": "1234567",
    "mobile_number": "123456789",
    "member_name": "vicky",
    "member_tamil_name": "vicky",
    "gender": "Male",
    "date_of_birth": {
      "$date": "2024-06-21T00:00:00.000Z"
    },
    "email": "vigneshvicky3122@gmail.com",
    "occupation": "sjgnitj",
    "community": "dgh5",
    "nationality": "Indian",
    "member_photo": "/uploads/1719570179397.png",
    "permanent_address": {
      "address": "37/8",
      "city": "ambathur",
      "district": "chennai",
      "state": "tamil Nadu",
      "zip_code": "600018",
      "country": "india"
    },
    "present_address": {
      "address": "37/8",
      "city": "ambathur",
      "district": "chennai",
      "state": "tamil Nadu",
      "zip_code": "600018",
      "country": "india"
    },
    "baptized_date": {
      "$date": "2024-06-21T00:00:00.000Z"
    },
    "communion_date": {
      "$date": "2024-06-21T00:00:00.000Z"
    },
    "marriage_date": {
      "$date": "2024-06-22T00:00:00.000Z"
    },
    "joined_date": {
      "$date": "2024-06-21T04:30:20.000Z"
    },
    "left_date": null,
    "reason_for_inactive": null,
    "description": null,
    "rejoining_date": null,
    "reason_for_rejoining": null,
    "status": "Active",
    "__v": 0
  },
  {
    "_id": {
      "$oid": "6675024bea8629de4a2c3c2b"
    },
    "primary_family_id": "VKDFAM00001",
    "secondary_family_id": "VKDFAM00003",
    "member_id": "VKDMBR000004",
    "assigned_member_id": "1234567",
    "mobile_number": "123456789",
    "member_name": "jecy",
    "member_tamil_name": "ஆங்கிலம்",
    "gender": "Female",
    "date_of_birth": {
      "$date": "2024-06-21T00:00:00.000Z"
    },
    "email": "jecy@gmail.com",
    "occupation": "tert",
    "community": "nnnnn",
    "nationality": "fuy5k",
    "member_photo": "/uploads/1719570179397.png",
    "permanent_address": {
      "address": "37/7",
      "city": "ambathurr",
      "district": "chennai",
      "state": "tamilNadu",
      "zip_code": "600018",
      "country": "india"
    },
    "present_address": {
      "address": "37/7",
      "city": "ambathurr",
      "district": "chennai",
      "state": "tamilNadu",
      "zip_code": "600018",
      "country": "india"
    },
    "baptized_date": {
      "$date": "2024-06-22T00:00:00.000Z"
    },
    "communion_date": {
      "$date": "2024-06-21T00:00:00.000Z"
    },
    "marriage_date": null,
    "joined_date": {
      "$date": "2024-06-21T04:35:22.000Z"
    },
    "left_date": null,
    "reason_for_inactive": null,
    "description": null,
    "rejoining_date": "2024-06-21",
    "reason_for_rejoining": "hjfuhm",
    "status": "Active",
    "__v": 0
  },
  {
    "_id": {
      "$oid": "667542ca1fa846e1ef46ae47"
    },
    "primary_family_id": "VKDFAM00004",
    "secondary_family_id": null,
    "member_id": "VKDMBR000005",
    "assigned_member_id": "1234567",
    "mobile_number": "123456789",
    "member_name": "Vignesh",
    "member_tamil_name": "Vigensh",
    "gender": "Male",
    "date_of_birth": {
      "$date": "2024-06-21T00:00:00.000Z"
    },
    "email": "vignesh.spanglesinfotech@gmail.com",
    "occupation": "Nurse",
    "community": "BC",
    "nationality": "India",
    "member_photo": "/uploads/1719570179397.png",
    "permanent_address": {
      "address": "37/8",
      "city": "ambathur",
      "district": "chennai",
      "state": "tamil Nadu",
      "zip_code": "600018",
      "country": "india"
    },
    "present_address": {
      "address": "37/8",
      "city": "ambathur",
      "district": "chennai",
      "state": "tamil Nadu",
      "zip_code": "600018",
      "country": "india"
    },
    "baptized_date": {
      "$date": "2024-06-21T00:00:00.000Z"
    },
    "communion_date": {
      "$date": "2024-06-21T00:00:00.000Z"
    },
    "marriage_date": null,
    "joined_date": {
      "$date": "2024-06-21T09:06:28.000Z"
    },
    "left_date": {
      "$date": "2024-06-21T09:13:50.000Z"
    },
    "reason_for_inactive": "Death",
    "description": "dv",
    "rejoining_date": null,
    "reason_for_rejoining": null,
    "status": "Inactive",
    "__v": 0
  },
  {
    "_id": {
      "$oid": "6675432f1fa846e1ef46ae54"
    },
    "primary_family_id": "VKDFAM00004",
    "secondary_family_id": null,
    "member_id": "VKDMBR000006",
    "assigned_member_id": "1234567",
    "mobile_number": "123456789",
    "member_name": "Reenu",
    "member_tamil_name": "Reenu",
    "gender": "Female",
    "date_of_birth": {
      "$date": "2024-06-21T00:00:00.000Z"
    },
    "email": "reenu@gmail.com",
    "occupation": "Nurse",
    "community": "BC",
    "nationality": "India",
    "member_photo": "/uploads/1719570179397.png",
    "permanent_address": {
      "address": "37/8",
      "city": "ambathur",
      "district": "chennai",
      "state": "tamil Nadu",
      "zip_code": "600018",
      "country": "india"
    },
    "present_address": {
      "address": "37/8",
      "city": "ambathur",
      "district": "chennai",
      "state": "tamil Nadu",
      "zip_code": "600018",
      "country": "india"
    },
    "baptized_date": {
      "$date": "2024-06-21T00:00:00.000Z"
    },
    "communion_date": {
      "$date": "2024-06-22T00:00:00.000Z"
    },
    "marriage_date": {
      "$date": "2024-06-21T00:00:00.000Z"
    },
    "joined_date": {
      "$date": "2024-06-21T09:07:42.000Z"
    },
    "left_date": null,
    "reason_for_inactive": null,
    "description": null,
    "rejoining_date": null,
    "reason_for_rejoining": null,
    "status": "Active",
    "__v": 0
  },
  {
    "_id": {
      "$oid": "667543c11fa846e1ef46ae97"
    },
    "primary_family_id": "VKDFAM00004",
    "secondary_family_id": "VKDFAM00005",
    "member_id": "VKDMBR000007",
    "assigned_member_id": "1234567",
    "mobile_number": "123456789",
    "member_name": "vicky",
    "member_tamil_name": "vicky",
    "gender": "Male",
    "date_of_birth": {
      "$date": "2024-06-21T00:00:00.000Z"
    },
    "email": "vigneshvicky3122@gmail.com",
    "occupation": "tert",
    "community": "BC",
    "nationality": "India",
    "member_photo": "/uploads/1719570179397.png",
    "permanent_address": {
      "address": "Joe Daniel st,",
      "city": "Nagercoil",
      "district": "KK",
      "state": "Tamil Nadu",
      "zip_code": "629003",
      "country": "India"
    },
    "present_address": {
      "address": "Joe Daniel st,",
      "city": "Nagercoil",
      "district": "",
      "state": "Tamil Nadu",
      "zip_code": "629003",
      "country": "India"
    },
    "baptized_date": {
      "$date": "2015-01-11T00:00:00.000Z"
    },
    "communion_date": {
      "$date": {
        "$numberLong": "-283996800000"
      }
    },
    "marriage_date": {
      "$date": "2015-01-01T00:00:00.000Z"
    },
    "joined_date": {
      "$date": "2024-06-21T10:44:43.000Z"
    },
    "left_date": null,
    "reason_for_inactive": null,
    "description": null,
    "rejoining_date": null,
    "reason_for_rejoining": null,
    "status": "Active",
    "__v": 0
  },
  {
    "_id": {
      "$oid": "66755afa32c826d651a4a2cc"
    },
    "primary_family_id": "VKDFAM00007",
    "secondary_family_id": null,
    "member_id": "VKDMBR000010",
    "assigned_member_id": "22334455",
    "mobile_number": "9876543210",
    "member_name": "jency",
    "member_tamil_name": "ஜென்சி ",
    "gender": "Female",
    "date_of_birth": {
      "$date": {
        "$numberLong": "-538272000000"
      }
    },
    "email": "jecy@gmail.com",
    "occupation": "Homemaker",
    "community": "BC",
    "nationality": "Indian",
    "member_photo": "/uploads/1719570179397.png",
    "permanent_address": {
      "address": "Joe Daniel st,",
      "city": "Nagercoil",
      "district": "KK",
      "state": "Tamil Nadu",
      "zip_code": "629003",
      "country": "India"
    },
    "present_address": {
      "address": "Joe Daniel st,",
      "city": "Nagercoil",
      "district": "KK",
      "state": "Tamil Nadu",
      "zip_code": "629003",
      "country": "India"
    },
    "baptized_date": {
      "$date": "2001-01-01T00:00:00.000Z"
    },
    "communion_date": {
      "$date": "2012-12-12T00:00:00.000Z"
    },
    "marriage_date": {
      "$date": "2015-01-15T00:00:00.000Z"
    },
    "joined_date": {
      "$date": "2024-06-21T10:48:27.000Z"
    },
    "left_date": null,
    "reason_for_inactive": null,
    "description": null,
    "rejoining_date": null,
    "reason_for_rejoining": null,
    "status": "Active",
    "__v": 0
  },
  {
    "_id": {
      "$oid": "66755b7d32c826d651a4a2fb"
    },
    "primary_family_id": "VKDFAM00007",
    "secondary_family_id": null,
    "member_id": "VKDMBR000011",
    "assigned_member_id": "445566",
    "mobile_number": "9876543210",
    "member_name": "Priya",
    "member_tamil_name": " பிரியா",
    "gender": "Female",
    "date_of_birth": {
      "$date": "1987-08-01T00:00:00.000Z"
    },
    "email": "jecy@gmail.com",
    "occupation": "Homemaker",
    "community": "BC",
    "nationality": "Indian",
    "member_photo": "/uploads/1719570179397.png",
    "permanent_address": {
      "address": "Joe Daniel st,",
      "city": "Nagercoil",
      "district": "KK",
      "state": "Tamil Nadu",
      "zip_code": "629003",
      "country": "India"
    },
    "present_address": {
      "address": "Joe Daniel st,",
      "city": "Nagercoil",
      "district": "KK",
      "state": "Tamil Nadu",
      "zip_code": "629003",
      "country": "India"
    },
    "baptized_date": {
      "$date": "2001-01-01T00:00:00.000Z"
    },
    "communion_date": {
      "$date": "2002-02-02T00:00:00.000Z"
    },
    "marriage_date": {
      "$date": "2003-03-03T00:00:00.000Z"
    },
    "joined_date": {
      "$date": "2024-06-21T10:54:19.000Z"
    },
    "left_date": null,
    "reason_for_inactive": "Married",
    "description": "left",
    "rejoining_date": "2024-06-21",
    "reason_for_rejoining": "divorce",
    "status": "Active",
    "__v": 0
  },
  {
    "_id": {
      "$oid": "66755c8e32c826d651a4a3aa"
    },
    "primary_family_id": "VKDFAM00007",
    "secondary_family_id": "VKDFAM00009",
    "member_id": "VKDMBR000012",
    "assigned_member_id": "556677",
    "mobile_number": "9876543321",
    "member_name": "Kabir",
    "member_tamil_name": "கபீர்",
    "gender": "Male",
    "date_of_birth": {
      "$date": "2003-02-01T00:00:00.000Z"
    },
    "email": "r@gmail.com",
    "occupation": "Teacher",
    "community": "BC",
    "nationality": "Indian",
    "member_photo": "/uploads/1719570179397.png",

    "permanent_address": {
      "address": "Joe Daniel st,",
      "city": "Nagercoil",
      "district": "KK",
      "state": "Tamil Nadu",
      "zip_code": "629003",
      "country": "India"
    },
    "present_address": {
      "address": "Joe Daniel st,",
      "city": "Nagercoil",
      "district": "KK",
      "state": "Tamil Nadu",
      "zip_code": "629003",
      "country": "India"
    },
    "baptized_date": {
      "$date": "2020-03-02T00:00:00.000Z"
    },
    "communion_date": {
      "$date": "2000-02-02T00:00:00.000Z"
    },
    "marriage_date": {
      "$date": "2000-02-10T00:00:00.000Z"
    },
    "joined_date": {
      "$date": "2024-06-21T10:55:13.000Z"
    },
    "left_date": null,
    "reason_for_inactive": null,
    "description": null,
    "rejoining_date": null,
    "reason_for_rejoining": null,
    "status": "Active",
    "__v": 0
  },
  {
    "_id": {
      "$oid": "66755c9332c826d651a4a3af"
    },
    "primary_family_id": "VKDFAM00007",
    "secondary_family_id": "VKDFAM00008",
    "member_id": "VKDMBR000013",
    "assigned_member_id": "556677",
    "mobile_number": "9876543321",
    "member_name": "Kabira ",
    "member_tamil_name": "கபீர்k",
    "gender": "Male",
    "date_of_birth": {
      "$date": "2003-02-01T00:00:00.000Z"
    },
    "email": "r@gmail.com",
    "occupation": "Teacher",
    "community": "BC",
    "nationality": "Indian",
    "member_photo": "/uploads/1719570179397.png",

    "permanent_address": {
      "address": "Joe Daniel st,",
      "city": "Nagercoil",
      "district": "KK",
      "state": "Tamil Nadu",
      "zip_code": "629003",
      "country": "India"
    },
    "present_address": {
      "address": "Joe Daniel st,",
      "city": "Nagercoil",
      "district": "KK",
      "state": "Tamil Nadu",
      "zip_code": "629003",
      "country": "India"
    },
    "baptized_date": {
      "$date": "2020-03-02T00:00:00.000Z"
    },
    "communion_date": {
      "$date": "2000-02-02T00:00:00.000Z"
    },
    "marriage_date": {
      "$date": "2000-02-02T00:00:00.000Z"
    },
    "joined_date": {
      "$date": "2024-06-21T10:55:13.000Z"
    },
    "left_date": null,
    "reason_for_inactive": null,
    "description": null,
    "rejoining_date": null,
    "reason_for_rejoining": null,
    "status": "Active",
    "__v": 0
  },
 
]

my code is: const familyTreeMembers = async (req, res) => {
  const id = "VKDFAM00001";

  try {
    const array = await Family.find({ family_id: id }).lean();
    console.log(array[0]);
    for (const family of array) {
      let Data = [];
      if (family.head) {
        const familyHead = await Member.findOne({ member_id: family.head })
          .select("-_id member_name member_id member_photo")
          .lean();
        // console.log(familyHead);
        Data.push({
          name: familyHead.member_name,
          attributes: { id: familyHead.member_id },
          nodeSvgShape: {
            shape: "image",
            shapeProps: {
              href: `${process.env.BACKEND_URL}${familyHead.member_photo}`,
              width: 50,
              height: 50
            }
          }
        });
      }
      if (family.members) {
        for (const FamilyMembers of array[0].members) {
          console.log(FamilyMembers);
          if (FamilyMembers.relationship_with_family_head === "Wife") {
            const familyWife = await Member.findOne({ 
              member_id: FamilyMembers.ref_id
            })
              .select("-_id member_name member_id member_photo")
              .lean();
            console.log(familyWife);
            Data.push({children:[{
              name: familyWife.member_name,
              attributes: { id: familyWife.member_id },
              nodeSvgShape: {
                shape: "image",
                shapeProps: {
                  href: `${process.env.BACKEND_URL}${familyWife.member_photo}`,
                  width: 50,
                  height: 50
                }
              }
            }]});
           
          
          }
        }
      }
      // console.log(Data[0].nodeSvgShape.shapeProps);
      console.log(Data);
    }
  } catch (error) {
    //  return error.message
    console.log(error.message);

    // return res
    //   .status(500)
    //   .json({ message: "Failed to fetch member", error: error.message });
  }
};
familyTreeMembers();

you continue to develop my expected out put
expected output is : 
const Data = [
  {
    name: "David",
    attributes: { id: "CSI202401" },
    nodeSvgShape: {
      shape: "image",
      shapeProps: { href: pic, width: 50, height: 50 }
    },
    children: [
      {
        id:1,
        name: "Reenu",
        attributes: { id: "CSI202403" },
        nodeSvgShape: {
          shape: "image",
          shapeProps: { href: pic, width: 50, height: 50 }
        },
        children: [
          {
            id:2,
            name: "Joseph",
            attributes: { id: "CSI202405" },
            nodeSvgShape: {
              shape: "image",
              shapeProps: { href: pic, width: 50, height: 50 },
              children: []
   

            },  {
              id:3,
              name: "Joseph",
              attributes: { id: "CSI202405" },
              nodeSvgShape: {
                shape: "image",
                shapeProps: { href: pic, width: 50, height: 50 }
              },
               children: [  {
                id:4,
                name: "Joseph",
                attributes: { id: "CSI202405" },
                nodeSvgShape: {
                  shape: "image",
                  shapeProps: { href: pic, width: 50, height: 50 }
                }}]}
            children: [
              {
                id:5,
                name: "mercy",
                attributes: { id: "CSI202405" },
                nodeSvgShape: {
                  shape: "image",
                  shapeProps: { href: pic, width: 50, height: 50 }
                },
                children: [
                  {
                    id:6,
                    name: "livin",
                    attributes: { id: "CSI202405" },
                    nodeSvgShape: {
                      shape: "image",
                      shapeProps: { href: pic, width: 50, height: 50 }
                    },
                    children: [
                      {
                        id:7,
                        name: "Add",
                        attributes: "",
                        nodeSvgShape: {
                          shape: "image",
                          shapeProps: { href: add, width: 50, height: 50 }
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];











// show me a result of this code.

const treeData = [] 

function findLastId(tree) {
  let maxId = 0;

  function traverse(node) {
    if (node.id > maxId) {
      maxId = node.id;
    }
    if (node.children && node.children.length > 0) {
      for (let child of node.children) {
        traverse(child);
      }
    }
  }

  for (let node of tree) {
    console.log(node);
    // traverse(node);
  }

  return maxId;
}

// Usage example
const lastId = findLastId(treeData);
console.log('Last ID:', lastId);