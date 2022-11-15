import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import NoMatch from "./pages/NoMatch";
import JobTable from "./components/job/JobTable";
import EmployeeTable from "./components/employee/EmployeeTable";

function App() {
	return (
		<Routes>
			<Route path="/" element={<MainLayout/>}>
				<Route index element={<Home/>} />
				<Route path="/refs/jobs" element={<JobTable/>}/>
				<Route path="/refs/employees" element={<EmployeeTable/>}/>
				{/*<Route path="/reports" element={<Reports/>}/>*/}
				<Route path="*" element={<NoMatch/>}/>
			</Route>
		</Routes>
	);
}

export default App;
