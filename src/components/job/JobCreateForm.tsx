import { Form, Input, Modal } from 'antd';
import React from 'react';

interface JobValues {
	company: string;
	jobTitle: string;
	address: string;
}

interface JobCreateFormProps {
	open: boolean;
	onCreate: (values: JobValues) => void;
	onCancel: () => void;
}

const JobCreateForm: React.FC<JobCreateFormProps> = ({
														 open,
														 onCreate,
														 onCancel,
													 }) => {
	const [form] = Form.useForm();
	return (
		<Modal
			open={open}
			title="Новое место работы"
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
			>
				<Form.Item
					name="company"
					label="Организация"
					rules={[{ required: true, message: 'Необходимо ввести наименование организации' }]}
				>
					<Input/>
				</Form.Item>
				<Form.Item
					name="jobTitle"
					label="Должность"
					rules={[{ required: true, message: 'Необходимо ввести наименование должности' }]}
				>
					<Input/>
				</Form.Item>
				<Form.Item name="address" label="Адрес">
					<Input/>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default JobCreateForm;