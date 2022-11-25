import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CoworkersType, Employee } from "../types/entities";
import Coworkers from "../components/employee/Coworkers";
import { Button, Descriptions, Divider, Radio, RadioChangeEvent, Space } from "antd";
import api from "../api/api";
import { openNotification } from "../components/helpers/notification";
import Title from "antd/es/typography/Title";
import EmployeeEditForm from "../components/employee/EmployeeEditForm";

const EmployeeDetails: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [type, setType] = useState<CoworkersType>('company');
	const [employee, setEmployee] = useState<Employee>();
	const [openEditForm, setOpenEditForm] = useState(false);

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

	const onDelete = () => {
		api.delete(`employees/${id}/`)
			.then(() => navigate("/refs/employees"))
			.catch(error => {
				if (error.response) {
					const errorData = error.response.data;
					openNotification('error', errorData.error, errorData.message);
				} else {
					openNotification('error', 'Ошибка', error.message);
				}
			});
	}

	const onEdit = () => {
		setOpenEditForm(true);
	}

	const onUpdate = (values: any) => {
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
		api.put(`employees/${id}/`, payload)
			.then(response => {
				console.log('Response from server on update:', response);
				setEmployee(response.data);
			})
			.catch(error => {
				if (error.response) {
					const errorData = error.response.data;
					openNotification('error', errorData.error, errorData.message);
				} else {
					openNotification('error', 'Ошибка', error.message);
				}
			});
		setOpenEditForm(false);
	};

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
			<Descriptions title="Место работы">
				<Descriptions.Item label="Компания">{employee?.job?.company}</Descriptions.Item>
				<Descriptions.Item label="Должность">{employee?.job?.jobTitle}</Descriptions.Item>
				<Descriptions.Item label="Адрес">{employee?.job?.address}</Descriptions.Item>
			</Descriptions>
			<Space>
				<Button type="primary" onClick={onEdit}>Редактировать</Button>
				<Button danger onClick={onDelete}>Удалить</Button>
			</Space>
			<EmployeeEditForm
				open={openEditForm}
				employee={employee}
				onUpdate={onUpdate}
				onCancel={() => {
					setOpenEditForm(false);
				}}
			/>
			<Divider/>
			<Title level={4}>Поиск коллег</Title>
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