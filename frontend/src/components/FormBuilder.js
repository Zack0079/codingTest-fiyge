import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Define drag-and-drop item types
const ItemTypes = {
  COMPONENT: "component",
};

// Sidebar Component
const Sidebar = ({ components, onAddComponent }) => {
  return (
    <div className="sidebar">
      <h3>Components</h3>
      {components.map((component) => (
        <SidebarItem key={component.id} component={component} onAdd={onAddComponent} />
      ))}
    </div>
  );
};

// Sidebar Item (Draggable)
const SidebarItem = ({ component, onAdd }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COMPONENT,
    item: component,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`sidebar-item ${isDragging ? "dragging" : ""}`}
    >
      {component.label}
    </div>
  );
};

// Canvas Component (Drop Zone)
const Canvas = ({ components, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.COMPONENT,
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className={`canvas ${isOver ? "hovered" : ""}`}>
      {components.map((component, index) => (
        <CanvasComponent key={index} component={component} />
      ))}
    </div>
  );
};

// Canvas Component (Displays Dropped Components)
const CanvasComponent = ({ component }) => {
  return (
    <div className="canvas-item">
      <label>{component.label}</label>
      {component.type === "TextInput" && (
        <input type="text" placeholder={component.placeholder || "Enter text"} />
      )}
      {component.type === "Checkbox" && <input type="checkbox" />}
      {component.type === "RadioButtons" && (
        <div>
          {component.options.map((option, index) => (
            <label key={index}>
              <input type="radio" name="radio-group" />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

// Main FormBuilder Component
const FormBuilder = () => {
  const [canvasComponents, setCanvasComponents] = useState([]);

  // Predefined Components
  const sidebarComponents = [
    { id: "1", type: "TextInput", label: "Text Input", placeholder: "Enter text" },
    { id: "2", type: "Checkbox", label: "Checkbox" },
    { id: "3", type: "RadioButtons", label: "Radio Buttons", options: ["Option 1", "Option 2"] },
  ];

  // Handle dropping a new component onto the canvas
  const handleDrop = (component) => {
    setCanvasComponents([...canvasComponents, { ...component }]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="form-builder">
        <Sidebar components={sidebarComponents} />
        <Canvas components={canvasComponents} onDrop={handleDrop} />
      </div>
    </DndProvider>
  );
};

export default FormBuilder;
