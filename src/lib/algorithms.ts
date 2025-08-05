export type AnimationStep =
  | { type: 'compare'; indices: [number, number] }
  | { type: 'swap'; indices: [number, number] }
  | { type: 'overwrite'; index: number; value: number }
  | { type: 'found'; index: number };

export const bubbleSort = (array: number[]): AnimationStep[] => {
  const animations: AnimationStep[] = [];
  const n = array.length;
  let arr = [...array];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      animations.push({ type: 'compare', indices: [j, j + 1] });
      if (arr[j] > arr[j + 1]) {
        animations.push({ type: 'swap', indices: [j, j + 1] });
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap elements
      }
    }
  }

  return animations;
};

const mergeSortHelper = (
  mainArray: number[],
  startIndex: number,
  endIndex: number,
  auxiliaryArray: number[],
  animations: AnimationStep[],
) => {
  if (startIndex === endIndex) return;
  const middleIndex = Math.floor((startIndex + endIndex) / 2);
  mergeSortHelper(auxiliaryArray, startIndex, middleIndex, mainArray, animations);
  mergeSortHelper(auxiliaryArray, middleIndex + 1, endIndex, mainArray, animations);
  doMerge(mainArray, startIndex, middleIndex, endIndex, auxiliaryArray, animations);
};

const doMerge = (
  mainArray: number[],
  startIndex: number,
  middleIndex: number,
  endIndex: number,
  auxiliaryArray: number[],
  animations: AnimationStep[],
) => {
  let k = startIndex;
  let i = startIndex;
  let j = middleIndex + 1;
  while (i <= middleIndex && j <= endIndex) {
    animations.push({ type: 'compare', indices: [i, j] });
    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      animations.push({ type: 'overwrite', index: k, value: auxiliaryArray[i] });
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      animations.push({ type: 'overwrite', index: k, value: auxiliaryArray[j] });
      mainArray[k++] = auxiliaryArray[j++];
    }
  }
  while (i <= middleIndex) {
    animations.push({ type: 'compare', indices: [i, i] });
    animations.push({ type: 'overwrite', index: k, value: auxiliaryArray[i] });
    mainArray[k++] = auxiliaryArray[i++];
  }
  while (j <= endIndex) {
    animations.push({ type: 'compare', indices: [j, j] });
    animations.push({ type: 'overwrite', index: k, value: auxiliaryArray[j] });
    mainArray[k++] = auxiliaryArray[j++];
  }
};

export const mergeSort = (array: number[]): AnimationStep[] => {
  const animations: AnimationStep[] = [];
  if (array.length <= 1) return animations;
  const auxiliaryArray = array.slice();
  const mainArray = array.slice();
  mergeSortHelper(mainArray, 0, array.length - 1, auxiliaryArray, animations);
  return animations;
};

const partition = (
  arr: number[],
  low: number,
  high: number,
  animations: AnimationStep[],
): number => {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    animations.push({ type: 'compare', indices: [j, high] });
    if (arr[j] < pivot) {
      i++;
      animations.push({ type: 'swap', indices: [i, j] });
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  animations.push({ type: 'swap', indices: [i + 1, high] });
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
};

const quickSortHelper = (
  arr: number[],
  low: number,
  high: number,
  animations: AnimationStep[],
) => {
  if (low < high) {
    const pi = partition(arr, low, high, animations);
    quickSortHelper(arr, low, pi - 1, animations);
    quickSortHelper(arr, pi + 1, high, animations);
  }
};

export const quickSort = (array: number[]): AnimationStep[] => {
  const animations: AnimationStep[] = [];
  if (array.length <= 1) return animations;
  const arr = [...array];
  quickSortHelper(arr, 0, arr.length - 1, animations);
  return animations;
};

export const insertionSort = (array: number[]): AnimationStep[] => {
  const animations: AnimationStep[] = [];
  const n = array.length;
  let arr = [...array];

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    animations.push({ type: 'compare', indices: [i, j] });
    while (j >= 0 && arr[j] > key) {
      animations.push({ type: 'overwrite', index: j + 1, value: arr[j] });
      arr[j + 1] = arr[j];
      j = j - 1;
      if (j >= 0) {
        animations.push({ type: 'compare', indices: [i, j] });
      }
    }
    animations.push({ type: 'overwrite', index: j + 1, value: key });
    arr[j + 1] = key;
  }

  return animations;
};

export const binarySearch = (array: number[], target: number): AnimationStep[] => {
  const animations: AnimationStep[] = [];
  const sortedArr = [...array].sort((a, b) => a - b);

  let low = 0;
  let high = sortedArr.length - 1;

  animations.push({ type: 'clearPointers' });

  while (low <= high) {
    animations.push({ type: 'clearPointers' });
    animations.push({ type: 'pointerMove', index: low, pointerType: 'low' });
    animations.push({ type: 'pointerMove', index: high, pointerType: 'high' });

    const mid = Math.floor((low + high) / 2);
    animations.push({ type: 'pointerMove', index: mid, pointerType: 'mid' });
    animations.push({ type: 'compare', indices: [low, high] }); // Highlight current search range

    if (sortedArr[mid] === target) {
      animations.push({ type: 'found', index: mid });
      return animations;
    } else if (sortedArr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  animations.push({ type: 'clearPointers' }); // Clear pointers if target not found
  return animations; // Target not found
};

