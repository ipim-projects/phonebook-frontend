import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic } from "antd";
import api from "../../api/api";
import { openNotification } from "../helpers/notification";

const { Meta } = Card;

const CountReport: React.FC = () => {
		const [loading, setLoading] = useState(false);
		const [employeeCount, setEmployeeCount] = useState(0);
		const [jobCount, setJobCount] = useState(0);

		const fetchEmployeeCount = () => (
			api.get('reports/employee/count-all/')
				.then(response => setEmployeeCount(response.data))
		);

		const fetchJobCount = () => (
			api.get('reports/job/count-all/')
				.then(response => setJobCount(response.data))
		);

		useEffect(() => {
			setLoading(true);
			Promise.all([
				fetchEmployeeCount(),
				fetchJobCount(),
			])
				.catch(error => {
					if (error.response) {
						const errorData = error.response.data;
						openNotification('error', errorData.error, errorData.message);
					} else {
						openNotification('error', 'Ошибка', error.message);
					}
				})
				.finally(() => setLoading(false));
		}, []);

		return (
			<Card style={{ width: 600, marginTop: 16 }} loading={loading}>
				<Meta title="Общее количество записей в справочниках"/>
				<Row style={{ marginTop: 16 }} gutter={16}>
					<Col span={12}>
						<Statistic title="Сотрудники" value={employeeCount}/>
					</Col>
					<Col span={12}>
						<Statistic title="Места работы" value={jobCount}/>
					</Col>
				</Row>
			</Card>
		);
	}
;

export default CountReport;