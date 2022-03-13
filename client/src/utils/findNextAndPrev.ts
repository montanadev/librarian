import { FolderModel } from "../models/Folder";

export function findNextAndPrev(
  folders: FolderModel[],
  documentId: string,
  folderId: string
) {
  let entries: number[][] = [];
  let foundIdx = -1;
  let next: number[] = [];
  let prev: number[] = [];

  // flatten the folder / doc hierarchy into list
  for (let seekFolder of folders) {
    for (let seekDocument of seekFolder.documents) {
      entries.push([seekFolder.id, seekDocument.id]);
      if (
        seekDocument.id === parseInt(documentId) &&
        seekFolder.id === parseInt(folderId)
      ) {
        foundIdx = entries.length - 1;
      }
    }
  }

  // find the doc before and after the currently loaded one
  // and use it to power the prev/next buttons
  if (foundIdx !== -1) {
    if (foundIdx - 1 < 0) {
      prev = entries[entries.length - 1];
    } else {
      prev = entries[foundIdx - 1];
    }

    if (foundIdx + 1 === entries.length) {
      next = entries[0];
    } else {
      next = entries[foundIdx + 1];
    }
  }

  return [next, prev];
}
