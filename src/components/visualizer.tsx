import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AnimationStep } from '@/lib/algorithms';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface VisualizerProps {
  data: number[];
  animationSteps: AnimationStep[];
  isPlaying: boolean;
  speed: number;
  onAnimationComplete: () => void;
}

const Visualizer: React.FC<VisualizerProps> = ({
  data,
  animationSteps,
  isPlaying,
  speed,
  onAnimationComplete,
  algorithm,
}) => {
  const [array, setArray] = useState([...data]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [lowPointer, setLowPointer] = useState<number | null>(null);
  const [highPointer, setHighPointer] = useState<number | null>(null);
  const [midPointer, setMidPointer] = useState<number | null>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const stepIndex = useRef(0);

  useEffect(() => {
    setArray([...data]);
    stepIndex.current = 0;
    setActiveIndices([]);
    setFoundIndex(null);
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
  }, [data]);

  useEffect(() => {
    if (isPlaying && animationSteps.length > 0) {
      animate();
    } else {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    }

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [isPlaying, speed, animationSteps]);

  const animate = () => {
    if (stepIndex.current >= animationSteps.length) {
      onAnimationComplete();
      setActiveIndices([]);
      setFoundIndex(null);
      return;
    }

    const step = animationSteps[stepIndex.current];

    switch (step.type) {
      case 'compare': {
        const [i, j] = step.indices;
        setActiveIndices([i, j]);
        setFoundIndex(null);
        break;
      }
      case 'swap': {
        const [i, j] = step.indices;
        setActiveIndices([i, j]);
        setFoundIndex(null);
        setArray(prevArray => {
          const newArray = [...prevArray];
          [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
          return newArray;
        });
        break;
      }
      case 'overwrite': {
        const { index, value } = step;
        setActiveIndices([index]);
        setFoundIndex(null);
        setArray(prevArray => {
          const newArray = [...prevArray];
          newArray[index] = value;
          return newArray;
        });
        break;
      }
      case 'found': {
        const { index } = step;
        setActiveIndices([index]);
        setFoundIndex(index);
        break;
      }
    }

    stepIndex.current++;

    const delay = algorithm === 'binarySearch' ? 500 - (speed * 4) : 110 - speed; // Slower for binary search
    timeoutId.current = setTimeout(animate, delay);
  };

  const chartData = useMemo(() => array.map((value, index) => ({ index: `[${index}]`, value })), [array]);

  const chartConfig = {
    value: {
      label: "Value",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, left: -20, right: 20 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="index" tickLine={false} axisLine={false} tickMargin={8} label={{ value: 'Array Index', position: 'insideBottom', offset: -10 }} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} label={{ value: 'Value', angle: -90, position: 'insideLeft' }}/>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey="value" radius={4}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={foundIndex === index ? '#4CAF50' : lowPointer === index ? '#FFD700' : highPointer === index ? '#FFA07A' : midPointer === index ? '#87CEEB' : activeIndices.includes(index) ? '#FF9800' : '#64B5F6'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default Visualizer;