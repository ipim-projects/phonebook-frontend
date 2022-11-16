import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic } from "antd";
import api from "../../api/api";
import { openNotification } from "../helpers/notification";

const { Meta } = Card;

const MonthCountReport: React.FC = () => {
		const [loading, setLoading] = useState(false);
		const [employeeCount, setEmployeeCount] = useState(0);

		const fetchEmployeeCount = () => {
			setLoading(true);
			api.get('reports/employee/count-month/')
				.then(response => setEmployeeCount(response.data))
				.catch(error => {
					if (error.response) {
						const errorData = error.response.data;
						openNotification('error', errorData.error, errorData.message);
					} else {
						openNotification('error', 'Ошибка', error.message);
					}
				})
				.finally(() => setLoading(false))
		};

		useEffect(() => {
			fetchEmployeeCount()
		}, []);

		return (
			<Card style={{ width: 600, marginTop: 16 }} loading={loading}>
				<Meta title="Количество записей, добавленных за последний месяц"/>
				<Row style={{ marginTop: 16 }} gutter={16}>
					<Col span={12}>
						<Statistic title="Сотрудники" value={employeeCount}/>
					</Col>
				</Row>
			</Card>
		);
	}
;

export default MonthCountReport;