'use client';

import { NextPage } from 'next';
import { useState, useEffect, useMemo } from 'react';
import Visualizer from '@/components/visualizer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input'; // Added Input import
import { bubbleSort, mergeSort, quickSort, insertionSort, binarySearch, AnimationStep } from '@/lib/algorithms';

const AlgorithmsPage: NextPage = () => {
  const [algorithm, setAlgorithm] = useState('bubbleSort');
  const [speed, setSpeed] = useState(50);
  const [data, setData] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [target, setTarget] = useState<number | null>(null);
  const [customArray, setCustomArray] = useState(''); // Added customArray state

  const generateRandomArray = (size = 50) => {
    let newArray: number[];
    if (customArray) {
      newArray = customArray.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    } else {
      newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    }
    
    setData(newArray);
    setIsPlaying(false);
    setIsFinished(false);

    if (algorithm === 'binarySearch') {
      const sortedData = [...newArray].sort((a, b) => a - b);
      setData(sortedData);
      const randomTarget = sortedData[Math.floor(Math.random() * sortedData.length)];
      setTarget(randomTarget);
    } else {
      setTarget(null);
    }
  };

  useEffect(() => {
    generateRandomArray();
  }, [algorithm]); // Rerun when algorithm changes to reset data/target

  const animationSteps = useMemo(() => {
    if (data.length === 0) return [];
    switch (algorithm) {
      case 'bubbleSort':
        return bubbleSort(data);
      case 'mergeSort':
        return mergeSort(data);
      case 'quickSort':
        return quickSort(data);
      case 'insertionSort':
        return insertionSort(data);
      case 'binarySearch':
        return binarySearch(data, target || 0); // Pass target for binary search
      default:
        return [];
    }
  }, [data, algorithm, target]); // Added target to dependencies

  const handleAlgorithmChange = (value: string) => {
    setAlgorithm(value);
    // generateRandomArray will be called by useEffect due to algorithm change
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };

  const togglePlay = () => {
    if (isFinished) {
      generateRandomArray();
      setTimeout(() => setIsPlaying(true), 100);
    } else {
      setIsPlaying(!isPlaying);
    }
  };
  
  const onAnimationComplete = () => {
    setIsPlaying(false);
    setIsFinished(true);
  };

  return (
    <div className="flex flex-col items-stretch min-h-screen py-2 px-4"> {/* Changed items-center to items-stretch */}
      <h1 className="text-4xl font-bold text-center my-8">Algorithm Visualizations</h1>
      
      <div className="w-full mb-8 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md"> {/* Removed max-w-4xl mx-auto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center"> {/* Changed md:grid-cols-3 to md:grid-cols-2 */}
          <div>
            <label htmlFor="algorithm-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Algorithm</label>
            <Select onValueChange={handleAlgorithmChange} defaultValue={algorithm}>
              <SelectTrigger id="algorithm-select">
                <SelectValue placeholder="Select an algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sorting Algorithms</SelectLabel>
                  <SelectItem value="bubbleSort">Bubble Sort</SelectItem>
                  <SelectItem value="mergeSort">Merge Sort</SelectItem>
                  <SelectItem value="quickSort">Quick Sort</SelectItem>
                  <SelectItem value="insertionSort">Insertion Sort</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Searching Algorithms</SelectLabel>
                  <SelectItem value="binarySearch">Binary Search</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div> {/* Removed md:col-span-2 */}
            <label htmlFor="speed-slider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Speed</label>
            <Slider id="speed-slider" min={10} max={100} step={10} value={[speed]} onValueChange={handleSpeedChange} />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="custom-array-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Custom Array (comma-separated)</label>
          <div className="flex items-center gap-2">
            <Input
              id="custom-array-input"
              type="text"
              value={customArray}
              onChange={(e) => setCustomArray(e.target.value)}
              placeholder="e.g., 5, 1, 4, 2, 8"
              className="flex-grow"
            />
            <Button onClick={() => generateRandomArray()}>Parse Array</Button>
          </div>
        </div>

        {algorithm === 'binarySearch' && (
          <div className="mt-4 col-span-full"> {/* Added col-span-full for full width */}
            <label htmlFor="target-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target</label>
            <Input
              id="target-input"
              type="number"
              value={target ?? ''}
              onChange={(e) => setTarget(parseInt(e.target.value, 10))}
              placeholder="Enter target value"
            />
          </div>
        )}

        <div className="flex justify-center space-x-4 mt-6">
          <Button onClick={togglePlay}>{isFinished ? 'Reset & Play' : isPlaying ? 'Pause' : 'Play'}</Button>
          <Button onClick={() => generateRandomArray()}>New Array</Button>
        </div>
      </div>

      <div className="w-full flex-grow h-[400px]"> {/* Added fixed height */}
        <Visualizer 
          data={data} 
          animationSteps={animationSteps} 
          isPlaying={isPlaying}
          speed={speed}
          onAnimationComplete={onAnimationComplete}
          algorithm={algorithm}
        />
      </div>
    </div>
  );
};

export default AlgorithmsPage;