import React, { useEffect, useState } from "react";
import { Card, Table } from "antd";
import api from "../../api/api";
import { openNotification } from "../helpers/notification";

const { Meta } = Card;

const CoworkersReport: React.FC = () => {
		const [loading, setLoading] = useState(false);
		const [statistic, setStatistic] = useState([]);

		const fetchCoworkersCount = () => (
			api.get('reports/employee/statistic/')
				.then(response => setStatistic(response.data))
		);

		useEffect(() => {
			setLoading(true);
			fetchCoworkersCount()
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
				<Meta title="Общее количество коллег"/>
				<Table
					style={{ marginTop: 16 }}
					columns={[
						{
							title: 'Компания',
							dataIndex: 'company',
						},
						{
							title: 'Количество',
							dataIndex: 'count',
						}
					]}
					rowKey={(record: any) => record.company}
					dataSource={statistic}
					loading={loading}
				/>
			</Card>
		);
	}
;

export default CoworkersReport;