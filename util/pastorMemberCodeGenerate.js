const Member = require("../Schema/pastorSchema");

async function generateMemberCode() {
  // Define the static part of the member code
  const patternPart = "VKDPTM";

  // Find the latest Member with a matching pattern
  const latestMember = await Member.findOne({
    member_id: { $regex: `^${patternPart}` },
  }).sort({ member_id: -1 });

  let codeNumber = 1;
  if (latestMember) {
    // Extract the code number from the latest Member code
    const latestCodeNumber = parseInt(latestMember.member_id.slice(-6));
    codeNumber = latestCodeNumber + 1;
  }

  // Format the code number with leading zeros
  const formattedCodeNumber = codeNumber.toString().padStart(6, "0");
  // Combine the pattern and code number
  const memberCode = `${patternPart}${formattedCodeNumber}`;

  return memberCode;
}

module.exports = generateMemberCode;
