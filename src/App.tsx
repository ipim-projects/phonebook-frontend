import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import Tables from "./pages/Tables";
import NoMatch from "./pages/NoMatch";
import JobTable from "./components/job/JobTable";
import EmployeeTable from "./components/employee/EmployeeTable";

function App() {
	return (
		<Routes>
			<Route path="/" element={<MainLayout/>}>
				<Route index element={<Home/>} />
				<Route path="/jobs" element={<JobTable/>}/>
				<Route path="/employees" element={<EmployeeTable/>}/>
				<Route path="/tables" element={<Tables/>}/>
				<Route path="*" element={<NoMatch/>}/>
			</Route>
		</Routes>
	);
}

export default App;
