
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function QueuePage() {
  const [queue, setQueue] = useState<string[]>(['10', '20', '30', '100000', '1', '1', '1', '1', '1212', '1221', '1211', '1212']);
  const [inputValue, setInputValue] = useState("");
  const [bulkInputValue, setBulkInputValue] = useState("['10', '20', '30', '100000', '1', '1', '1', '1', '1212', '1221', '1211', '1212']");
  const { toast } = useToast();

  const handleEnqueue = () => {
    if (inputValue.trim() === "") {
      return;
    }
    if (queue.length >= 20) {
      toast({
        variant: "destructive",
        title: "Queue is full",
        description: "Maximum size of 20 reached.",
      });
      return;
    }
    setQueue((prev) => [...prev, inputValue]);
    setInputValue("");
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      toast({ variant: "destructive", title: "Queue is empty" });
      return;
    }
    setQueue((prev) => prev.slice(1));
  };
  
  const handleClear = () => {
    setQueue([]);
  }

  const handleLoadQueueFromValue = (value: string) => {
    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
            const stringArray = parsed.map(String);
            setQueue(stringArray);
            return;
        }
        const chars = parsed.toString().split('');
        setQueue(chars);
    } catch (e) {
      // Not a valid JSON array, treat as a string
      const chars = value.split('');
      setQueue(chars);
    }
  }

  const handleLoadQueue = () => {
    handleLoadQueueFromValue(bulkInputValue);
  }

  const loadSample = (type: 'numbers' | 'string') => {
      let sampleValue = '';
      if (type === 'numbers') sampleValue = '[1, 8, 3, 6, 4]';
      if (type === 'string') sampleValue = '"FIFO"';
      setBulkInputValue(sampleValue);
      handleLoadQueueFromValue(sampleValue);
  }
  
  const formatValue = (value: string) => {
    if (value.length > 4) {
      return value.substring(0, 4) + ".";
    }
    return value;
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Queue Input</CardTitle>
          <CardDescription>Enter an array e.g., [1,2,3] or a string e.g., "hello".</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2">
            <Textarea
              value={bulkInputValue}
              onChange={(e) => setBulkInputValue(e.target.value)}
              placeholder='e.g., [1,2,3,4,5] or "hello"'
              className="font-code"
              rows={3}
            />
            <Button onClick={handleLoadQueue} className="h-full">Load Queue</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Manual Operations</CardTitle></CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4 items-end">
            <div className="grid w-full gap-2">
              <Label htmlFor="value">Element to enqueue</Label>
              <Input
                id="value"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEnqueue()}
              />
            </div>
            <div className="flex items-center gap-2">
                <Button onClick={handleEnqueue}>Enqueue</Button>
                <Button onClick={handleDequeue} variant="outline">Dequeue</Button>
                <Button onClick={handleClear} variant="outline">Clear</Button>
            </div>
            <div className="grid w-full md:w-auto gap-2">
              <Label>Sample Data</Label>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => loadSample('numbers')}>Numbers</Button>
                <Button variant="secondary" size="sm" onClick={() => loadSample('string')}>String</Button>
              </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Queue Information</CardTitle></CardHeader>
        <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                    <p className="text-sm text-muted-foreground">Size</p>
                    <p className="text-2xl font-bold">{queue.length}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Front</p>
                    <p className="text-2xl font-bold font-code">{queue.length > 0 ? queue[0] : 'N/A'}</p>
                </div>
                 <div>
                    <p className="text-sm text-muted-foreground">Rear</p>
                    <p className="text-2xl font-bold font-code">{queue.length > 0 ? queue[queue.length - 1] : 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Is Empty</p>
                    <p className="text-2xl font-bold">{queue.length === 0 ? 'Yes' : 'No'}</p>
                </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Queue Visualization</CardTitle>
            <span className="text-sm font-medium text-muted-foreground">FIFO - First In, First Out</span>
          </div>
        </CardHeader>
        <CardContent className="min-h-[12rem] flex items-center justify-center">
            <TooltipProvider>
                <div className="w-full p-4 bg-muted rounded-lg">
                    <div className="flex flex-wrap items-center gap-4">
                        <AnimatePresence>
                        {queue.map((value, index) => (
                            <React.Fragment key={`${value}-${index}`}>
                                {index === 0 && <div className="font-semibold text-muted-foreground">FRONT</div>}
                                <Tooltip>
                                <TooltipTrigger asChild>
                                    <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                                    transition={{ duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
                                    className="w-24 h-12 bg-primary text-primary-foreground rounded-md flex-shrink-0 flex items-center justify-center font-code text-lg shadow-md p-2"
                                    >
                                    {formatValue(value)}
                                    </motion.div>
                                </TooltipTrigger>
                                {value.length > 4 && (
                                    <TooltipContent>
                                    <p>{value}</p>
                                    </TooltipContent>
                                )}
                                </Tooltip>
                                {index === queue.length - 1 && <div className="font-semibold text-muted-foreground">REAR</div>}
                            </React.Fragment>
                        ))}
                        </AnimatePresence>
                    </div>
                </div>
            </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
}
