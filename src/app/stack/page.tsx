
"use client";

import { useState } from "react";
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

export default function StackPage() {
  const [stack, setStack] = useState<string[]>(['1', '2', '3', '4', '5']);
  const [inputValue, setInputValue] = useState("");
  const [bulkInputValue, setBulkInputValue] = useState("[1, 2, 3, 4, 5]");
  const { toast } = useToast();

  const handlePush = () => {
    if (inputValue.trim() === "") {
        return;
    }
    if (stack.length >= 20) {
      toast({
        variant: "destructive",
        title: "Stack is full",
        description: "Maximum size of 20 reached.",
      });
      return;
    }
    setStack((prev) => [...prev, inputValue]);
    setInputValue("");
  };

  const handlePop = () => {
    if (stack.length === 0) {
      toast({ variant: "destructive", title: "Stack is empty" });
      return;
    }
    setStack((prev) => prev.slice(0, prev.length - 1));
  };
  
  const handleClear = () => {
    setStack([]);
  }

  const handleLoadStackFromValue = (value: string) => {
    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
            const stringArray = parsed.map(String);
            setStack(stringArray);
            return;
        }
         // It's a string from JSON.parse, remove quotes
        const chars = parsed.toString().split('');
        setStack(chars);
    } catch (e) {
        // Not a valid JSON array, treat as a string
        const chars = value.split('');
        setStack(chars);
    }
  }

  const handleLoadStack = () => {
    handleLoadStackFromValue(bulkInputValue);
  }
  
  const loadSample = (type: 'numbers' | 'string') => {
      let sampleValue = '';
      if (type === 'numbers') sampleValue = '[10, 20, 30, 40, 50]';
      if (type === 'string') sampleValue = '"VisuAlgo"';
      setBulkInputValue(sampleValue);
      handleLoadStackFromValue(sampleValue);
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
          <CardTitle>Stack Input</CardTitle>
          <CardDescription>Enter an array e.g., [1,2,3] or a string e.g., "hello" (elements added from index 0).</CardDescription>
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
            <Button onClick={handleLoadStack} className="h-full">Load Stack</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Manual Operations</CardTitle></CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full space-y-2">
              <Label htmlFor="value">Element to push</Label>
              <Input
                id="value"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePush()}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handlePush}>Push</Button>
              <Button onClick={handlePop} variant="outline">Pop</Button>
              <Button onClick={handleClear} variant="outline">Clear</Button>
            </div>
            <div className="w-full md:w-auto space-y-2">
              <Label>Sample Data</Label>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => loadSample('numbers')}>Numbers</Button>
                <Button variant="secondary" size="sm" onClick={() => loadSample('string')}>String</Button>
              </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Stack Information</CardTitle></CardHeader>
        <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-sm text-muted-foreground">Size</p>
                    <p className="text-2xl font-bold">{stack.length}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Top Element</p>
                    <p className="text-2xl font-bold font-code">{stack.length > 0 ? stack[stack.length - 1] : 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Is Empty</p>
                    <p className="text-2xl font-bold">{stack.length === 0 ? 'Yes' : 'No'}</p>
                </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Stack Visualization</CardTitle>
            <span className="text-sm font-medium text-muted-foreground">LIFO - Last In, First Out</span>
          </div>
        </CardHeader>
        <CardContent className="min-h-[500px] flex justify-center items-end border-b-4 border-primary p-4 overflow-y-auto">
          <TooltipProvider>
              <div className="flex justify-center items-end h-full">
                <div className="flex flex-col-reverse gap-2 w-28 pb-8 relative">
                  <AnimatePresence>
                    {stack.map((value, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <motion.div
                            layout
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                            className="h-10 bg-primary text-primary-foreground rounded-md flex items-center justify-center font-code text-lg shadow-md flex-shrink-0 p-2 w-full"
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
                    ))}
                  </AnimatePresence>
                  {stack.length > 0 && 
                    <div className="text-center text-muted-foreground font-semibold absolute -top-8 w-full">TOP</div>
                  }
                </div>
              </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
}
