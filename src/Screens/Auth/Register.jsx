import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PageLoader from "../../Components/common/PageLoader/PageLoader";
import { webURL } from "../../constantx";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSignUp = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${webURL}auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        // Save token to local storage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user.id);

        // Show success toast
        toast.success("Sign-up successful!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Navigate to dashboard
        navigate("/user/dashboard");
      } else {
        toast.error(data.message || "Sign-up failed", {
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
      console.error("Sign-up error:", error);
      toast.error("Sign-up failed. Please try again.", {
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

  useEffect(() => {
    // Simulating initial loading state
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {loading ? (
        // Show loader while loading
        <div className="h-screen flex items-center justify-center">
          <PageLoader />
        </div>
      ) : (
        // Show sign-up form when not loading
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
          <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
            <h1 className="font-bold text-center text-2xl mb-5">Sign Up</h1>
            <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
              <div className="px-5 py-7">
                <Formik
                  initialValues={{
                    email: "",
                    username: "",
                    password: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={(values, { setSubmitting }) => {
                    handleSignUp(values);
                    setSubmitting(false);
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="mb-4">
                        <label className="font-semibold text-sm text-gray-600 pb-1 block">
                          Email
                        </label>
                        <Field
                          type="text"
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
                          Username
                        </label>
                        <Field
                          type="text"
                          name="username"
                          className="border rounded-lg px-3 py-2 mt-1 mb-1 text-sm w-full"
                        />
                        <ErrorMessage
                          name="username"
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
                        {isSubmitting ? "Signing up..." : "Sign Up"}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
              <div className="py-5 text-center">
                <button
                  className="transition duration-200 mx-5 px-5 py-2 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </button>
                <button
                  className="transition duration-200 mx-5 px-5 py-2 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset"
                  onClick={() => navigate("/login")}
                >
                  Already have an account? Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
