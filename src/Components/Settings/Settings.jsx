import React, { useState, useEffect } from "react";
import { FaCogs, FaPen } from "react-icons/fa";
import PageLoader from "../common/PageLoader/PageLoader";
import { webURL } from "../../constantx.jsx";

const Settings = () => {
  const [settings, setSettings] = useState({
    model_name: "Gpt-turbo-3.5",
    gpt_key: "Enter Your Open AI Key",
    crm_key: "Enter Your CRM Key",
  });
  const loadings = false;


  const [loading, setLoading] = useState(true);
  const fetchSettings = async () => {
    try {
      const user_id = localStorage.getItem('user_id');
      const response = await fetch(`${webURL}setting/get-setting-value/${user_id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        setSettings((prevSettings) => ({
          ...prevSettings,
          gpt_key: data.gpt_key || prevSettings.gpt_key,
          crm_key: data.crm_key || prevSettings.crm_key,
          model_name: data.model_name || prevSettings.model_name,
        }));
      }
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the settings!", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("e.target in handleChange(): ", e)
    console.log("e.target in handleChange() with e.target: ", e.target)
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user_id = localStorage.getItem('user_id');
      const settings_update = { ...settings, user_id };

      const response = await fetch(webURL + "setting/update-values", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'token': localStorage.getItem('token'),
        },
        body: JSON.stringify(settings_update),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("There was an error updating the settings!", error);
    }
  };
  return (
    <div className="bg-gray-100 max-w-4xl mx-auto p-8 m-16  rounded-lg border shadow-lg">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800 flex items-center">
        <FaCogs className="mr-2 text-primary" /> ChatBot Setting
      </h2>
      {loading ? (
        <PageLoader /> 
      ) : (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          <div className="form-group">
            <label htmlFor="model_name" className="block text-gray-700">
              Model
            </label>
            <div className="relative mt-2">
  <select
    id="model_name"
    name="model_name"
    value={settings.model_name}
    onChange={handleChange}
    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary pl-10 pr-12 bg-white text-gray-800"
  >
    <option value="" disabled>Select a model</option>
    <option value="gpt-4-turbo">gpt-4-turbo</option>
    <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
  </select>
  <FaPen className="absolute top-3 left-3 text-gray-400" />
</div>

          </div>
          <div className="form-group sm:col-span-2">
            <label htmlFor="gpt_key" className="block text-gray-700">
              OpenAI Key
            </label>
            <div className="relative mt-2">
              <input
                id="gpt_key"
                name="gpt_key"
                value={settings.gpt_key}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary pl-10"
              ></input>
              <FaPen className="absolute top-3 left-3 text-gray-400" />
            </div>
          </div>
          <div className="form-group sm:col-span-2">
            <label htmlFor="crm_key" className="block text-gray-700">
              CRM Key
            </label>
            <div className="relative mt-2">
              <input
                id="crm_key"
                name="crm_key"
                value={settings.crm_key}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary pl-10"
              ></input>
              <FaPen className="absolute top-3 left-3 text-gray-400" />
            </div>
          </div>
          <div className="sm:col-span-2 text-right">
            <button
              type="submit"
              className=" bg-[rgba(0,150,136,255)] hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <span className="text-base font-medium">Save</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Settings;
