import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { webURL } from "../../constantx.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PageLoader from "../../Components/common/PageLoader/PageLoader";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/user/dashboard/989');
    }
  }, [navigate]);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .min(2, "Too Short!")
      .max(70, "Too Long!")
      .required("Required"),
    password: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .required("Password is required"),
  });

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${webURL}auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_id', data.user.id);
        navigate("/user/dashboard");
      } else {
        toast.error(data.message || 'Login failed', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
          <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
            <h1 className="font-bold text-center text-2xl mb-5">Login</h1>
            <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
              <div className="px-5 py-7">
                <Formik
                  initialValues={{
                    email: "",
                    password: "",
                  }}
                  validationSchema={LoginSchema}
                  onSubmit={(values) => {
                    handleLogin(values);
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="mb-4">
                        <label className="font-semibold text-sm text-gray-600 pb-1 block">
                          E-mail
                        </label>
                        <Field
                          type="email"
                          name="email"
                          className="border rounded-lg px-3 py-2 mt-1 mb-1 text-sm w-full"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="font-semibold text-sm text-gray-600 pb-1 block">
                          Password
                        </label>
                        <Field
                          type="password"
                          name="password"
                          className="border rounded-lg px-3 py-2 mt-1 mb-1 text-sm w-full"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <button
                        type="submit"
                        className="transition duration-200 bg-primary-light hover:bg-primary-dark text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                        disabled={isSubmitting}
                      >
                        Login
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
              <div className="py-5">
                <div className="text-center">
                  <span className="text-gray-600 text-sm">Don't have an account?</span>
                  <button
                    type="button"
                    className="transition duration-200 text-primary-light hover:text-primary-dark font-semibold text-sm mx-2"
                    onClick={() => navigate("/register")}
                  >
                    Register Here
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
