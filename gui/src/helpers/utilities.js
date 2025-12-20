/*
 * This function accepts as parameters the deployment information retrieved from environment variables.
 * The environment variables are redefined by Netlify, while deploying the production version. The function returns
 * a formatted message (HTML) containing the retrieved deployment information.
 */
function retrieveDeploymentInformation(
  repositoryUrl,
  branchInfo,
  lastCommitHash,
) {
  const urlToRender = `https://${repositoryUrl
    .split(":")
    .join("/")}/-/tree/${branchInfo}`;
  const commitUrl = `https://${repositoryUrl
    .split(":")
    .join("/")}/-/commit/${lastCommitHash}`;
  const message = `Welcome to the Rule editor! This version is based on the <a class='anchorTags' href='${urlToRender}' target='_blank'>${branchInfo}</a> branch.
    <br/>Commit hash: <a class='anchorTags' href='${commitUrl}' target='_blank'>${lastCommitHash.substring(
      0,
      9,
    )}</a>.`;

  return message;
}

/**
 * For each word in the text it detects its start,end position and converts into an annotation object.
 * Skips 'None' types, but still advances the search position.
 * @param {Array<[string, string]>} wordTypePairs - Array of [word, type]
 * @param {string} text - The full text containing the words in order
 * @returns {Array<{id: number, text: string, type: string, start: number, end: number, status: string}>}
 */
function buildAnnotations(wordTypePairs, text) {
  const annotations = [];
  let searchStart = 0;
  let id = 1;

  for (const [word, type] of wordTypePairs) {
    // Skip if type is 'None'
    if (type === 'None') {
      // Still need to move searchStart forward
      const idx = text.indexOf(word, searchStart);
      if (idx !== -1) {
        searchStart = idx + word.length;
      }
      continue;
    }

    // Find the word in the text, starting from searchStart
    const idx = text.indexOf(word, searchStart);
    if (idx === -1) {
      // Word not found, skip or throw error
      console.warn(`Word "${word}" not found in text after position ${searchStart}`);
      continue;
    }

    const start = idx;
    const end = idx + word.length;

    annotations.push({
      id: id++,
      text: word,
      type: type,
      start: start,
      end: end,
      status: 'pending'
    });

    // Move searchStart forward for the next word
    searchStart = end;
  }

  return annotations;
}
//
// /**
//  * For each annotation, finds its start and end in the text.
//  * Combines consecutive words of the same type into a single annotation, they are part of the same annotation.
//  * Skips 'None' types, but still advances the search position.
//  * @param {Array<[string, string]>} wordTypePairs - Array of [word, type]
//  * @param {string} text - The full text containing the words in order
//  * @returns {Array<{id: number, text: string, type: string, start: number, end: number, status: string}>}
//  */
// function buildAnnotations(wordTypePairs, text) {
//   const annotations = [];
//   let searchStart = 0;
//   let id = 1;
//   let i = 0;
//
//   while (i < wordTypePairs.length) {
//     const [word, type] = wordTypePairs[i];
//
//     if (type === 'None') {
//       // Advance searchStart for skipped words
//       const idx = text.indexOf(word, searchStart);
//       if (idx !== -1) {
//         searchStart = idx + word.length;
//       }
//       i++;
//       continue;
//     }
//
//     // Start a group of consecutive words of the same type
//     let groupWords = [word];
//     let groupType = type;
//     let j = i + 1;
//
//     while (
//       j < wordTypePairs.length &&
//       wordTypePairs[j][1] === groupType &&
//       groupType !== 'None'
//     ) {
//       groupWords.push(wordTypePairs[j][0]);
//       j++;
//     }
//
//     // Try to find the group as a contiguous substring in the text
//     const groupText = groupWords.join(' ');
//     let idx = text.indexOf(groupText, searchStart);
//
//     if (idx === -1) {
//       // If not found as a contiguous substring, find each word individually and span from first to last
//       let firstIdx = -1;
//       let lastIdx = -1;
//       let tempSearchStart = searchStart;
//       for (const w of groupWords) {
//         const wIdx = text.indexOf(w, tempSearchStart);
//         if (wIdx === -1) {
//           // If any word is not found, skip this group
//           console.warn(`Word "${w}" not found in text after position ${tempSearchStart}`);
//           break;
//         }
//         if (firstIdx === -1) firstIdx = wIdx;
//         lastIdx = wIdx + w.length;
//         tempSearchStart = wIdx + w.length;
//       }
//       if (firstIdx !== -1 && lastIdx !== -1) {
//         annotations.push({
//           id: id++,
//           text: text.slice(firstIdx, lastIdx),
//           type: groupType,
//           start: firstIdx,
//           end: lastIdx,
//           status: 'pending'
//         });
//         searchStart = lastIdx;
//       } else {
//         // Could not find, skip
//         console.warn(`Could not find group: ${groupWords.join(' ')} in text`);
//       }
//     } else {
//       // Found the group as a contiguous substring
//       annotations.push({
//         id: id++,
//         text: groupText,
//         type: groupType,
//         start: idx,
//         end: idx + groupText.length,
//         status: 'pending'
//       });
//       searchStart = idx + groupText.length;
//     }
//
//     i = j; // Move to the next group
//   }
//
//   return annotations;
// }

export { retrieveDeploymentInformation, buildAnnotations };
