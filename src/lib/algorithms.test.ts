import { bubbleSort, mergeSort, quickSort, insertionSort, binarySearch } from './algorithms';

describe('Sorting Algorithms', () => {
  const unsortedArray = [5, 1, 4, 2, 8];
  const sortedArray = [1, 2, 4, 5, 8];

  it('should sort an array correctly with bubbleSort', () => {
    const animations = bubbleSort(unsortedArray.slice());
    const arr = unsortedArray.slice();
    animations.forEach(step => {
      if (step.type === 'swap') {
        const [i, j] = step.indices;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    });
    expect(arr).toEqual(sortedArray);
  });

  it('should sort an array correctly with mergeSort', () => {
    const animations = mergeSort(unsortedArray.slice());
    const arr = unsortedArray.slice();
    animations.forEach(step => {
      if (step.type === 'overwrite') {
        arr[step.index] = step.value;
      }
    });
    // Merge sort output is not guaranteed to be stable, so we check against a sorted version of the array
    expect(arr).toEqual(unsortedArray.slice().sort((a, b) => a - b));
  });

  it('should sort an array correctly with quickSort', () => {
    const animations = quickSort(unsortedArray.slice());
    const arr = unsortedArray.slice();
    animations.forEach(step => {
      if (step.type === 'swap') {
        const [i, j] = step.indices;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    });
    expect(arr).toEqual(sortedArray);
  });

  it('should sort an array correctly with insertionSort', () => {
    const animations = insertionSort(unsortedArray.slice());
    const arr = unsortedArray.slice();
    animations.forEach(step => {
      if (step.type === 'overwrite') {
        arr[step.index] = step.value;
      }
    });
    expect(arr).toEqual(sortedArray);
  });
});

describe('Searching Algorithms', () => {
  const sortedArray = [1, 2, 4, 5, 8];

  it('should find the target element using binarySearch', () => {
    const target = 4;
    const animations = binarySearch(sortedArray, target);
    const foundStep = animations.find(step => step.type === 'found');
    expect(foundStep).toBeDefined();
    if (foundStep && foundStep.type === 'found') {
        expect(sortedArray[foundStep.index]).toEqual(target);
    }
  });

  it('should not find a non-existent element using binarySearch', () => {
    const target = 3;
    const animations = binarySearch(sortedArray, target);
    const foundStep = animations.find(step => step.type === 'found');
    expect(foundStep).toBeUndefined();
  });
});
