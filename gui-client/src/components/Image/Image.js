import { Button } from 'react-bootstrap';
import React, {useCallback, useState} from 'react';
import { useDropzone} from "react-dropzone";
import axios from 'axios';

export default function Image() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * File reader handler
   */
  const onDrop = useCallback(async (acceptedFiles) => {
    let file = acceptedFiles[0];
    console.log(file)
    setName(file.name);
    setImage(file);
  }, []);

  const readFile = (file) => {
    return (
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (
            event &&
            typeof event?.target?.result === 'string' &&
            event?.target?.result
          ) {
            resolve(event?.target?.result);
          }
        };
        reader.readAsArrayBuffer(file);
      })
    );
  };

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
  const submitImage = () => {
    setLoading(true);
    let bodyFormData = new FormData();
    bodyFormData.append('imageData', image);
    axios({
      method: "post",
      url: "http://20.86.185.155/image",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
  })
      .then(function (response) {
          //handle success

          console.log(response.data);
          setText(response.data['predicted-text']);
          setLoading(false);
         
      })
      .catch(function (error) {
          //handle error
          
          console.error("\x1b[31m",error?.response?.data);
          setText('No car plate was found !!');
          setLoading(false);
           
      });
  }

const clearImage = () => {
  setImage(null);
  setName('');
  setText('');
}

  return (
    <div>
       {image && <div className="detected-text-container">
       <div className="image-file-name">
          {name}
        </div>
        {loading ?
         <div  className="spinner-border" role="status">
         <span className="sr-only"></span>
       </div>
        : <p>{text}</p>
        }
      </div>}
      {!image && (
        <div className="drag-container" {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
      )}
      <div className="detect-footer">
      {image &&
      <div>
          <Button onClick={() => submitImage()} className="image-url-btn">
              Detect
            </Button>
            <Button onClick={() => clearImage()} className="image-url-btn">
              Retry
            </Button>
      </div>
       }
      </div>
    </div>
  );
}
