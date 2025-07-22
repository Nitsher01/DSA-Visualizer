
"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


type HeapType = "min" | "max";
type VisualizationType = "tree" | "array";
type HeapValue = number | string;
type Node = { id: number; value: HeapValue; x: number; y: number; highlight: boolean };
type Edge = { id: string; x1: number; y1: number; x2: number; y2: number };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function HeapPage() {
  const [heap, setHeap] = useState<HeapValue[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [heapType, setHeapType] = useState<HeapType>("min");
  const [visualizationType, setVisualizationType] = useState<VisualizationType>('tree');
  const [inputValue, setInputValue] = useState("");
  const [bulkInputValue, setBulkInputValue] = useState("[16, 14, 10, 8, 7, 9, 3, 2, 4, 1]");
  const [isAnimating, setIsAnimating] = useState(false);
  const [dataType, setDataType] = useState<'number' | 'string' | null>(null);
  const { toast } = useToast();

  const updateVisuals = useCallback((currentHeap: HeapValue[]) => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    if (currentHeap.length === 0) {
        setNodes([]);
        setEdges([]);
        return;
    }

    const B_FACTOR = 40; // horizontal distance
    const V_FACTOR = 70; // vertical distance

    const traverse = (i: number, x: number, y: number, level: number, width: number) => {
      if (i >= currentHeap.length) return;

      newNodes.push({ id: i, value: currentHeap[i], x, y, highlight: false });
      
      const offset = width / 2;
      
      const leftChildIndex = 2 * i + 1;
      const rightChildIndex = 2 * i + 2;

      if (leftChildIndex < currentHeap.length) {
        const childX = x - offset;
        const childY = y + V_FACTOR;
        newEdges.push({ id: `${i}-${leftChildIndex}`, x1: x, y1: y, x2: childX, y2: childY });
        traverse(leftChildIndex, childX, childY, level + 1, width/2);
      }
      if (rightChildIndex < currentHeap.length) {
        const childX = x + offset;
        const childY = y + V_FACTOR;
        newEdges.push({ id: `${i}-${rightChildIndex}`, x1: x, y1: y, x2: childX, y2: childY });
        traverse(rightChildIndex, childX, childY, level + 1, width/2);
      }
    };
    
    const maxDepth = Math.floor(Math.log2(currentHeap.length));
    const initialWidth = (2 ** maxDepth) * B_FACTOR;

    traverse(0, 0, 0, 0, initialWidth);
    
    setNodes(newNodes);
    setEdges(newEdges);
  }, []);

  const highlightNodes = (indices: number[], highlight: boolean) => {
      setNodes(prev => prev.map(node => indices.includes(node.id) ? {...node, highlight} : node));
  };

  const compare = (a: HeapValue, b: HeapValue) => {
    if (heapType === 'min') {
        return a < b;
    }
    return a > b;
  };
  
  const heapifyUp = async (tempHeap: HeapValue[], i: number) => {
      let currentIndex = i;
      let parentIndex = Math.floor((currentIndex - 1) / 2);

      while(currentIndex > 0 && compare(tempHeap[currentIndex], tempHeap[parentIndex])) {
        highlightNodes([currentIndex, parentIndex], true);
        await sleep(400);

        [tempHeap[currentIndex], tempHeap[parentIndex]] = [tempHeap[parentIndex], tempHeap[currentIndex]];
        updateVisuals(tempHeap);
        await sleep(400);

        highlightNodes([currentIndex, parentIndex], false);
        currentIndex = parentIndex;
        parentIndex = Math.floor((currentIndex - 1) / 2);
      }
      return tempHeap;
  };
  
  const heapifyDown = async (tempHeap: HeapValue[], i: number) => {
      let currentIndex = i;
      const n = tempHeap.length;
      
      while (true) {
        let swapIndex = currentIndex;
        const leftChild = 2 * currentIndex + 1;
        const rightChild = 2 * currentIndex + 2;

        if (leftChild < n && compare(tempHeap[leftChild], tempHeap[swapIndex])) {
            swapIndex = leftChild;
        }

        if (rightChild < n && compare(tempHeap[rightChild], tempHeap[swapIndex])) {
            swapIndex = rightChild;
        }

        if (swapIndex !== currentIndex) {
            highlightNodes([currentIndex, swapIndex], true);
            await sleep(400);

            [tempHeap[currentIndex], tempHeap[swapIndex]] = [tempHeap[swapIndex], tempHeap[currentIndex]];
            updateVisuals(tempHeap);
            await sleep(400);

            highlightNodes([currentIndex, swapIndex], false);
            currentIndex = swapIndex;
        } else {
            break;
        }
      }
      return tempHeap;
  };

  const handleInsert = async () => {
    if (!inputValue.trim()) {
      toast({ variant: "destructive", title: "Invalid input", description: "Input value cannot be empty." });
      return;
    }

    const valueToInsert: HeapValue = dataType === 'number' ? parseInt(inputValue, 10) : inputValue;
    
    if (dataType === 'number' && isNaN(valueToInsert as number)) {
        toast({ variant: "destructive", title: "Invalid input", description: "Please enter a valid number." });
        return;
    }
     if (heap.length > 0 && typeof valueToInsert !== dataType) {
      toast({ variant: "destructive", title: "Type Mismatch", description: `Please insert a ${dataType}.` });
      return;
    }
    if (heap.length === 0) {
        setDataType(typeof valueToInsert === 'number' ? 'number' : 'string');
    }

    if (heap.length >= 15) {
        toast({ variant: "destructive", title: "Heap is full", description: "Max size of 15 reached." });
        return;
    }

    setIsAnimating(true);
    let tempHeap = [...heap, valueToInsert];
    updateVisuals(tempHeap);
    await sleep(200);

    tempHeap = await heapifyUp(tempHeap, tempHeap.length - 1);
    setHeap(tempHeap);
    updateVisuals(tempHeap);

    setInputValue("");
    setIsAnimating(false);
  };
  
  const handleExtract = async () => {
    if (heap.length === 0) {
        toast({ variant: "destructive", title: "Heap is empty" });
        return;
    }
    setIsAnimating(true);
    let tempHeap = [...heap];
    tempHeap[0] = tempHeap[tempHeap.length - 1];
    tempHeap.pop();

    updateVisuals(tempHeap);
    await sleep(400);

    if (tempHeap.length > 0) {
        tempHeap = await heapifyDown(tempHeap, 0);
    }
    setHeap(tempHeap);
    updateVisuals(tempHeap);
    
    setIsAnimating(false);
  };

  const handleBuildHeap = async () => {
    try {
        const parsed = JSON.parse(bulkInputValue);
        if (!Array.isArray(parsed)) throw new Error("Input must be an array.");
        if (parsed.length === 0) {
            setHeap([]);
            updateVisuals([]);
            setDataType(null);
            return;
        };

        const isAllNumbers = parsed.every(item => typeof item === 'number');
        const isAllStrings = parsed.every(item => typeof item === 'string');

        if (!isAllNumbers && !isAllStrings) {
            throw new Error("Array must contain either all numbers or all strings.");
        }
        
        const newDataType = isAllNumbers ? 'number' : 'string';
        setDataType(newDataType);

        const n = parsed.length;
        let tempHeap = [...parsed];

        setIsAnimating(true);
        updateVisuals(tempHeap);
        await sleep(500);

        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            tempHeap = await heapifyDown(tempHeap, i);
        }

        setHeap(tempHeap);
        updateVisuals(tempHeap);
        setIsAnimating(false);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Parsing Error",
            description: error instanceof Error ? error.message : "Could not parse array.",
        });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Build Heap</CardTitle>
          <CardDescription>Enter an array of numbers or strings, e.g., [10, 20, 5] or ["apple", "banana", "cherry"].</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2">
            <Textarea
              value={bulkInputValue}
              onChange={(e) => setBulkInputValue(e.target.value)}
              placeholder='e.g., [16, 14, 10, 8, 7, 9, 3, 2, 4, 1]'
              className="font-code"
              rows={3}
              disabled={isAnimating}
            />
            <Button onClick={handleBuildHeap} className="h-full" disabled={isAnimating}>Build Heap</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Manual Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex flex-col gap-2">
                  <Label>Heap Type</Label>
                  <RadioGroup disabled={isAnimating} value={heapType} onValueChange={(v: any) => setHeapType(v)} className="flex items-center h-10">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="min" id="min" /><Label htmlFor="min">Min Heap</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="max" id="max" /><Label htmlFor="max">Max Heap</Label></div>
                  </RadioGroup>
              </div>
              <div className="flex flex-col gap-2">
                  <Label htmlFor="value">Value to Insert</Label>
                  <Input id="value" type={dataType === 'number' ? 'number' : 'text'} value={inputValue} onChange={e => setInputValue(e.target.value)} className="w-full md:w-48" disabled={isAnimating || heap.length === 0} onKeyDown={(e) => e.key === 'Enter' && handleInsert()} />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleInsert} disabled={isAnimating || (heap.length === 0 && !inputValue)}>Insert</Button>
                <Button onClick={handleExtract} variant="outline" disabled={isAnimating || heap.length === 0}>Extract {heapType === 'min' ? 'Min' : 'Max'}</Button>
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
                    <SelectItem value="tree">Tree View</SelectItem>
                    <SelectItem value="array">Array View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Visualization</CardTitle></CardHeader>
        <CardContent className="min-h-[400px] w-full flex items-center justify-center overflow-auto p-4">
            {visualizationType === 'tree' ? (
                <div className="w-full h-[400px] relative">
                  <AnimatePresence>
                      {edges.map(edge => (
                          <motion.div
                              key={edge.id}
                              className="absolute"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                              style={{ left: '50%', top: '20px' }}
                          >
                              <svg className="overflow-visible absolute">
                                  <line x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} className="stroke-muted-foreground" strokeWidth="2"/>
                              </svg>
                          </motion.div>
                      ))}
                  </AnimatePresence>
                  <AnimatePresence>
                      {nodes.map(node => (
                          <motion.div key={node.id}
                              className="absolute flex items-center justify-center"
                              initial={{ x: node.x, y: node.y, opacity: 0, scale: 0.5, left: '50%', top: '20px' }}
                              animate={{ x: node.x, y: node.y, opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
                              style={{
                                  transform: `translate(-50%, -50%) translate(${node.x}px, ${node.y}px)`
                              }}
                              >
                              <motion.div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground font-code text-sm font-semibold"
                                animate={{ backgroundColor: node.highlight ? 'hsl(var(--accent))' : 'hsl(var(--primary))' }}
                              >
                                {String(node.value)}
                              </motion.div>
                          </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {heap.map((value, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="w-16 h-16 border rounded-md flex items-center justify-center font-code text-lg bg-primary text-primary-foreground">
                                {String(value)}
                            </div>
                            <span className="text-xs text-muted-foreground mt-1">{index}</span>
                        </div>
                    ))}
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
