import React, { useState } from "react";
import { Button, DatePicker, Form, Radio, Space } from "antd";
import api from "../api/api";
import { openNotification } from "../components/helpers/notification";
import moment from "moment";

const { RangePicker } = DatePicker;

const Export: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();

	const onExport = () => {
		form
			.validateFields()
			.then(() => {
				// form.resetFields();
				exportData();
			})
			.catch(info => {
				console.log('Validate Failed:', info);
			});
	}

	const exportData = () => {
		setLoading(true);
		const period: [moment.Moment, moment.Moment] = form.getFieldValue('period');
		const startDate = period[0].format('YYYY-MM-DD');
		const endDate = period[1].format('YYYY-MM-DD');
		api.get('export/',
			{
				params: {
					type: form.getFieldValue('exportType'),
					startdate: startDate,
					enddate: endDate,
				}
			})
			.then(response => openNotification(
				'success',
				'Результат выгрузки',
				`Выгружено записей: ${response.data.length}`
			))
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

	return <div>
		<Form
			form={form}
			layout="vertical"
			name="export_form"
		>
			<Form.Item
				name="period"
				label="Период выгрузки"
				rules={[{ required: true, message: 'Необходимо выбрать период выгрузки' }]}
			>
				<RangePicker placeholder={['С', 'По']}/>
			</Form.Item>
			<Form.Item
				name="exportType"
				label="Тип выгрузки"
				initialValue={"phonebook"}
			>
				<Radio.Group>
					<Space direction="vertical">
						<Radio value="phonebook">Выгрузка типа 1: Телефонная книга</Radio>
						<Radio value="employee-job">Выгрузка типа 2: Сотрудники с привязкой к местам работы</Radio>
					</Space>
				</Radio.Group>
			</Form.Item>
			<Form.Item>
				<Button type="primary" loading={loading} onClick={onExport}>
					Выгрузить
				</Button>
			</Form.Item>
		</Form>
	</div>
};

export default Export;