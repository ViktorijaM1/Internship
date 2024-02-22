import Form from '@rjsf/core';
import React from 'react';
import validator from '@rjsf/validator-ajv8';
import Swal from 'sweetalert2';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState, useRef } from 'react';

const formStyles = {
  position: 'fixed',
  top: '200px',
  left:'250px',
  width: '50%',
  padding: '20px',
};
const button = {
  position: 'relative',
  margin: '40px auto',
  left: '600px'
}
const picture = {
  position: 'relative',
  width:'500px',
  top: '30px',
  left:'1400px'
  
}

export default function FormComponent({ selectedRow }) { 
  let schema = {
    type: 'object',
    properties: {
      status: { type: 'string', title: 'Статус' },
      idbr: { type: 'string', title: 'ИДБР' },
      tax_no: { type: 'string', title: 'Даночен број' },
      full_name: { type: 'string', title: 'Целосно име' },
      surname: { type: 'string', title: 'Презиме' },
      fname: { type: 'string', title: 'Име' },
      gender: { type: 'string', title: 'Пол' },
      dt_birth: { type: 'string', title: 'Датум на раѓање' },
      farm_address: { type: 'string', title: 'Адреса' },
      farm_munic: { type: 'string', title: 'Општина' },
      phone: { type: 'string', title: 'Телефон' },
      mail: { type: 'string', title: ' е-пошта' }
    }
  };

  if (selectedRow.row.status === 'VALID') {
    schema = {
      ...schema,
      properties: {
        ...schema.properties,
        ...Object.fromEntries(Object.entries(schema.properties).map(([key, value]) => [key, { ...value, default: selectedRow.row[key] }]))
      }
    };
  }

  if (selectedRow.row.status === 'CLOSED') {
    schema = {
      ...schema,
      properties: {
        ...schema.properties,
        ...Object.fromEntries(Object.entries(schema.properties).map(([key, value]) => [key, { ...value, default: selectedRow.row[key] }]))
      }
    };
  }

  const handleSubmit = () => {

    Swal.fire({
      title: 'Form Submitted!',
      text: 'Your form has been submitted successfully.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  };

  const uiSchema = {
    'ui:column': 'right'
  };


  if (selectedRow.row.status === 'VALID') {
    const [imagePreview, setImagePreview] = useState(null);
    const [imageSize, setImageSize] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState(null);
    const [close, setClose] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fullName, setFullName] = useState('')
    const fileInputRef = useRef(null)

    const handleClose = () => {
      setClose(true);
      setImagePreview(false);
      setImageSize(false);
      setSelectedFileName(false);
      setFullName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const handleSelectedFile = (e) => {
      const file = e.target.files[0];
      setSelectedFile(file);

      if (!file.type.startsWith('image/')) {
        Swal.fire({
          title: 'Invalid File Type!',
          text: 'Please select an image file.',
          icon: 'error',
          confirmButtonText: 'OK'
        })

        if (fileInputRef.current) {
          fileInputRef.current.value = ''; 
        }
        return;
      }
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setImageSize(file.size / 1024);
      };
      reader.readAsDataURL(file);
      setFullName(`${selectedRow.row.fname} ${selectedRow.row.surname}`);
    }
    return (
      <>
        <div style={picture}>
          <label>Choose a picture:</label> <br></br>
          <input type="file" ref={fileInputRef} id="picture" name="picture" onChange={(e) => handleSelectedFile(e)} />
          <br></br>
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#example">
            Submit
          </button>
          <div class="modal" id="example" >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Image Preview</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
                </div>
                <div class="modal-body">
                  {imagePreview && <img src={imagePreview} alt="Preview" />}
                  {fullName && <p>{fullName} </p>}
                  {selectedFileName && <p>{selectedFileName}</p>}
                  {imageSize && <p>Image size : {imageSize.toFixed(2)} MB</p>}

                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={formStyles}>
          <Form
            schema={schema}
            uiSchema={uiSchema}
            disabled={true}
            validator={validator}
          >
            <></>
            <input type='button' onClick={handleSubmit} value='Submit' style={button} className=' btn btn-primary btn-lg'></input></Form>
        </div>
      </>
    );
  }

  if (selectedRow.row.status === 'CLOSED') {
    return (
      <>
        <div style={formStyles}>
          <Form
            schema={schema}
            uiSchema={uiSchema}
            disabled={true}
            validator={validator}
          ><></></Form>
        </div></>
    );
  }

}