import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import api from "../../api/api";
import EmployeeCreateForm from "./EmployeeCreateForm";
import { openNotification } from "../helpers/notification";

interface Employee {
	id: number;
	firstName: string;
	lastName: string;
	birthdate: moment.Moment;
	mobilePhone: string;
	workPhone: string;
	email: string;
	job: object;
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
	{
		title: 'Место работы',
		children: [
			{
				title: 'Компания',
				dataIndex: ['job', 'company'],
			},
			{
				title: 'Должность',
				dataIndex: ['job', 'jobTitle'],
			}
		]
	},
];

const EmployeeTable: React.FC = () => {
	const [dataSource, setDataSource] = useState<Employee[]>([]);
	const [loading, setLoading] = useState(false);
	const [openCreateForm, setOpenCreateForm] = useState(false);

	const fetchData = () => {
		setLoading(true);
		api.get('employees/')
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
		const {
			firstName,
			lastName,
			birthdate,
			mobilePhoneNumber,
			mobilePhoneCode,
			workPhone,
			email,
			job
		} = values;
		const payload: any = {
			firstName,
			lastName,
			birthdate: birthdate.format('YYYY-MM-DD'),
			mobilePhone: `${mobilePhoneCode}-${mobilePhoneNumber}`,
			workPhone,
			email
		};
		if (job) {
			payload.job = { id: job };
		}
		api.post('employees/', payload)
			.then(response => {
				console.log('Response from server on create:', response);
				const { id, firstName, lastName, birthdate, mobilePhone, workPhone, email, job } = response.data;
				setDataSource([...dataSource, {
					id,
					firstName,
					lastName,
					birthdate,
					mobilePhone,
					workPhone,
					email,
					job
				}]);
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