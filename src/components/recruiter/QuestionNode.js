import React, { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus, X } from "lucide-react";
import Edit from "../../assets/icons/edit"

export function QuestionNode({ data, isConnectable, id }) {
  const [options, setOptions] = useState(data.options || []);
  const [newOption, setNewOption] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(data.title);
  const [editedOptions, setEditedOptions] = useState(
    options.map((option) => option.text)
  );
  const [answerText, setAnswerText] = useState(data.answerText || "");
  const [endText, setEndText] = useState(data.endText || "");
  
  const isViewOnly = data.isViewOnly === true;

  useEffect(() => {
    setOptions(data.options || []);
    setEditedOptions((data.options || []).map((option) => option.text));
    setEditedTitle(data.title);
    setAnswerText(data.answerText || "");
    setEndText(data.endText || "");
  }, [data]);

  const updateNodeData = (newData) => {
    if (data.updateNodeData && !isViewOnly) {
      data.updateNodeData(id, newData);
    }
  };

  const addOption = () => {
    if (newOption.trim() !== "") {
      // Use a simpler ID for new options
      const optionNumber = options.length + 1;
      const newOptionObj = {
        id: `opt${optionNumber}`,
        text: newOption.trim()
      };
      const updatedOptions = [...options, newOptionObj];
      setOptions(updatedOptions);
      setEditedOptions([...editedOptions, newOption.trim()]);
      setNewOption("");
      setShowInput(false);

      updateNodeData({ options: updatedOptions });
    }
  };

  const removeOption = (id) => {
    const updatedOptions = options.filter((option) => option.id !== id);
    setOptions(updatedOptions);
    setEditedOptions(updatedOptions.map((option) => option.text));

    updateNodeData({ options: updatedOptions });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...editedOptions];
    updatedOptions[index] = value;
    setEditedOptions(updatedOptions);
  };

  const saveEdit = () => {
    const updatedTitle = editedTitle;

    const updatedOptions = options.map((option, index) => ({
      ...option,
      text: editedOptions[index]
    }));
    setOptions(updatedOptions);

    let updates = {
      title: updatedTitle,
      options: updatedOptions
    };

    if (data.type === "text") {
      updates.answerText = answerText;
    } else if (data.type === "end") {
      updates.endText = endText;
    }

    updateNodeData(updates);

    setIsEditing(false);
  };

  // Handler for end text changes
  const handleEndTextChange = (e) => {
    const newText = e.target.value;
    setEndText(newText);
    // Update the node data immediately without requiring a save button
    updateNodeData({ endText: newText });
  };

  if (data.type === "end") {
    return (
      <div className="relative rounded-[16px] border-2 border-gray-300 shadow-sm p-4 bg-[#614573] w-[307px]">
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={!isViewOnly && isConnectable}
          style={{
            top: "50%",
            left: "-6px"
          }}
        />

        <textarea
          value={endText}
          onChange={handleEndTextChange}
          placeholder="Enter your final message here..."
          className="w-full h-32 rounded-md p-2 bg-[#614573] text-white resize-none focus:outline-none focus:ring-1 focus:ring-white"
          disabled={isViewOnly}
        />
      </div>
    );
  }

  return (
    <div className="relative rounded-[16px] border border-[#E0E0E0] shadow-sm p-4 bg-white w-[307px]">
      {(data.type !== "options" || !data.isFirstNode) && (
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={!isViewOnly && isConnectable}
          style={{
            top: "35%",
            left: "-6px"
          }}
        />
      )}

      {!isViewOnly && (
        <button
          onClick={() => setIsEditing(true)}
          className="group mb-5 w-full flex justify-end"
        >
          <Edit className="group-hover:text-[#825C9A] text-[#BFBFBF]"/>
        </button>
      )}

      <div className="flex items-center justify-between mb-2">
        {isEditing && !isViewOnly ? (
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            autoFocus
            className="text-base font-medium text-gray-900 border-2 border-gray-300 p-1 rounded"
          />
        ) : (
          <h3 className="font-medium text-gray-900 text-base">{editedTitle}</h3>
        )}
      </div>

      <div className="border-b border-gray-300 mb-4"></div>

      {data.type === "options" ? (
        <div className="space-y-2">
          <RadioGroup className="gap-2">
            {options.map((option, index) => (
              <div
                key={option.id}
                className="relative flex items-center justify-between bg-white p-3 rounded-full border border-gray-300"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    className="border-gray-400"
                    disabled={isViewOnly}
                  />
                  {isEditing && !isViewOnly ? (
                    <Input
                      value={editedOptions[index]}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      className="flex-grow text-sm border-gray-300 p-1 rounded"
                    />
                  ) : (
                    <Label htmlFor={option.id} className="text-gray-800">
                      {option.text}
                    </Label>
                  )}
                </div>
                {/* Only show remove button in edit mode */}
                {isEditing && !isViewOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(option.id)}
                    disabled={options.length <= 1}
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </Button>
                )}
                <Handle
                  type="source"
                  position={Position.Right}
                  id={option.id}
                  style={{
                    top: "50%",
                    right: "-6px"
                  }}
                  isConnectable={!isViewOnly && isConnectable}
                />
              </div>
            ))}
          </RadioGroup>

          {!isViewOnly && (showInput ? (
            <div className="flex items-center space-x-2 p-2 border rounded-full bg-white">
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Enter option"
                className="flex-grow text-sm"
              />
              <Button
                size="sm"
                onClick={addOption}
                className="bg-black text-white rounded-full px-3 py-1"
              >
                Add
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowInput(false)}
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="w-full text-gray-600 group text-sm hover:text-gray-800 hover:border-[#825C9A] flex items-center gap-2 p-3 border border-gray-300 rounded-full bg-white shadow-sm"
            >
              Add Option <Plus className="h-5 w-5 group-hover:text-[#825C9A]" />
            </button>
          ))}
        </div>
      ) : data.type === "text" ? (
        <div className="space-y-3">
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Enter your answer here..."
            className="w-full h-24 border border-gray-300 rounded-md p-2 text-gray-700"
            disabled={isViewOnly || !isEditing}
          />

          <Handle
            type="source"
            position={Position.Right}
            id="text-output"
            style={{
              top: "50%",
              right: "-6px"
            }}
            isConnectable={!isViewOnly && isConnectable}
          />
        </div>
      ) : null}

      {isEditing && !isViewOnly && (
        <div className="mt-4">
          <Button
            onClick={saveEdit}
            className="bg-black text-white rounded-full px-4 py-2"
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
}