import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Auth.module.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().required('Password is required'),
  });

  const handleLogin = async (values) => {
    try {
      const response = await axios.post('https://form-handler-ai.twilightparadox.com/login', values);
      if (response.status === 200) {
        toast.success('Login successful!');
        navigate('/bot');
      }
    } catch (error) {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className={styles['page-container']}>
      <h1>Welcome, please login.</h1>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {() => (
          <Form className={styles['form-container']}>
            <div>
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className={styles['form-input']}
              />
              <ErrorMessage name="email" component="div" className={styles.error} />
            </div>
            <div className={styles['password-container']}>
              <Field
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                className={styles['form-input']}
              />
              <img
                src={showPassword ? "/assets/eye-off.svg" : "/assets/eye.svg"}
                alt="Toggle Password"
                className={styles['password-toggle']}
                onClick={() => setShowPassword(!showPassword)}
              />
              <ErrorMessage name="password" component="div" className={styles.error} />
            </div>
            <button type="submit" className={styles['option-button']}>Login</button>
          </Form>
        )}
      </Formik>
      <ToastContainer />
    </div>
  );
};

export default Login;
