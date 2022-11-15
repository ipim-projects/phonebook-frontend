import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import type { ColumnsType } from 'antd/es/table';
import api from "../../api/api";
import JobCreateForm from "./JobCreateForm";
import { openNotification } from "../helpers/notification";

interface Job {
	id: number;
	company: string;
	jobTitle: string;
	address: string;
}

const columns: ColumnsType<Job> = [
	{
		title: 'id',
		dataIndex: 'id',
	},
	{
		title: 'Организация',
		dataIndex: 'company',
	},
	{
		title: 'Должность',
		dataIndex: 'jobTitle',
	},
	{
		title: 'Адрес',
		dataIndex: 'address',
	},
];

const JobTable: React.FC = () => {
	const [dataSource, setDataSource] = useState<Job[]>([]);
	const [loading, setLoading] = useState(false);
	const [openCreateForm, setOpenCreateForm] = useState(false);

	const fetchData = () => {
		setLoading(true);
		api.get('jobs/')
			.then(response => setDataSource(response.data))
			.catch(error => {
				if (error.response) {
					const errorData = error.response.data;
					openNotification('error', errorData.error, errorData.message);
				} else {
					openNotification('error', 'Ошибка', error.message);
				}
			})
			.finally(() => setLoading(false));
	};

	const onCreate = (values: any) => {
		console.log('Received values of form: ', values);
		api.post('jobs/', values)
			.then(response => {
				console.log('Response from server on create:', response);
				const { id, company, jobTitle, address } = response.data;
				setDataSource([...dataSource, { id, company, jobTitle, address }]);
			})
			.catch(error => {
				if (error.response) {
					const errorData = error.response.data;
					openNotification('error', errorData.error, errorData.message);
				} else {
					openNotification('error', 'Ошибка', error.message);
				}
			});
		setOpenCreateForm(false);
	};

	useEffect(() => {
		fetchData();
	}, []);

	return <div>
		<Button
			onClick={() => {
				setOpenCreateForm(true);
			}}
			type="primary"
			style={{ marginBottom: 16 }}>
			Добавить
		</Button>
		<JobCreateForm
			open={openCreateForm}
			onCreate={onCreate}
			onCancel={() => {
				setOpenCreateForm(false);
			}}
		/>
		<Table
			columns={columns}
			rowKey={record => record.id}
			dataSource={dataSource}
			loading={loading}
		/>
	</div>;
}

export default JobTable;