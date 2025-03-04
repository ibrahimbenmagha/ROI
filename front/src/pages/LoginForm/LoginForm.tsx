import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom'; 
import axiosInstance from "../../axiosConfig"

export default function LoginForm() {
  const navigate = useNavigate(); // Hook for navigation
  const [loading, setLoading] = useState(false);

  // const onFinish = async (values: { email: string, password: string }) => {
  //   setLoading(true);
  //   try {
  //       const response = await axiosInstance.post('/login', {
  //           email: values.email,
  //           password: values.password,
  //       });
  //       // Assume the API returns a token in response.data.token
  //       if (response.data.token) {
  //           message.success('Connexion réussie !');
  //           navigate('/home');  // Redirect to '/home' page
  //       } else {
  //           message.error('Veuillez vérifier vos informations');
  //       }
  //   } catch (error) {
  //       message.error('Une erreur s\'est produite');
  //   }
  //   setLoading(false);
  // }
  // Inline styles
  
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/login", values);
      const {
        access_token
      } = response.data;

      message.success("Logged in successfully");
      navigate("/Home");
    } catch (error) {
      message.error("Invalid credentials");
    }
    setLoading(false);
  };

  const styles = {
    body: {
      margin: 0,
      padding: 0,
      fontFamily: "'Roboto', sans-serif",
      background: 'linear-gradient(135deg, #6e7cfc, #ffb4a2)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      overflow: 'hidden',
    },
    loginForm: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      padding: '30px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px',
    },
    h1: {
      fontSize: '2.5em',
      fontWeight: 600,
      color: '#333',
      textAlign: 'center',
      marginBottom: '20px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%',
    },
    input: {
      padding: '12px 15px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      marginBottom: '15px',
      fontSize: '1em',
      transition: 'all 0.3s ease',
    },
    inputFocus: {
      outline: 'none',
      borderColor: '#6e7cfc',
      boxShadow: '0 0 5px rgba(110, 124, 252, 0.5)',
    },
    button: {
      backgroundColor: '#6e7cfc',
      color: 'white',
      border: 'none',
      padding: '12px',
      borderRadius: '5px',
      fontSize: '1em',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#5a6afc',
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.loginForm}>
        <h1 style={styles.h1}>Login Form</h1>
        <Form name="login" onFinish={onFinish} style={styles.form}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              placeholder="Email"
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Password"
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={styles.button}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
              onMouseLeave={(e) => Object.assign(e.target.style, styles.button)}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
