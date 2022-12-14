import { DatePicker, Form, Input, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import api from "../../api/api";
import { openNotification } from "../helpers/notification";
import { MaskedInput } from "antd-mask-input";
import { Employee, EmployeeFormValues, Job } from "../../types/entities";
import moment from "moment";

interface EmployeeEditFormProps {
	open: boolean;
	employee: Employee | undefined;
	onUpdate: (values: EmployeeFormValues) => void;
	onCancel: () => void;
}

const EmployeeEditForm: React.FC<EmployeeEditFormProps> = ({
															   open,
															   employee,
															   onUpdate,
															   onCancel,
														   }) => {
	const [jobs, setJobs] = useState<Job[]>([]);
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue({
			...employee,
			birthdate: moment(employee?.birthdate),
			mobilePhoneCode: employee?.mobilePhone.slice(0, 3) ?? "495",
			mobilePhoneNumber: employee?.mobilePhone.slice(4),
			jobId: employee?.job?.id
		});
	}, [form, employee]);

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

	const selectBefore = (
		<Select style={{ width: '65px' }}
				options={[
					{ value: '495', label: '495' },
					{ value: '345', label: '345' },
					{ value: '789', label: '789' },
					{ value: '123', label: '123' },
					{ value: '890', label: '890' },
					{ value: '007', label: '007' },
					{ value: '015', label: '015' }
				]}
		/>
	);

	return (
		<Modal
			open={open}
			title="Редактирование данных сотрудника"
			okText="Сохранить"
			cancelText="Отмена"
			onCancel={() => {
				form.resetFields();
				onCancel();
			}}
			onOk={() => {
				form
					.validateFields()
					.then(values => {
						onUpdate(values);
						form.resetFields();
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
				initialValues={{
					...employee,
					birthdate: moment(employee?.birthdate),
					mobilePhoneCode: employee?.mobilePhone.slice(0, 3) ?? "495",
					mobilePhoneNumber: employee?.mobilePhone.slice(4),
					jobId: employee?.job?.id
				}}
			>
				<Form.Item
					name="lastName"
					label="Фамилия"
					rules={[{ required: true, message: 'Необходимо ввести фамилию сотрудника' }]}
				>
					<Input maxLength={20}/>
				</Form.Item>
				<Form.Item
					name="firstName"
					label="Имя"
					rules={[{ required: true, message: 'Необходимо ввести имя сотрудника' }]}
				>
					<Input maxLength={10}/>
				</Form.Item>
				<Form.Item
					name="birthdate"
					label="Дата рождения"
					rules={[{ required: true, message: 'Необходимо ввести дату рождения' }]}
				>
					<DatePicker placeholder="Выберете дату"/>
				</Form.Item>
				<Form.Item
					name="mobilePhoneNumber"
					label="Мобильный телефон"
					rules={[
						{ required: true, message: 'Необходимо ввести мобильный телефон' },
						{ pattern: /^\d{3}-\d{2}-\d{2}$/, message: 'Неверный формат номера' }
					]}
				>
					<MaskedInput
						addonBefore={
							<Form.Item
								name="mobilePhoneCode"
								noStyle
							>
								{selectBefore}
							</Form.Item>
						}
						mask='000-00-00'
					/>
				</Form.Item>
				<Form.Item name="workPhone" label="Рабочий телефон">
					<Input/>
				</Form.Item>
				<Form.Item name="email" label="Эл. почта" rules={[{ type: 'email' }]}>
					<Input/>
				</Form.Item>
				<Form.Item name="jobId" label="Место работы">
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

export default EmployeeEditForm;