import { DatePicker, Form, Input, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from "moment";
import api from "../../api/api";
import { openNotification } from "../helpers/notification";

interface EmployeeValues {
	firstName: string;
	lastName: string;
	birthdate: moment.Moment;
	mobilePhone: string;
	workPhone: string;
	email: string;
}

interface Job {
	id: number;
	company: string;
	jobTitle: string;
	address: string;
}

interface EmployeeCreateFormProps {
	open: boolean;
	onCreate: (values: EmployeeValues) => void;
	onCancel: () => void;
}

const EmployeeCreateForm: React.FC<EmployeeCreateFormProps> = ({
																   open,
																   onCreate,
																   onCancel,
															   }) => {
	const [jobs, setJobs] = useState<Job[]>([]);
	const [form] = Form.useForm();

	useEffect(() => {
		api.get('jobs/')
			.then(response => setJobs(response.data))
			.catch(error => {
				if (error.response) {
					const errorData = error.response.data;
					openNotification('error', errorData.error, errorData.message);
				} else {
					openNotification('error', 'Ошибка', error.message);
				}
			})
	}, []);

	return (
		<Modal
			open={open}
			title="Новый сотрудник"
			okText="Добавить"
			cancelText="Отмена"
			onCancel={onCancel}
			onOk={() => {
				form
					.validateFields()
					.then(values => {
						form.resetFields();
						onCreate(values);
					})
					.catch(info => {
						console.log('Validate Failed:', info);
					});
			}}
		>
			<Form
				form={form}
				layout="vertical"
				name="form_in_modal"
				// initialValues={{ modifier: 'public' }}
			>
				<Form.Item
					name="lastName"
					label="Фамилия"
					rules={[{ required: true, message: 'Необходимо ввести фамилию сотрудника' }]}
				>
					<Input/>
				</Form.Item>
				<Form.Item
					name="firstName"
					label="Имя"
					rules={[{ required: true, message: 'Необходимо ввести имя сотрудника' }]}
				>
					<Input/>
				</Form.Item>
				<Form.Item
					name="birthdate"
					label="Дата рождения"
					rules={[{ required: true, message: 'Необходимо ввести дату рождения' }]}
				>
					<DatePicker placeholder="Выберете дату"/>
				</Form.Item>
				<Form.Item
					name="mobilePhone"
					label="Мобильный телефон"
					rules={[{ required: true, message: 'Необходимо ввести мобильный телефон' }]}
				>
					<Input/>
				</Form.Item>
				<Form.Item name="workPhone" label="Рабочий телефон">
					<Input/>
				</Form.Item>
				<Form.Item name="email" label="Эл. почта">
					<Input/>
				</Form.Item>
				<Form.Item name="job" label="Место работы">
					<Select
						showSearch
						placeholder="Выберете место работы"
						optionFilterProp="children"
						filterOption={(input, option) =>
							(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
						}
						options={
							jobs.map(job => ({
								value: job.id,
								label: `${job.company}, ${job.jobTitle}`
							}))
						}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default EmployeeCreateForm;