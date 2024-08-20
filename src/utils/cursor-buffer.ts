import { findIndex } from 'lodash';

interface CursorBuffer {
  id: number;
}

export const encodeCursor = (value: string | null): string => {
  return value ? Buffer.from(value).toString('base64') : ''; // Provide a fallback for null
};

export const decodeCursor = (cursor: string): string => {
  return Buffer.from(cursor, 'base64').toString('ascii');
};

export const paginateAfter = <T extends CursorBuffer>(
  items: T[],
  after: string | null,
  first: number,
): T[] => {
  if (!after) {
    return items.slice(0, first);
  }
  const afterCursor = JSON.parse(decodeCursor(after));
  const cursorIndex = findIndex(items, it => it.id === afterCursor.id);
  return items.slice(cursorIndex + 1, cursorIndex + 1 + first);
};

export const paginateBefore = <T extends CursorBuffer>(
  items: T[],
  before: string | null,
  last: number,
): T[] => {
  if (!before) {
    return items.slice(-last);
  }
  const beforeCursor = JSON.parse(decodeCursor(before));
  const cursorIndex = findIndex(items, it => it.id === beforeCursor.id);
  return items.slice(cursorIndex - last, cursorIndex).reverse();
};

export const paginate = <T extends CursorBuffer>(
  items: T[],
  before: string | null,
  after: string | null,
  first: number | null,
  last: number | null,
): T[] => {
  // Default cursor index for fallback when both 'before' and 'after' are null/undefined
  let cursorIndex = 0;

  if (after && !before) {
    const afterCursor = JSON.parse(decodeCursor(after));
    cursorIndex = findIndex(items, it => it.id === afterCursor.id);
    return items.slice(
      cursorIndex + 1,
      cursorIndex + 1 + (first || items.length),
    );
  } else if (before && !after) {
    const beforeCursor = JSON.parse(decodeCursor(before));
    cursorIndex = findIndex(items, it => it.id === beforeCursor.id);
    return items
      .slice(cursorIndex - (last || items.length), cursorIndex)
      .reverse();
  } else if (!before && !after) {
    // Handle case when both before and after are null/undefined
    if (first) {
      return items.slice(cursorIndex, cursorIndex + first);
    }
    if (last) {
      return items.slice(0, 0);
    }
  }

  return items;
};
