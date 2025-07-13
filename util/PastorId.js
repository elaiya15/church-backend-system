const Family = require("../Schema/pastorSchema");

async function generateFamilyCode() {
  // Define the static part of the family code
  const patternPart = "VKDPTF";

  // Find the latest Family with a matching pattern
  const latestFamily = await Family.findOne({
    familyhead_id: { $regex: `^${patternPart}` },
  }).sort({ familyhead_id: -1 });
  let codeNumber = 1;
  if (latestFamily) {
    //  console.log("famId:",latestFamily);
    // Extract the code number from the latest Family code
    const latestCodeNumber = parseInt(latestFamily.familyhead_id.slice(-5));
    codeNumber = latestCodeNumber + 1;
  }
  //  console.log("coder:",codeNumber);
  // return console.log("out:",latestCodeNumber);
  // Format the code number with leading zeros
  const formattedCodeNumber = codeNumber.toString().padStart(5, "0");
  // console.log(formattedCodeNumber);
  // Combine the pattern and code number
  const pastorCode = `${patternPart}${formattedCodeNumber}`;
  // console.log(familyCode);
  return pastorCode;
}

module.exports = generateFamilyCode;
