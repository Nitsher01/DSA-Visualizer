# Plan: Algorithm Visualizations

This document outlines the development plan for implementing algorithm visualizations in the DSA Visualizer application. The plan is divided into phases, starting with foundational sorting and searching algorithms and then moving towards custom code animation.

## Phase 1: Foundational Setup for Algorithm Visualizations

- [x] **Create a new page/route for algorithms**: Set up a dedicated page at `/algorithms` to host the new visualizers.
- [x] **Design a generic `Visualizer` component**: Develop a reusable React component that will be responsible for rendering the array and handling the animation sequence. This component will take the animation steps as a prop.
- [x] **Implement UI controls**: Create the user interface for:
    - Selecting the algorithm to visualize (e.g., a dropdown menu).
    - Controlling the animation (play, pause, reset buttons).
    - Adjusting the animation speed (e.g., a slider).
    - Displaying algorithm-specific information or complexity.

## Phase 2: Sorting Algorithm Implementation

- [x] **Implement Bubble Sort**: 
    - Create a function that performs Bubble Sort.
    - This function must return a list of animation steps (e.g., `[{type: 'compare', indices: [0, 1]}, {type: 'swap', indices: [0, 1]}]`).
    - Integrate the generated steps with the `Visualizer` component.
- [x] **Implement Merge Sort**:
    - Create a function for Merge Sort that generates animation steps.
    - Integrate with the `Visualizer` component.
- [x] **Implement Quick Sort**:
    - Create a function for Quick Sort that generates animation steps.
    - Integrate with the `Visualizer` component.
- [x] **Implement Insertion Sort**:
    - Create a function for Insertion Sort that generates animation steps.
    - Integrate with the `Visualizer` component.

## Phase 3: Searching Algorithm Implementation

- [x] **Implement Binary Search**:
    - Create a function for Binary Search that generates animation steps for a sorted array.
    - Integrate with the `Visualizer` component.

## Phase 4: Custom Code Animation (Future Scope)

- [ ] **Research execution environment**: Investigate and select the best approach for safely running user-provided code in the browser.
    - **JavaScript**: Sandboxed Web Worker or `iframe`.
    - **Python**: Pyodide or another WebAssembly-based solution.
- [ ] **Design a "Tracer" API**: Define a simple API that user code can import and use to record animation steps. For example:
    - `tracer.add_step('compare', [i, j])`
    - `tracer.add_step('swap', [i, j])`
- [ ] **Develop a code editor component**: Integrate a lightweight code editor (e.g., Monaco Editor) into the UI.
- [ ] **Implement the execution and rendering logic**: Write the backend logic to take the user's code, execute it with the tracer, and feed the resulting animation steps into the existing `Visualizer` component.
