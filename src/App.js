import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';



function App() {
  const [show, setShow] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [availableSchemas, setAvailableSchemas] = useState([
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' }
  ]);
  const [currentSchema, setCurrentSchema] = useState('');

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);


  const handleAddSchema = (e) => {
    e.preventDefault();
    const selectedSchema = availableSchemas.find(schema => schema.label === currentSchema);
    if (selectedSchema && !selectedSchemas.includes(selectedSchema.value)) {
      setSelectedSchemas(prevSelectedSchemas => {
        const updatedSchemas = [...prevSelectedSchemas, selectedSchema.label];
        setAvailableSchemas(prevAvailableSchemas => prevAvailableSchemas.filter(schema => schema.value !== selectedSchema.value));
        return updatedSchemas;
      });
      setCurrentSchema('');
    }
  };

  const handleChangeSchema = (index, newValue) => {
    const selectedSchema = availableSchemas.find(schema => schema.value === newValue);
    const addSchema = selectedSchemas.find(schema => schema === newValue)
    console.log(addSchema, 'addschema', newValue);
    if (addSchema) {
      setSelectedSchemas([...availableSchemas, { label: addSchema, value: newValue }])
    }
    if (selectedSchema) {
      setSelectedSchemas(prevSelectedSchemas => {
        const updatedSchemas = [...prevSelectedSchemas];
        updatedSchemas[index] = selectedSchema.label;
        return updatedSchemas;
      });

    }
  };


  const handleRemoveSchema = (schemaToRemove) => {

    // Find the schema to be removed
    const removedSchema = selectedSchemas.find(schema => schema === schemaToRemove);

    // Update selectedSchemas by removing the specified schema
    setSelectedSchemas(selectedSchemas.filter(schema => schema !== schemaToRemove));

    // Update availableSchemas by adding the removed schema back
    if (removedSchema) {
      setAvailableSchemas([...availableSchemas, { label: removedSchema, value: schemaToRemove }]);
    }
  };


  console.log(selectedSchemas, 'selectedschemas');
  console.log(availableSchemas, 'availableschema');

  const handleSaveSegment = async () => {
    const url = 'https://webhook.site/d1f68490-de4c-4db0-aa8d-022a19027cf7'; // Ensure this is your actual webhook URL
    const data = {
      segment_name: segmentName,
      schema: selectedSchemas.map(value => ({
        [value]: availableSchemas.find(schema => schema.value === value)?.label || value
      }))
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Success:', responseData);

      // Clear selected schemas and close dialog
      setSelectedSchemas([]);
      handleClose();
    } catch (error) {
      console.error('Error:', error);
    }
    setSelectedSchemas([])
    handleClose();
  };

  return (
    <div className="App">
      <div className={`${show ? 'left-hide' : 'left'}`}>
        <div className={`${show ? 'header-hide' : 'header'}`}>
          <p>View Audience</p>
        </div>
        <div className={`${show ? 'modal-bg' : 'modal'}`}>
          <div className={`${show ? 'popup_show' : 'content'}`}>
            <button variant="primary" onClick={handleShow}>Save segment</button>
          </div>
        </div>
      </div>

      {
        show &&
        <div className='right'>
          <div className="header" >
            <p>
              Saving Segment
            </p>
            <div className="close-btn">
              <p onClick={handleClose}>x</p>
            </div>
          </div>
          <div className='pop-up'>
            <div className='saving-segment'>
              <form>
                <div className='name-segment'>
                  <p>Enter the name of the Segment</p>
                  <input type="text" placeholder='Name of the segment'
                    value={segmentName} onChange={(e) => setSegmentName(e.target.value)} />
                  <p>To save your segment,you need to add the schemas to build the query</p>
                </div>
                <div className="selected-schemas">
                  {selectedSchemas && selectedSchemas.map((schema, index) => (
                    <div key={index}>
                      <select value={currentSchema} onChange={(e) => handleChangeSchema(index, e.target.value)}>
                        <option key={schema}>{schema}</option>
                        {availableSchemas.filter(schemas => !selectedSchemas.includes(schemas.label)).map(schemaOption => (
                          <option key={schemaOption.value} value={schemaOption.value}>{schemaOption.label}</option>))}
                      </select>
                      <button type='button' onClick={() => handleRemoveSchema(schema)}><hr /></button>
                    </div>
                  ))}
                </div>
                <select value={currentSchema} onChange={(e) => setCurrentSchema(e.target.value)}>
                  <option>Add schema to segment</option>
                  {availableSchemas.map(schema => (
                    <option key={schema.value} value={schema.label}>{schema.label}</option>
                  ))}
                </select>
                <button onClick={handleAddSchema}>+ Add new schema</button>
              </form>
              <div>
                <button variant="primary" onClick={handleSaveSegment}>Save the segment</button>
                <button variant="secondary" onClick={handleClose}>Close</button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  );
};

export default App;
