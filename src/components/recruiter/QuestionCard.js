import React from 'react';
import { Card } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Plus, Move } from "lucide-react";

export function QuestionCard({ title, options = [], isTextInput = false }) {
  return (
    <Card className="w-96 p-6 relative">
      <div className="absolute right-4 top-4 text-[rgb(122,86,144,1)] cursor-move">
        <Move className="h-4 w-4" />
      </div>

      <h3 className="font-medium mb-4">{title}</h3>

      {isTextInput ? (
        <textarea 
          className="w-full p-2 border rounded-md" 
          placeholder="Please enter your text..." 
          rows={3} 
        />
      ) : (
        <RadioGroup className="gap-3">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 border-2 bg-black">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      )}

      <Button variant="ghost" className="mt-4">
        <Plus className="h-4 w-4 mr-2" />
        Add Option
      </Button>
    </Card>
  );
}