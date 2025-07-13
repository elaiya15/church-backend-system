const Member = require("../Schema/memberSchema");
const Family = require("../Schema/familySchema");
const generateMemberCode = require("../util/MemberCodeGenerate");
const generateFamilyCode = require("../util/FamilyId");
require("dotenv").config();

// exports.getMembers = async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 15;
//   const status = req.query.status || "";
//   // console.log(limit);
//   const search = req.query.search || "";
//   if (search === "") {
//     try {
//       const familyData = await Family.find()
//         .sort({ _id: 1 })
//         .select("family_id head")
//         .skip((page - 1) * limit)
//         .limit(limit);
//       // console.log(familyMembers);
//       let RegisteredData = [];
//       // Loop through each registered family and fetch corresponding members
//       for (const family of familyData) {
//         const familyMembers = await Member.findOne({
//           member_id: family.head, // Use family.member_id instead of member_id
//         }).select(
//           "member_id primary_family_id secondary_family_id member_name status"
//         );
//         // console.log('Family Members:', familyMembers);
//         // Combine the family and member information
//         if (familyMembers) {
//           RegisteredData.push({
//             _id: familyMembers._id,
//             family_id: family.family_id,
//             head: family.head,
//             member_name: familyMembers.member_name,
//             status: familyMembers.status,
//           });
//         }
//       }
//       const totalItems = await Family.countDocuments();
//       const TotalPages = Math.ceil(totalItems / limit);

//       return res.json({
//         message: "Get Member Data Successful",
//         RegisteredData,
//         totalItems,
//         TotalPages,
//         currentPage: page,
//       });
//     } catch (error) {
//       return res
//         .status(500)
//         .json({ message: "Failed to fetch members", error: error.message });
//     }
//   } else {
//     try {
//       // Define the filter for the search query
//       const familyFilter = {};
//       if (search) {
//         const searchRegex = new RegExp(search.replace(/\s/g, ""), "i"); // Remove spaces from the search term

//         familyFilter.$or = [
//           { member_name: { $regex: searchRegex } },
//           { member_id: { $regex: searchRegex } },
//           { primary_family_id: { $regex: searchRegex } },
//           { secondary_family_id: { $regex: searchRegex } },
//           { status: { $regex: searchRegex } },
//         ];
//       }

//       if (status) {
//         familyFilter.status = status;
//       }

//       // console.log('Family Filter:', familyFilter);

//       // Fetch registered family data with pagination and search filters
//       const familyData = await Member.aggregate([
//         {
//           $addFields: {
//             member_name_no_space: {
//               $replaceAll: {
//                 input: "$member_name",
//                 find: " ",
//                 replacement: "",
//               },
//             },
//           },
//         },
//         {
//           $match: familyFilter,
//         },
//         {
//           $sort: { _id: 1 },
//         },
//         {
//           $skip: (page - 1) * limit,
//         },
//         {
//           $limit: limit,
//         },
//         {
//           $lookup: {
//             from: "familylists", // Ensure the correct collection name
//             localField: "member_id",
//             foreignField: "head",
//             as: "familyDetails",
//           },
//         },
//         {
//           $unwind: "$familyDetails", // Unwind the resulting array
//         },
//         {
//           $project: {
//             member_id: 1,
//             member_name: 1,
//             status: 1,
//             "familyDetails.family_id": 1,
//             "familyDetails.head": 1,
//           },
//         },
//       ]);

//       // console.log('Family Data:', familyData);

//       // Prepare the registered data
//       const RegisteredData = familyData.map((family) => ({
//         _id: family._id,
//         family_id: family.familyDetails.family_id,
//         head: family.familyDetails.head,
//         member_name: family.member_name,
//         status: family.status,
//       }));

//       // Get the total number of documents that match the search criteria
//       const totalItems = await Member.countDocuments(familyFilter);
//       const TotalPages = Math.ceil(totalItems / limit);

//       // console.log('Total Items:', totalItems);
//       // console.log('Total Pages:', TotalPages);

//       return res.json({
//         message: "Get Family Data Successful",
//         RegisteredData,
//         totalItems,
//         TotalPages,
//         currentPage: page,
//       });
//     } catch (error) {
//       console.error("Error:", error.message); // Log the error message
//       return res
//         .status(500)
//         .json({ message: "Failed to fetch members", error: error.message });
//     }
//   }
// };


exports.getMembers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const status = req.query.status || ""; // Get the status from query params
  const search = req.query.search || "";

  try {
    if (search === "") {
      // If there's no search query, filter by status and paginate the results
      const familyData = await Family.find()
        .sort({ _id: 1 })
        .select("family_id head")
        .skip((page - 1) * limit)
        .limit(limit);

      let RegisteredData = [];

      // Loop through each registered family and fetch corresponding members
      for (const family of familyData) {
        const familyMembers = await Member.findOne({
          member_id: family.head,
          ...(status && { status }), // Apply status filter if provided
        }).select(
          "member_id primary_family_id secondary_family_id member_name status"
        );

        // Combine the family and member information
        if (familyMembers) {
          RegisteredData.push({
            _id: familyMembers._id,
            family_id: family.family_id,
            head: family.head,
            member_name: familyMembers.member_name,
            status: familyMembers.status,
          });
        }
      }

      const totalItems = await Family.countDocuments();
      const TotalPages = Math.ceil(totalItems / limit);

      return res.json({
        message: "Get Member Data Successful",
        RegisteredData,
        totalItems,
        TotalPages,
        currentPage: page,
      });
    } else {
      // Define the filter for the search query
      const familyFilter = {};

      if (search) {
        const searchRegex = new RegExp(search.replace(/\s/g, ""), "i");

        familyFilter.$or = [
          { member_name: { $regex: searchRegex } },
          { member_id: { $regex: searchRegex } },
          { primary_family_id: { $regex: searchRegex } },
          { secondary_family_id: { $regex: searchRegex } },
        ];
      }

      if (status) {
        familyFilter.status = status; // Apply status filter
      }

      // Fetch registered family data with pagination and search filters
      const familyData = await Member.aggregate([
        {
          $addFields: {
            member_name_no_space: {
              $replaceAll: {
                input: "$member_name",
                find: " ",
                replacement: "",
              },
            },
          },
        },
        {
          $match: familyFilter,
        },
        {
          $sort: { _id: 1 },
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: limit,
        },
        {
          $lookup: {
            from: "familylists", // Ensure the correct collection name
            localField: "member_id",
            foreignField: "head",
            as: "familyDetails",
          },
        },
        {
          $unwind: "$familyDetails",
        },
        {
          $project: {
            member_id: 1,
            member_name: 1,
            status: 1,
            "familyDetails.family_id": 1,
            "familyDetails.head": 1,
          },
        },
      ]);

      // Prepare the registered data
      const RegisteredData = familyData.map((family) => ({
        _id: family._id,
        family_id: family.familyDetails.family_id,
        head: family.familyDetails.head,
        member_name: family.member_name,
        status: family.status,
      }));

      const totalItems = await Member.countDocuments(familyFilter);
      const TotalPages = Math.ceil(totalItems / limit);

      return res.json({
        message: "Get Family Data Successful",
        RegisteredData,
        totalItems,
        TotalPages,
        currentPage: page,
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to fetch members", error: error.message });
  }
};


 

// exports.downloadMembers = async (req, res) => {
//   try {
//     const { status } = req.query;

//     const familyData = await Family.find()
//       .sort({ _id: 1 })
//       .select("family_id head");

//     let RegisteredData = [];

//     for (const family of familyData) {
//       const memberQuery = { member_id: family.head };
//       if (status) {
//         memberQuery.status = status;
//       }

//       const familyMembers = await Member.findOne(memberQuery).select(
//         "member_id primary_family_id secondary_family_id member_name status"
//       );

//       if (familyMembers) {
//         RegisteredData.push({
//           _id: familyMembers._id,
//           family_id: family.family_id,
//           head: family.head,
//           member_name: familyMembers.member_name,
//           status: familyMembers.status,
//         });
//       }
//     }

//     return res.json({
//       message: "Get Member Data Successful",
//       RegisteredData,
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Failed to fetch members", error: error.message });
//   }
// };
exports.downloadMembers = async (req, res) => {
  try {
    const { status } = req.query;

    // Fetch family data
    const familyData = await Family.find()
      .sort({ _id: 1 })
      .select("family_id head");

    // Extract the family heads for querying the members
    const familyHeads = familyData.map(family => family.head);

    // Build member query
    const memberQuery = { member_id: { $in: familyHeads } };
    if (status) {
      memberQuery.status = status;
    }

    // Fetch all members in one query
    const memberData = await Member.find(memberQuery)
      .select("member_id primary_family_id secondary_family_id member_name status");

    // Create a map of members by member_id for easy lookup
    const memberMap = memberData.reduce((acc, member) => {
      acc[member.member_id] = member;
      return acc;
    }, {});

    // Map family data to include the corresponding member data
    const RegisteredData = familyData.map(family => {
      const member = memberMap[family.head];
      if (member) {
        return {
          _id: member._id,
          family_id: family.family_id,
          family_head_name: member.member_name,
          member_id: family.head,
          status: member.status,
        };
      }
    }).filter(Boolean); // Remove any undefined values if a member doesn't exist

    // console.table(RegisteredData);
    
    return res.json({
      message: "Get Member Data Successful",
      RegisteredData,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch members", error: error.message });
  }
};

// exports.treeMembers = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const FamilyDetails = await Family.find({ family_id: req.params.id });
//     if (!FamilyDetails) {
//       return res.status(404).json({ message: "Member not found" });
//     }
//     return res.status(200).json(FamilyDetails[0]);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Failed to fetch member", error: error.message });
//   }
// };

exports.treeMembers  = async (req, res) => {
  // console.log("working");
  
  // const id = "VKDFAM00024";
  // const id = "VKDFAM00016";
  const { id } = req.params;
  // console.log(id);
  
  try {
    const FamilyDetails = await Family.findOne({ family_id: id });
    // console.log(FamilyDetails);
    
    if (!FamilyDetails) {
      // console.log({ message: "Member not found" });
      return res.status(404).json({ message: "Member not found" });
    } else {
            if (FamilyDetails.members && FamilyDetails.members.length > 0) {
        // Using Promise.all to handle async inside map
        const Data = await Promise.all(
          FamilyDetails.members.map(async (family) => {
            // console.log(family); // Log each family member object

            const MemberDetails = await Member.findOne({ member_id: family.ref_id })
              .select("member_id assigned_member_id member_name status")
              .lean(); // Use lean() to get a plain object

            // Add the relationship field
            MemberDetails.relation = family.relationship_with_family_head;
            // console.log("MemberDetails:", MemberDetails);

            // Return the modified MemberDetails object directly
            return MemberDetails;
          })
        );
        
        const HeadDetails = await Member.findOne({ member_id: FamilyDetails.head  })
        .select("member_id assigned_member_id member_name status present_address mobile_number")
        .lean(); // Use lean() to get a plain object
        HeadDetails.relation = "Head";
        Data.unshift(HeadDetails)

        // console.log("Data:", Data); // Log the transformed array of family members with details
        // return Data; // If this is an API call, you can send the response here with res.json(Data); 
        return res.status(200).json({FamilyDetails:Data});
             } else{
            const HeadDetails = await Member.findOne({ member_id: FamilyDetails.head  })
            .select("member_id assigned_member_id member_name status present_address mobile_number")
            .lean(); // Use lean() to get a plain object
            HeadDetails.relation = "Head";
        return res.status(200).json({FamilyDetails:[HeadDetails]});

            // console.log("Data:", HeadDetails); // Log the transformed array of family members with details
            // return HeadDetails
      
        }}
  } catch (error) {
    // console.log({ message: "Failed to fetch member", error: error.message });
    return res
      .status(500)
      .json({ message: "Failed to fetch member", error: error.message });
  }
};


// treeMembers()




// get single family list
exports.SingleGetMemberById = async (req, res) => {
  const { id } = req.params;

  try {
    // Array to accumulate all combined family and member data
    const FamilyData = await Family.find({ family_id: id }).select(
      "family_id head"
    );
    let RegisteredData = [];

    // Loop through each registered family and fetch corresponding members
    for (const family of FamilyData) {
      const familyMembers = await Member.findOne({
        member_id: family.head,
      }).select("member_id member_name permanent_address marriage_date");

      // Combine the family and member information
      if (familyMembers) {
        RegisteredData.push({
          family_id: family.family_id,
          family_head_name: familyMembers.member_name,
          marriage_date: familyMembers.marriage_date,
          permanent_address: familyMembers.permanent_address,
        });
      }
    }
    return res
      .status(200)
      .json({ message: "Data", FamilyData: RegisteredData[0] });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch member", error: error.message });
  }
};

// const familyTreeMembers = async () => {
//   const id = "VKDFAM00001";
//   // const id = "VKDFAM00003";

//   try {
//     const families = await Family.find({ family_id: id }).lean();
//     let Data = [];

//     // Helper function to find the last id
//     function findLastId(tree) {
//       let maxId = 0;
//       function traverse(node) {
//         if (node.id > maxId) {
//           maxId = node.id;
//         }
//         if (node.children && node.children.length > 0) {
//           for (let child of node.children) {
//             traverse(child);
//           }
//         }
//       }
//       for (let node of tree) {
//         traverse(node);
//       }
//       return maxId;
//     }

//     // Helper function to add a node to the tree
//     function addNode(tree, parentId, newNode) {
//       for (let node of tree) {
//         if (node.id === parentId) {
//           node.children.push(newNode);
//           return true;
//         }
//         if (node.children.length > 0) {
//           const added = addNode(node.children, parentId, newNode);
//           if (added) return true;
//         }
//       }
//       return false;
//     }

//     // Recursive function to add children nodes
//     async function addChildren(parentNode, members) {
//       for (const member of members) {
//         const memberDetails = await Member.findOne({ member_id: member.member_id })
//           .select("-_id member_name member_id member_photo")
//           .lean();

//         let newNode = {
//           id: findLastId(Data) + 1,
//           name: memberDetails.member_name,
//           attributes: { id: memberDetails.member_id },
//           nodeSvgShape: {
//             shape: "image",
//             shapeProps: {
//               href: `${process.env.BACKEND_URL}${memberDetails.member_photo}`,
//               width: 50,
//               height: 50
//             }
//           },
//           children: []
//         };

//         parentNode.children.push(newNode);

//         if (member.secondary_family_id) {
//           const secondaryFamily = await Family.findOne({ family_id: member.secondary_family_id }).lean();
//           if (secondaryFamily && secondaryFamily.members && secondaryFamily.members.length > 0) {
//             await addChildren(newNode, secondaryFamily.members);
//           }
//         }
//       }
//     }

//     // Fetch members and create the tree
//     for (const family of families) {
//       const familyHead = await Member.findOne({ member_id: family.head })
//         .select("-_id member_name member_id member_photo")
//         .lean();

//       let rootNode = {
//         id: findLastId(Data) + 1,
//         name: familyHead.member_name,
//         attributes: { id: familyHead.member_id },
//         nodeSvgShape: {
//           shape: "image",
//           shapeProps: {
//             href: `${process.env.BACKEND_URL}${familyHead.member_photo}`,
//             width: 50,
//             height: 50
//           }
//         },
//         children: []
//       };

//       Data.push(rootNode);

//       if (family.members && family.members.length > 0) {
//         await addChildren(rootNode, family.members);
//       }
//     }

//     console.log(JSON.stringify(Data, null, 2));
//     // Assuming you want to send this JSON as a response in an Express route
//     // res.status(200).json(Data);
//   } catch (error) {
//     console.log(error.message);
//     // Assuming you want to send an error response in an Express route
//     // res.status(500).json({ message: "Failed to fetch member", error: error.message });
//   }
// };

// familyTreeMembers();

exports.familyTreeMembers = async (req, res) => {
  try {
    const families = await Family.find({});
    const members = await Member.find({});

    const memberMap = members.reduce((acc, member) => {
      acc[member.member_id] = member;
      return acc;
    }, {});

    const findMemberById = (id) => memberMap[id];

    const buildTree = (memberId) => {
      const member = findMemberById(memberId);
      if (!member) return null;

      const children = [];
      const primaryFamily = families.find((fam) => fam.head === memberId);
      if (primaryFamily) {
        primaryFamily.members.forEach((memberRef) => {
          const childNode = buildTree(memberRef.ref_id);
          if (childNode) {
            children.push(childNode);
          }
        });
      }

      return {
        id: member.member_id,
        name: member.member_name,
        attributes: { id: member.member_id },
        nodeSvgShape: {
          shape: "image",
          shapeProps: {
            href: `http://localhost:${5000}${member.member_photo}`,
            width: 50,
            height: 50,
          },
        },
        children: children,
      };
    };

    const rootTree = buildTree("VKDMBR000001"); // Replace with your root family head ID

    const formatTree = (node, idCounter) => {
      if (!node) return null;
      node.id = idCounter.current++;
      node.children = node.children.map((child) =>
        formatTree(child, idCounter)
      );
      return node;
    };

    const idCounter = { current: 1 };
    const formattedTree = formatTree(rootTree, idCounter);

    res.json(formattedTree);
    // //  (formattedTree);
    //  console.log(JSON.stringify(formattedTree, null));
  } catch (error) {
    console.error(error);
    // res.status(500).send('Server Error');
  }
};

// familyTreeMembers();
