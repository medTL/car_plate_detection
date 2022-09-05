import React, { useState } from 'react'
import {Container, Form, Button} from 'react-bootstrap'
import axios from "axios"
export default function Url() {
    const [url, setUrl] = useState("");
    const [text, setText] = useState("");


    const submitUrl = () =>{
        if(url !== '')
        {
            axios({
                method: "post",
                url: "http://20.160.22.137/url",
                data: { "url": url },
                withCredentials: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                  },
            })
                .then(function (response) {
                    //handle success
                    console.log(response.data);
                    setText(response.data)
                })
                .catch(function (error) {
                    //handle error
                    console.error("\x1b[31m",error.response?.data);
                });
        }
    }
  return (
    <Container>
            <div className="detected-text-container">
                <p>{text}</p>
            </div>
        <div>
            <Form>
            <Form.Group>
                <Form.Label>Enter image url</Form.Label>
                <Form.Control
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                 type="text"/>
            </Form.Group>
            <div>
                <Button onClick={() => submitUrl()} className="image-url-btn">
                    Detect
                </Button>
            </div>
            </Form>
        </div>
    </Container>
  )
}
