
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Key, Trash2, Search } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const HASH_TABLE_SIZE = 10;

type HashNode = {
  key: string;
  value: string;
};

export default function HashMapPage() {
  const [hashTable, setHashTable] = useState<Array<Array<HashNode>>>(
    Array.from({ length: HASH_TABLE_SIZE }, () => [])
  );
  const [keyInput, setKeyInput] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [bulkInputValue, setBulkInputValue] = useState('[["name", "Alice"], ["age", 30], ["city", "New York"], ["country", "USA"], ["occupation", "Engineer"]]');
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [foundNode, setFoundNode] = useState<HashNode | null>(null);

  const { toast } = useToast();

  const hashFunction = (key: string) => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash) % HASH_TABLE_SIZE;
  };

  const animateAndSet = async (index: number | null, newTable: Array<Array<HashNode>>) => {
    setIsAnimating(true);
    if (index !== null) {
      setHighlightedIndex(index);
      await new Promise((res) => setTimeout(res, 500));
    }
    setHashTable(newTable);
    if (index !== null) {
      setHighlightedIndex(null);
    }
    setIsAnimating(false);
  };

  const handleInsert = async () => {
    if (!keyInput || !valueInput) {
      toast({ variant: "destructive", title: "Key and Value required" });
      return;
    }
    const index = hashFunction(keyInput);
    const newTable = hashTable.map((bucket) => [...bucket]);
    const bucket = newTable[index];
    const existingNodeIndex = bucket.findIndex((node) => node.key === keyInput);

    if (existingNodeIndex !== -1) {
      bucket[existingNodeIndex].value = valueInput;
    } else {
      bucket.push({ key: keyInput, value: valueInput });
    }

    await animateAndSet(index, newTable);
    setKeyInput("");
    setValueInput("");
  };

  const handleDelete = async () => {
    if (!keyInput) {
      toast({ variant: "destructive", title: "Key required for deletion" });
      return;
    }
    const index = hashFunction(keyInput);
    const newTable = hashTable.map((bucket) => [...bucket]);
    const bucket = newTable[index];
    const nodeIndex = bucket.findIndex((node) => node.key === keyInput);

    if (nodeIndex !== -1) {
      bucket.splice(nodeIndex, 1);
    } else {
      toast({ variant: "destructive", title: "Not Found", description: `Key '${keyInput}' not found.` });
    }
    await animateAndSet(index, newTable);
    setKeyInput("");
  };

  const handleSearch = async () => {
    if (!keyInput) {
      toast({ variant: "destructive", title: "Key required for search" });
      return;
    }
    const index = hashFunction(keyInput);
    const bucket = hashTable[index];
    const node = bucket.find((n) => n.key === keyInput);

    setIsAnimating(true);
    setHighlightedIndex(index);
    await new Promise((res) => setTimeout(res, 500));
    
    if (node) {
      setFoundNode(node);
    } else {
      setFoundNode(null);
      toast({ variant: "destructive", title: "Not Found", description: `Key '${keyInput}' not found.` });
    }
    setHighlightedIndex(null);
    setIsAnimating(false);
  };
  
  const handleBuildMap = () => {
    try {
      const parsed = JSON.parse(bulkInputValue);
      if (!Array.isArray(parsed) || !parsed.every(item => Array.isArray(item) && item.length === 2)) {
        throw new Error("Input must be an array of [key, value] pairs.");
      }

      const newTable: Array<Array<HashNode>> = Array.from({ length: HASH_TABLE_SIZE }, () => []);
      for (const pair of parsed) {
        const key = String(pair[0]);
        const value = String(pair[1]);
        const index = hashFunction(key);
        const bucket = newTable[index];
        const existingNodeIndex = bucket.findIndex(node => node.key === key);

        if (existingNodeIndex !== -1) {
          bucket[existingNodeIndex].value = value;
        } else {
          bucket.push({ key, value });
        }
      }
      animateAndSet(null, newTable);

    } catch (error) {
       toast({
            variant: "destructive",
            title: "Parsing Error",
            description: error instanceof Error ? error.message : "Could not parse input. Check format.",
        });
    }
  };


  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Build HashMap</CardTitle>
          <CardDescription>Enter an array of key-value pairs, e.g., [["name", "Alice"], ["age", 30]].</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2">
            <Textarea
              value={bulkInputValue}
              onChange={(e) => setBulkInputValue(e.target.value)}
              placeholder='e.g., [["key1", "value1"], ["key2", 123]]'
              className="font-code"
              rows={3}
              disabled={isAnimating}
            />
            <Button onClick={handleBuildMap} className="h-full" disabled={isAnimating}>Build</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manual Operations</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="key">Key</Label>
            <Input id="key" type="text" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} className="w-24" disabled={isAnimating} />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="value">Value</Label>
            <Input id="value" type="text" value={valueInput} onChange={(e) => setValueInput(e.target.value)} className="w-24" disabled={isAnimating} />
          </div>
          <Button onClick={handleInsert} disabled={isAnimating}><Key className="mr-2 h-4 w-4" />Insert / Update</Button>
          <Button onClick={handleDelete} variant="outline" disabled={isAnimating}><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
          <Button onClick={handleSearch} variant="outline" disabled={isAnimating}><Search className="mr-2 h-4 w-4" />Search</Button>
        </CardContent>
      </Card>
      
      {foundNode && (
         <Card>
            <CardHeader><CardTitle>Search Result</CardTitle></CardHeader>
            <CardContent>
                <p>Found Key: <span className="font-mono p-1 bg-muted rounded">{foundNode.key}</span></p>
                <p>Value: <span className="font-mono p-1 bg-muted rounded">{foundNode.value}</span></p>
            </CardContent>
         </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Visualization</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {hashTable.map((bucket, index) => (
            <div key={index} className="flex items-center gap-4">
              <motion.div
                className="w-12 h-12 flex items-center justify-center font-mono text-lg rounded-md border"
                animate={{
                  backgroundColor: highlightedIndex === index ? "hsl(var(--accent))" : "hsl(var(--card))",
                  color: highlightedIndex === index ? "hsl(var(--accent-foreground))" : "hsl(var(--foreground))"
                }}
                transition={{ duration: 0.3 }}
              >
                {index}
              </motion.div>
              <ArrowRight className="text-muted-foreground" />
              <div className="flex-1 flex flex-wrap items-center gap-2 p-2 rounded-md bg-muted min-h-[56px] overflow-x-auto">
                <AnimatePresence>
                {bucket.map((node, i) => (
                  <motion.div
                    key={node.key}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center"
                  >
                    <div className="bg-primary text-primary-foreground rounded-md p-2 flex items-center gap-1 font-mono text-sm shadow-md whitespace-nowrap">
                      <span>{node.key}</span>
                      <span className="text-xs">:</span>
                      <span>{node.value}</span>
                    </div>
                    {i < bucket.length - 1 && <ArrowRight className="mx-2 text-primary" />}
                  </motion.div>
                ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

    