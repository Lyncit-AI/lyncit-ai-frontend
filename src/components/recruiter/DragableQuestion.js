import React, { useRef } from 'react';
import { useDrag } from "react-dnd";
import { Button } from "./ui/button";

export function DraggableQuestion({ question, icon, className, children }) {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "question",
    item: question,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  
  drag(ref);
  
  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Button 
        variant="ghost" 
        className={`text-black !py-5 hover:bg-gray-800 w-full flex gap-2 items-center ${className}`}
      >
        {icon}
        <span className="hidden md:inline">{question.title}</span>
      </Button>
      {children}
    </div>
  );
}