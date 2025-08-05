# Product Requirements Document: DSA Visualizer

## 1. Overview

This document outlines the product requirements for the DSA Visualizer, an interactive web application designed to help users visualize and understand common data structures and algorithms. The target audience includes students, developers, and educators.

## 2. Current Scope

The current version of the application focuses on providing visualizations for the following data structures:

### 2.1. Core Features

*   **Array Visualizer**: Interactive visualizations for 1-D & 2-D arrays, with support for bar, line, dot, grid, and heatmap views.
*   **Stack Visualizer**: See the Last-In, First-Out (LIFO) principle in action with push and pop operations.
*   **Queue Visualizer**: Watch the First-In, First-Out (FIFO) data flow with enqueue and dequeue animations.
*   **Heap Visualizer**: Explore binary heaps (both Min & Max) with clear tree and array representations.
*   **HashMap Visualizer**: Understand hashing, key-value storage, and collision handling in a hash table.
*   **Theme Toggle**: Switch between a clean light mode and a sleek dark mode.
*   **Toast Manager**: Provides feedback to the user for different actions.

### 2.2. Design and Technology

*   **Framework**: Next.js (with App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **UI Components**: ShadCN UI
*   **Animations**: Framer Motion
*   **Design**: Mobile-first, lightweight design with a clean and intuitive interface.

## 3. Possible Future Extensions

The following features are being considered for future releases to enhance the learning experience:

### 3.1. Additional Data Structures

*   **Tree Visualizer**: Add support for visualizing various tree structures, including:
    *   Binary Search Trees (BST)
    *   AVL Trees
    *   Red-Black Trees
*   **Graph Visualizer**: Implement visualizations for graph algorithms, such as:
    *   Breadth-First Search (BFS)
    *   Depth-First Search (DFS)
    *   Dijkstra's Algorithm
    *   A* Search Algorithm
*   **Trie Visualizer**: Visualize prefix trees for efficient string searching.
*   **Linked List Visualizer**: Add support for visualizing singly and doubly linked lists.

### 3.2. Algorithm Visualizations

*   **Sorting Algorithms**: Animate popular sorting algorithms on arrays, such as:
    *   Bubble Sort
    *   Merge Sort
    *   Quick Sort
    *   Insertion Sort
*   **Searching Algorithms**: Visualize searching algorithms like Binary Search on a sorted array.

### 3.3. Enhanced User Experience

*   **Code Snippets**: Display corresponding code snippets for the visualized operations in various programming languages (e.g., Python, JavaScript, Java).
*   **Interactive Tutorials**: Guided, step-by-step tutorials for each data structure and algorithm.
*   **Custom Input**: Allow users to input their own data to visualize.
*   **Speed Control**: Let users control the animation speed for a personalized learning pace.
