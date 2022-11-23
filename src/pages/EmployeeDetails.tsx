import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CoworkersType, Employee } from "../types/entities";
import Coworkers from "../components/employee/Coworkers";
import { Descriptions, Radio, RadioChangeEvent, Space } from "antd";
import api from "../api/api";
import { openNotification } from "../components/helpers/notification";

const EmployeeDetails: React.FC = () => {
	const { id } = useParams();
	const [type, setType] = useState<CoworkersType>('company');
	const [employee, setEmployee] = useState<Employee>();

	useEffect(() => {
		api.get(`employees/${id}/`)
			.then(response => setEmployee(response.data))
			.catch(error => {
				if (error.response) {
					const errorData = error.response.data;
					openNotification('error', errorData.error, errorData.message);
				} else {
					openNotification('error', 'Ошибка', error.message);
				}
			});
	}, [id]);

	return <div>
		<Space direction="vertical" size="middle" style={{ display: 'flex' }}>
			<Descriptions title="Общая">
				<Descriptions.Item
					label="Имя и фамилия">{`${employee?.firstName} ${employee?.lastName}`}</Descriptions.Item>
				<Descriptions.Item label="Дата рождения">{employee?.birthdate.toString()}</Descriptions.Item>
				<Descriptions.Item label="Мобильный телефон">{employee?.mobilePhone}</Descriptions.Item>
				<Descriptions.Item label="Рабочий телефон">{employee?.workPhone}</Descriptions.Item>
				<Descriptions.Item label="Эл. почта">{employee?.email}</Descriptions.Item>
			</Descriptions>
			<p><b>Поиск коллег</b></p>
			<Radio.Group
				name="coworkerGroup"
				value={type}
				buttonStyle="solid"
				onChange={(e: RadioChangeEvent) => setType(e.target.value)}
			>
				<Radio.Button value="company">той же компании</Radio.Button>
				<Radio.Button value="job">с такой же должностью</Radio.Button>
				<Radio.Button value="address">с тем же адресом</Radio.Button>
			</Radio.Group>
			<Coworkers type={type} employeeId={Number(id)}/>
		</Space>
	</div>;
};

export default EmployeeDetails;