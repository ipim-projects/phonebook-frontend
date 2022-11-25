import React from "react";
import CountReport from "../components/report/CountReport";
import MonthCountReport from "../components/report/MonthCountReport";
import CoworkersReport from "../components/report/CoworkersReport";

const Reports: React.FC = () => {
	return (
		<>
			<CountReport/>
			<MonthCountReport/>
			<CoworkersReport/>
		</>
	)
};

export default Reports;