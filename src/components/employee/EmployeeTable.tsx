import React, { useEffect, useState } from "react";
import { Button, Input, Space, Table } from "antd";
import type { ColumnsType } from 'antd/es/table';
import api from "../../api/api";
import EmployeeCreateForm from "./EmployeeCreateForm";
import { openNotification } from "../helpers/notification";
import { Link } from "react-router-dom";
import { Employee } from "../../types/entities";

const { Search } = Input;

const columns: ColumnsType<Employee> = [
	{
		title: 'id',
		dataIndex: 'id',
		render: id => <Link to={`/refs/employees/${id}`}>{id}</Link>,
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
			},
			{
				title: 'Адрес',
				dataIndex: ['job', 'address'],
			}
		]
	},
];

interface EmployeeTableProps {
	isHome?: boolean;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ isHome = false }) => {
	const [dataSource, setDataSource] = useState<Employee[]>([]);
	const [loading, setLoading] = useState(false);
	const [openCreateForm, setOpenCreateForm] = useState(false);
	const [searchValue, setSearchValue] = useState('');

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
			jobId
		} = values;
		const payload: any = {
			firstName,
			lastName,
			birthdate: birthdate.format('YYYY-MM-DD'),
			mobilePhone: `${mobilePhoneCode}-${mobilePhoneNumber}`,
			workPhone,
			email,
			jobId
		};
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

	const handleFilter = (value: string) => {
		setSearchValue(value.trim());
	}

	const filteredData = searchValue === ''
		? dataSource
		: dataSource.filter((value) =>
			value.firstName.toLowerCase().includes(searchValue.toLowerCase())
			|| value.lastName.toLowerCase().includes(searchValue.toLowerCase())
			|| value.mobilePhone.toLowerCase().includes(searchValue.toLowerCase())
		);

	return <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
		{isHome
			? <Search
				placeholder="Поиск по имени, фамилии или номеру мобильного телефона"
				onSearch={(e) => handleFilter(e)}
				allowClear
				style={{ width: 600 }}
			/>
			: <Button
				onClick={() => {
					setOpenCreateForm(true);
				}}
				type="primary"
				style={{ marginBottom: 16 }}>
				Добавить
			</Button>
		}
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
			dataSource={filteredData}
			loading={loading}
		/>
	</Space>;
}

export default EmployeeTable;