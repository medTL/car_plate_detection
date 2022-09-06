import React, {useState} from 'react';
import {Container, Form, Button} from 'react-bootstrap';
import axios from 'axios';
export default function Url() {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
const [loading, setLoading] = useState(false);
  const submitUrl = () => {
    if (url !== '') {
        setLoading(true);
      axios({
        method: 'post',
        url: 'http://20.86.185.155/url',
        data: {url: url},
        withCredentials: false,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      })
        .then(function (response) {
          //handle success
          console.log(response.data);
        
          setText(response.data['predicted-text']);
          setLoading(false);
        })
        .catch(function (error) {
          //handle error
          console.error('\x1b[31m', error.response?.data);
          setText('No car plate was found !!');
          setLoading(false);
        });
    }
  };
  return (
    <Container>
      <div className="detected-text-container">
        {loading ?
         <div  class="spinner-border" role="status">
         <span class="sr-only"></span>
       </div>
        : <p>{text}</p>
        }
       
      </div>
      <div>
        <Form>
          <Form.Group>
            <Form.Label>Enter image url</Form.Label>
            <Form.Control
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="text"
            />
          </Form.Group>
          <div className="detect-footer">
            <Button onClick={() => submitUrl()} className="image-url-btn">
              Detect
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}
