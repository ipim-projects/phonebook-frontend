import React from "react";
import CountReport from "../components/report/CountReport";
import MonthCountReport from "../components/report/MonthCountReport";

const Reports: React.FC = () => {
	return (
		<>
			<CountReport/>
			<MonthCountReport/>
		</>
	)
};

export default Reports;