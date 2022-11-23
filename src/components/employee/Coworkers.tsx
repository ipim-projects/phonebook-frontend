import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import { CoworkersType, Employee } from "../../types/entities";
import api from "../../api/api";
import { openNotification } from "../helpers/notification";

interface CoworkersProps {
	type: CoworkersType;
	employeeId: number;
}

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
	}
]

const Coworkers: React.FC<CoworkersProps> = ({
												 type,
												 employeeId
											 }) => {
	const [dataSource, setDataSource] = useState<Employee[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		api.get(`employees/${employeeId}/coworkers-${type}`)
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
	}, [type, employeeId]);

	return <Table
		columns={columns}
		rowKey={record => record.id}
		dataSource={dataSource}
		loading={loading}
	/>;
};

export default Coworkers;