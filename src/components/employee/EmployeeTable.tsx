import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import api from "../../api/api";
import EmployeeCreateForm from "./EmployeeCreateForm";

interface Employee {
	id: number;
	firstName: string;
	lastName: string;
	birthdate: string;
	mobilePhone: string;
	workPhone: string;
	email: string;
}

const columns: ColumnsType<Employee> = [
	{
		title: 'id',
		dataIndex: 'id',
	},
	{
		title: 'Имя',
		dataIndex: 'firstName',
	},
	{
		title: 'Фамилия',
		dataIndex: 'lastName',
	},
	{
		title: 'Дата рождения',
		dataIndex: 'birthdate',
	},
	{
		title: 'Мобильный телефон',
		dataIndex: 'mobilePhone',
	},
	{
		title: 'Рабочий телефон',
		dataIndex: 'workPhone',
	},
	{
		title: 'Эл. почта',
		dataIndex: 'email',
	},
];

const EmployeeTable: React.FC = () => {
	const [dataSource, setDataSource] = useState<Employee[]>([]);
	const [loading, setLoading] = useState(false);
	const [openCreateForm, setOpenCreateForm] = useState(false);

	const fetchData = () => {
		setLoading(true);
		api.get('employees/')
			.then(response => {
				setDataSource(response.data._embedded.employees);
				setLoading(false);
			});
	};

	const onCreate = (values: any) => {
		console.log('Received values of form: ', values);
		api.post('employees/', values)
			.then(response => {
				console.log('Response from server on create:', response);
				const { id, firstName, lastName, birthdate, mobilePhone, workPhone, email } = response.data;
				setDataSource([...dataSource, {
					id,
					firstName,
					lastName,
					birthdate: moment(birthdate).format('YYYY-MM-DD'),
					mobilePhone,
					workPhone,
					email
				}]);
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
		<EmployeeCreateForm
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

export default EmployeeTable;