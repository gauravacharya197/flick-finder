"use client";
import { useSearchParams } from 'next/navigation';
import React, { useRef, useState } from 'react'

export const Dashboard = () => {
  const renderCount = useRef(0); // Mutable value that doesn't trigger re-render
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
    renderCount.current += 1; // Update the render count
  };
    return (
        <section className="pb-20 pt-35 lg:pb-25 lg:pt-40 xl:pb-30 xl:pt-25 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
     
      <p>Count: {count}</p>
      <p>Render Count: {renderCount.current}</p>
      <button onClick={increment}>Increment</button>
        </div>

        </section>

  )
}
