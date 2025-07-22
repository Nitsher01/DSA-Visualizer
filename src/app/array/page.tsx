
"use client";

import React, { useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, Scatter, ScatterChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";


type ArrayData = number[] | number[][];
type VisualizationType = "bar" | "line" | "dot" | "grid" | "heatmap";

const sampleArrays = {
  unsorted: "[8, 3, 5, 1, 9, 2]",
  mixed: "[42, -5, 17, 0, 99, -23]",
  fibonacci: "[0, 1, 1, 2, 3, 5, 8, 13]",
  "3x3": "[[1, 2, 3], [4, 5, 6], [7, 8, 9]]",
  "2x3": "[[10, 20, 30], [40, 50, 60]]",
};

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--primary))",
  },
};

const ValueRange = ({ min, max }: { min: number, max: number }) => {
  const points = 5;
  if (min === max) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-sm bg-primary/20" />
        <span className="text-xs">{min.toFixed(1)}</span>
      </div>
    );
  }

  const range = Array.from({ length: points }, (_, i) => min + (i * (max - min)) / (points - 1));

  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span>{min.toFixed(1)}</span>
      <div className="flex items-center gap-2">
        {range.map((value, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className="w-5 h-5 rounded-full"
              style={{ backgroundColor: `hsl(var(--primary) / ${0.2 + (i / (points - 1)) * 0.8})` }}
            />
            <span className="mt-1">{value.toFixed(1)}</span>
          </div>
        ))}
      </div>
      <span>{max.toFixed(1)}</span>
    </div>
  );
};


export default function ArrayPage() {
  const [arrayData, setArrayData] = useState<ArrayData>([10, 20, 15, 30, 25]);
  const [is2D, setIs2D] = useState(false);
  const [inputValue, setInputValue] = useState("[10, 20, 15, 30, 25]");
  const [visualizationType, setVisualizationType] = useState<VisualizationType>("bar");
  const { toast } = useToast();

  const parseArrayInput = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        if (Array.isArray(parsed[0])) { // Check if it's a 2D array
          if (parsed.every((row: any) => Array.isArray(row) && row.every((cell: any) => typeof cell === 'number'))) {
            setArrayData(parsed);
            setIs2D(true);
            setVisualizationType("grid"); // Default to grid for 2D
          } else {
             throw new Error("2D array must contain only numbers.");
          }
        } else { // It's a 1D array
           if (parsed.every((cell: any) => typeof cell === 'number')) {
            setArrayData(parsed);
            setIs2D(false);
            setVisualizationType('bar'); // Default to bar for 1D
          } else {
            throw new Error("1D array must contain only numbers.");
          }
        }
      } else {
        throw new Error("Invalid array format.");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Parsing Error",
        description: error instanceof Error ? error.message : "Could not parse array. Please check the format.",
      });
    }
  };

  const handleParse = () => {
    parseArrayInput(inputValue);
  };
  
  const handleSampleClick = (key: keyof typeof sampleArrays) => {
      const value = sampleArrays[key];
      setInputValue(value);
      parseArrayInput(value);
  }

  const chartData = is2D ? [] : (arrayData as number[]).map((value, index) => ({
    index: `[${index}]`,
    value,
  }));
  
  const scatterData = is2D ? [] : (arrayData as number[]).map((value, index) => ({
    x: index,
    y: value,
    label: value
  }));

  const valueRange = useMemo(() => {
    if (!arrayData || arrayData.length === 0) return { min: 0, max: 0 };
    const allValues = (arrayData as any[]).flat().filter(v => typeof v === 'number');
    if (allValues.length === 0) return { min: 0, max: 0 };
    const min = Math.min(...allValues, 0); // Include 0 in range
    const max = Math.max(...allValues);
    return { min, max };
  }, [arrayData]);

  const getColorForValue = (value: number) => {
    const { min, max } = valueRange;
    if (value < 0) return `hsl(var(--destructive) / 0.5)`;
    if (min === max) {
      return `hsl(var(--primary) / 0.5)`;
    }
    const ratio = max > min ? (value - min) / (max - min) : 0;
    const opacity = 0.2 + ratio * 0.8; 
    return `hsl(var(--primary) / ${opacity})`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Array Input</CardTitle>
          <CardDescription>
            Enter your array data (1D: [1,2,3] or 2D: [[1,2],[3,4]])
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col sm:flex-row items-start gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter array data here... e.g., [1,3,5,2,8,6,4,7]"
                className="font-code flex-1 min-h-[80px]"
                rows={3}
              />
              <Button onClick={handleParse} className="w-full sm:w-auto">Parse Array</Button>
            </div>
          <Separator className="my-6" />
          <div className="space-y-4">
            <h3 className="font-semibold">Sample Arrays:</h3>
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">1D Arrays</h4>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => handleSampleClick('unsorted')}>Unsorted</Button>
                  <Button variant="outline" size="sm" onClick={() => handleSampleClick('mixed')}>Mixed</Button>
                  <Button variant="outline" size="sm" onClick={() => handleSampleClick('fibonacci')}>Fibonacci</Button>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">2D Arrays</h4>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => handleSampleClick('3x3')}>3x3 Matrix</Button>
                  <Button variant="outline" size="sm" onClick={() => handleSampleClick('2x3')}>2x3 Matrix</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visualization Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label>Select visualization type</Label>
                <Select
                  value={visualizationType}
                  onValueChange={(value) => setVisualizationType(value as VisualizationType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {is2D ? (
                      <>
                        <SelectItem value="grid">Grid</SelectItem>
                        <SelectItem value="heatmap">Heatmap</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="line">Line Plot</SelectItem>
                        <SelectItem value="dot">Dot Plot</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Visualization</CardTitle>
          <CardDescription>
            {is2D ? `2D Array Visualization: ${visualizationType.charAt(0).toUpperCase() + visualizationType.slice(1)}` : `1D Array Visualization: ${visualizationType.charAt(0).toUpperCase() + visualizationType.slice(1)}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-4 min-h-[450px] flex items-center justify-center">
          {is2D ? (
            <div className="flex flex-col items-center gap-4">
              <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `auto repeat(${(arrayData as number[][])[0]?.length || 1}, 1fr)`}}>
                <div />
                  {(arrayData as number[][])[0]?.map((_, colIndex) => (
                      <div key={`col-header-${colIndex}`} className="text-center font-mono text-sm text-muted-foreground">{colIndex}</div>
                  ))}

                {(arrayData as number[][]).map((row, rowIndex) => (
                  <React.Fragment key={`row-frag-${rowIndex}`}>
                      <div className="flex items-center justify-center font-mono text-sm text-muted-foreground pr-2">{rowIndex}</div>
                      {row.map((value, colIndex) => {
                        const style = 
                          visualizationType === 'heatmap' ? { backgroundColor: getColorForValue(value), color: 'hsl(var(--primary-foreground))' } :
                          { backgroundColor: 'var(--card)', color: 'hsl(var(--foreground))' };

                        return (
                          <div 
                            key={`${rowIndex}-${colIndex}`} 
                            className="w-16 h-16 border rounded-md flex items-center justify-center font-code text-lg transition-all duration-300 relative"
                            style={style}
                          >
                            {value}
                          </div>
                        )
                      })}
                  </React.Fragment>
                ))}
              </div>
              {visualizationType === 'heatmap' && (
                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-2 text-center">Value Range</h4>
                  <ValueRange min={valueRange.min} max={valueRange.max} />
                </div>
              )}
            </div>
          ) : (
            <>
            {visualizationType === 'bar' && (
               <ChartContainer config={chartConfig} className="w-full h-[250px]">
                <BarChart data={chartData} margin={{ top: 20, left: -20, right: 20 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="index" tickLine={false} axisLine={false} tickMargin={8} label={{ value: 'Array Index', position: 'insideBottom', offset: -10 }} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} label={{ value: 'Value', angle: -90, position: 'insideLeft' }}/>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="value" fill="var(--color-value)" radius={4}>
                     <LabelList dataKey="value" position="top" offset={8} className="fill-foreground" fontSize={12} />
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
            {visualizationType === 'line' && (
               <ChartContainer config={chartConfig} className="w-full h-[250px]">
                <LineChart data={chartData} margin={{ top: 20, left: -20, right: 20 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="index" tickLine={false} axisLine={false} tickMargin={8} label={{ value: 'Array Index', position: 'insideBottom', offset: -10 }} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} label={{ value: 'Value', angle: -90, position: 'insideLeft' }}/>
                  <ChartTooltip
                    cursor={true}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line type="linear" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-value)" }}>
                     <LabelList dataKey="value" position="top" offset={8} className="fill-foreground" fontSize={12} />
                  </Line>
                </LineChart>
              </ChartContainer>
            )}
            {visualizationType === 'dot' && (
              <ChartContainer config={chartConfig} className="w-full h-[250px]">
                <ScatterChart margin={{ top: 20, left: -20, right: 20 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="index" 
                    tickFormatter={(tick) => `[${tick}]`}
                    domain={['dataMin - 1', 'dataMax + 1']}
                    tickCount={(arrayData as number[]).length + 2}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    label={{ value: 'Array Index', position: 'insideBottom', offset: -10 }} 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="value" 
                    label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={true}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Scatter name="Values" data={scatterData} fill="var(--color-value)">
                    <LabelList dataKey="label" position="top" offset={8} className="fill-foreground" fontSize={12} />
                  </Scatter>
                </ScatterChart>
              </ChartContainer>
            )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
