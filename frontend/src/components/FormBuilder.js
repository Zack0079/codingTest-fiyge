import React, { useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';

import Sidebar from "./Sidebar"

// Define drag-and-drop item types
const ItemTypes = {
  COMPONENT: "component",
};



// Canvas Component (Drop Zone)
const Canvas = ({ components, onDrop, onDelete }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.COMPONENT,
    drop: (item) => onDrop(item), // Handle the dropped item
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  console.log("Canvas components", components)
  return (
    <div ref={drop} className={`canvas ${isOver ? "hovered" : ""}`}>
      {components.length === 0 ? (
        <p>Drag and drop components here...</p>
      ) : (
        components.map((component, index) => (
          <CanvasComponent
            key={component.id}
            component={component}
            onDelete={() => onDelete(index)}
          />
        ))
      )}
    </div>
  );
};

// Canvas Component (Editable Items)
const CanvasComponent = ({ component, onDelete }) => {
  return (
    <div className="canvas-item">
      <label className="red">{component.required && "*"}</label>
      <label className="form-labal">{component.label}</label>

      {(() => {
        switch (component.type) {

          case "Text Input":
            return <input type="text" placeholder={component.placeholder || "Enter text"} />

          case "Text Area":
            return (
              <textarea
                placeholder={component.placeholder || "Enter text"}
                rows={component.rows || "4"}
                cols={component.cols || "100"}
              />
            )
          case "Select Dropdown":
            return <>
              <select>
                <option value="" selected hidden>Select an Option</option>
                {component.optionsArr.map((item, idx) => {
                  return (
                    <option value={item}>{item}</option>
                  )
                })
                }

              </select>

            </>

          case "Checkbox":
            if (component.single) {
              return <input type="checkbox" />
            } else {
              return <div>

                {component.optionsArr.map((item, idx) => {
                  // console.log("2:",component);
                  return (
                    <label key={idx}>
                      <input type="checkbox" name={`radio-${component.id}`} value={item} />
                      {item}
                    </label>
                  )
                })}

              </div>
            }

          case "Radio Buttons":
            return <div>

              {component.optionsArr.map((item, idx) => {
                // console.log("2:",component);
                return (
                  <label key={idx}>
                    <input type="radio" name={`radio-${component.id}`} />
                    {item}
                  </label>
                )
              })}

            </div>

          case "Date Picker":
            return <input className="datapicker" type="date" />

          case "File Upload":
            return <input type="file" />

          default:
            return null
        }
      })()}
      <div>
        <FontAwesomeIcon className="padding-btn" onClick={onDelete} icon={faMinusCircle} />

      </div>

    </div>
  );
};

// Main FormBuilder Component
const FormBuilder = () => {
  const [canvasComponents, setCanvasComponents] = useState([]);

  // Handle dropping a new component onto the canvas
  const handleDrop = useCallback(component => {
    const newComponent = 
    {
      ...JSON.parse(JSON.stringify(component)),
      id: `${component.type}-${Date.now()}`, // Assign a unique ID to the new component
    };
    console.log("canvasComponents:", canvasComponents)

    console.log("newComponent:", newComponent)

    const tmp = canvasComponents;
    tmp.push(newComponent)
    setCanvasComponents(tmp);
    // console.log("canvasComponents:",tmp)
  });

  // Handle deleting a component from the canvas
  const handleDeleteComponent = (index) => {
    const updatedComponents = canvasComponents.filter((_, idx) => idx !== index);
    setCanvasComponents(updatedComponents);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="form-builder">
        <Sidebar />
        <Canvas
          components={canvasComponents}
          onDrop={handleDrop}
          onDelete={handleDeleteComponent}
        />
      </div>
    </DndProvider>
  );
};

export default FormBuilder;
