import './App.css';
import React, { useState } from 'react';

function App() {

  const initialAvailableSchemas = [
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' }
  ];
  const [show, setShow] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [availableSchemas, setAvailableSchemas] = useState(initialAvailableSchemas);
  const [currentSchema, setCurrentSchema] = useState('');

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setSegmentName('');
    setSelectedSchemas([]);
    setAvailableSchemas(initialAvailableSchemas);
  }

  const handleAddSchema = (e) => {
    e.preventDefault();
    const selectedSchema = availableSchemas.find(schema => schema.label === currentSchema);
    if (selectedSchema && !selectedSchemas.some(schema => schema.value === selectedSchema.value)) {
      setSelectedSchemas([...selectedSchemas, selectedSchema]);
      setAvailableSchemas(availableSchemas.filter(schema => schema.value !== selectedSchema.value));
      setCurrentSchema('');
    }
  };

  const handleChangeSchema = (index, newValue) => {
    const newSelectedSchema = availableSchemas.find(schema => schema.value === newValue);
    const oldSelectedSchema = selectedSchemas[index];

    if (newSelectedSchema) {
      // Update selected schemas
      const updatedSchemas = [...selectedSchemas];
      updatedSchemas[index] = newSelectedSchema;

      // Update available schemas
      setAvailableSchemas(prevAvailableSchemas => {
        const withoutNewSelected = prevAvailableSchemas.filter(schema => schema.value !== newValue);
        return [...withoutNewSelected, oldSelectedSchema];
      });

      setSelectedSchemas(updatedSchemas);
    }
  };

  const handleRemoveSchema = (schemaToRemove) => {
    setSelectedSchemas(selectedSchemas.filter(schema => schema.value !== schemaToRemove.value));
    setAvailableSchemas([...availableSchemas, schemaToRemove]);
  };

  const handleSaveSegment = async () => {

    // const url = 'https://webhook.site/d1f68490-de4c-4db0-aa8d-022a19027cf7';
    const data = {
      segment_name: segmentName,
      schema: selectedSchemas.map(schema => ({
        [schema.value]: schema.label
      }))
    };
    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    const options = {
      method: "POST",
      headers,
      mode: "cors",
      body: JSON.stringify(data),
    }

    try {
      const pip = await fetch("https://eoin6ty3szga4f5.m.pipedream.net", options)
      if (pip.ok) {
        alert('Segment added successfully')
      }
      console.log(pip, 'pip');
    } catch (error) {
      console.log('Error:', error);
    }
    if (data.segment_name && data.schema.length !== 0) {
      handleClose();
      setSegmentName('');
      setSelectedSchemas([]);
      setAvailableSchemas(initialAvailableSchemas);
    }
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

      {show && (
        <div className="right">
          <div className="header">
            <p>Saving Segment</p>
            <div className="close-btn">
              <p onClick={handleClose}>x</p>
            </div>
          </div>
          <div className="pop-up">
            <div className="saving-segment">
              <form>
                <div className="name-segment">
                  <p>Enter the name of the Segment</p>
                  <input
                    type="text"
                    placeholder="Name of the segment"
                    value={segmentName}
                    onChange={(e) => setSegmentName(e.target.value)}
                  />
                  <p>To save your segment, you need to add the schemas to build the query</p>
                </div>
                <div className={`${selectedSchemas.length !== 0 ? "selected-schemas" : ''}`}>
                  {selectedSchemas.map((schema, index) => (
                    <div key={index}>
                      <select
                        value={schema.value}
                        onChange={(e) => handleChangeSchema(index, e.target.value)}
                      >
                        <option value={schema.value}>{schema.label}</option>
                        {availableSchemas.map(schemaOption => (
                          <option key={schemaOption.value} value={schemaOption.value}>
                            {schemaOption.label}
                          </option>
                        ))}
                      </select>
                      <button type="button" onClick={() => handleRemoveSchema(schema)}>
                        <hr />
                      </button>
                    </div>
                  ))}
                </div>
                <select
                  value={currentSchema}
                  onChange={(e) => setCurrentSchema(e.target.value)}
                >
                  <option value="">Add schema to segment</option>
                  {availableSchemas.map(schema => (
                    <option key={schema.value} value={schema.label}>
                      {schema.label}
                    </option>
                  ))}
                </select>
                <div className='add-schema-btn'>
                  <a href={''} onClick={handleAddSchema}>+ Add new schema</a>
                </div>
              </form>
              <div className='close-btns'>
                <button variant="primary" onClick={handleSaveSegment}>Save the segment</button>
                <button variant="secondary" onClick={handleClose}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
