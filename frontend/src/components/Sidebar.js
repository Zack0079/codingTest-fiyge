import { useDrag } from "react-dnd";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';

// Define drag-and-drop item types
const ItemTypes = {
    COMPONENT: "component",
};


const DefaultSidebarItems = [
    {
        type_id: 1,
        type: "Text Input",
        label: "Text Input",
        placeholder: "Enter text",
        required: false,
    },
    {
        type_id: 2,
        type: "Text Area",
        label: "Text Area",
        placeholder: "Enter text",
        rows: "4",
        // cols: "100",
        required: false
    },
    {
        type_id: 3,
        type: "Select Dropdown",
        label: "Select Dropdown",
        optionsArr: ["Option 1", "Option 2"],
        required: false
    },
    {
        type_id: 4,
        type: "Checkbox",
        label: "Checkbox",
        optionsArr: ["Option 1", "Option 2"],
        single: true,
        required: false,

    },
    {
        type_id: 5,
        type: "Radio Buttons",
        label: "Radio Buttons",
        optionsArr: ["Option 1", "Option 2"],
        required: false,
    },
    { type_id: 6, type: "Date Picker", label: "Date Picker", required: false },
    { type_id: 7, type: "File Upload", label: "File Upload", required: false },
]


// Sidebar Component
const Sidebar = () => {
    const [detailInputsItem, setDetailInputsItem] = useState();
    const [sidebarComponents, setSidebarComponents] = useState([]);

    useEffect(() => {
        setSidebarComponents(DefaultSidebarItems)
    }, [])

    const handleOnclick = (type) => {
        setDetailInputsItem(type)
    }

    const handleOptionsArr = (index, action) => {
        console.log("sidebarComponents", sidebarComponents)
        const updatedComponents = [...sidebarComponents];

        action ?
            updatedComponents[index].optionsArr.push("") :
            updatedComponents[index].optionsArr.pop()
        setSidebarComponents(updatedComponents)
    }

    const handleSingleCheckBox = (index, value) => {
        console.log("sidebarComponents", sidebarComponents)
        const updatedComponents = [...sidebarComponents];

        updatedComponents[index].single = value;
        setSidebarComponents(updatedComponents)
    }

    const handleDetail = (component) => {

        let name = component.type;

        let labelInput = (<input type="text" placeholder="label" defaultValue={component.label} onChange={e => component.label = e.target.value} />)
        let requiredInput = (<>
            <label>Required</label>
            <input type="checkBox" defaultValue={component.required} onChange={() => {
                component.required = !component.required
            }} />

        </>)


        let placeholderInput = (name === "Text Input" || name === "Text Area") ?
            (<input type="text" placeholder="Placeholder" defaultValue={component.placeholder} onChange={e => component.placeholder = e.target.value} />) : null;

        let rowsInput = (name === "Text Area") ?
            (<input type="number" placeholder="Rows" defaultValue={component.rows} onChange={e => component.rows = e.target.value} />) : null;

        let OptionsInput = null;

        if (name === "Checkbox" || name === "Select Dropdown" || name === "Radio Buttons") {
            // let index = 2;
            OptionsInput = (
                <div>
                    <label>Options: </label>
                    <FontAwesomeIcon className="padding-btn" onClick={() => handleOptionsArr(component.type_id - 1, true)} icon={faPlusCircle} />
                    <FontAwesomeIcon className="padding-btn" onClick={() => handleOptionsArr(component.type_id - 1, false)} icon={faMinusCircle} />
                    {component.optionsArr.map((item, idx) => (
                        <input type="text" placeholder={"Options " + (idx + 1)} defaultValue={item} onChange={e => component.optionsArr[idx] = e.target.value} />
                    ))}
                </div>)
        }

        if (name === "Checkbox") {
            // let index = 2;

            console.log(component)

            OptionsInput = (
                <>
                    <div onClick={() => handleSingleCheckBox(component.type_id-1, !component.single)}>
                        <label>Single Box</label>
                        <input type="checkBox" defaultChecked={component.single} />
                    </div>


                    {!component.single && (
                        <div>
                            <label>Options: </label>
                            <FontAwesomeIcon className="padding-btn" onClick={() => handleOptionsArr(component.type_id - 1, true)} icon={faPlusCircle} />
                            <FontAwesomeIcon className="padding-btn" onClick={() => handleOptionsArr(component.type_id - 1, false)} icon={faMinusCircle} />
                            {component.optionsArr.map((item, idx) => (
                                <input type="text" placeholder={"Options " + (idx + 1)} defaultValue={item} onChange={e => component.optionsArr[idx] = e.target.value} />
                            ))}
                        </div>
                    )}

                </>)
        }

        // let placeholder = (name === "Text Input" || name == "Text Area") ?
        //     (<input type="text" placeholder="Placeholder" defaultValue={component.placeholder} onChange={e => component.placeholder = e.target.value} />) : null;


        return (
            <div>
                {labelInput}
                {placeholderInput}
                {rowsInput}
                {OptionsInput}
                {requiredInput}
            </div>
        )
    }

    // Sidebar Item (Draggable)
    const SidebarItem = ({ component }) => {
        const [{ isDragging }, drag] = useDrag(() => ({
            type: ItemTypes.COMPONENT,
            item: component, // Pass the component details to the drop handler
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }));

        return (
            //       

            <div
                ref={drag}
                className={`sidebar-item ${isDragging ? "dragging" : ""}`}
                onClick={() => handleOnclick(component.type)}
            >
                {component.type}
                {component.type === detailInputsItem && handleDetail(component)}
            </div>
        );
    };




    return (
        <div className="sidebar">
            <h3>Components</h3>
            {sidebarComponents.map((component) => (
                <SidebarItem key={`${component.type_id}-${Date.now()}`} component={component} />
            ))}
        </div>
    );
};



export default Sidebar;
