import { DatePicker, Form, Input, Modal } from 'antd';
import React from 'react';
import moment from "moment";

interface EmployeeValues {
	firstName: string;
	lastName: string;
	birthdate: moment.Moment;
	mobilePhone: string;
	workPhone: string;
	email: string;
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
	const [form] = Form.useForm();
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
					<DatePicker/>
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
			</Form>
		</Modal>
	);
};

export default EmployeeCreateForm;