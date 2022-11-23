import React from "react";
import EmployeeTable from "../components/employee/EmployeeTable";

const Home: React.FC = () => (
	<EmployeeTable isHome={true}/>
);

export default Home;