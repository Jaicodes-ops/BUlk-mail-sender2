import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import * as XLSX from "xlsx";
function App() {
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(false);
  const [emaillist, setEmaillist] = useState([]);
  function handleevent(event) {
    setMsg(event.target.value);
  }
  function handlefile(event) {
    const fileinput = event.target.files[0];

    const reader = new FileReader();
    reader.onload = function (event) {
      const data = event.target.result;

      const workbook = XLSX.read(data, { type: "binary" });

      const sheetname = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetname];
      const emaillist = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      console.log(emaillist);
      const totalemail = emaillist.map((item) => item.A);
      console.log(totalemail);
      setEmaillist(totalemail);
    };

    reader.readAsBinaryString(fileinput);
  }
  function send() {
    setStatus(true);
    axios.post("http://localhost:5000/sendmail", { msg: msg,emaillist:emaillist }).then((res) => {
      if (res.data === true) {
        alert("email sent successfully");
        setStatus(false);
      } else {
        alert("email not sent");
      }
    });
  }
  return (
    <>
      <div className="bg-blue-950 text-white text-center">
        <h1 className="text-2xl font-medium px-5 py-3">Bulk Mail</h1>
      </div>
      <div className="bg-blue-800 text-white text-center">
        <h1 className=" font-medium px-5 py-3">
         Effortless Bulk Emails Sending
        </h1>
      </div>
      <div className="bg-blue-600 text-white text-center">
        <h1 className="font-medium px-5 py-3">Drag and Drop</h1>
      </div>

      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-3">
        <textarea
          onChange={handleevent}
          value={msg}
          type="text"
          className="w-[80%] h-32 py-2 outline-none px-2 border border-black rounder-md placeholder:enter your email text bg-white"
        ></textarea>

        <input
          type="file"
          onChange={handlefile}
          className="border-4 border-dashed py-4 px-4 mb-5 mt-5"
        ></input>
        <p className="text-2xl">{emaillist.length}</p>
        <button
          onClick={send}
          className="mt-3 bg-blue-950 py-2 px-2 text-white font-medium rounded-md w-fit"
        >
          {status ? "sending..." : "send"}
        </button>
        <div></div>
      </div>
      <div className="p-8 bg-blue-300 text-white text-center"></div>
      <div className="p-8 bg-blue-200 text-white text-center"></div>
    </>
  );
}

export default App;
