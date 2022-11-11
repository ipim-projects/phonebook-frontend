import React from "react";
import "./MainLayout.css";
import { Link, Outlet } from "react-router-dom";
import { Breadcrumb, Layout, Menu, MenuProps } from "antd";

const { Header, Content, Footer } = Layout;

const items: MenuProps['items'] = [
	{
		label: <Link to="/">Главная</Link>,
		key: 'home'
	},
	{
		label: 'Справочники',
		key: 'refBooks',
		children: [
			{
				label: <Link to="/jobs">Места работы</Link>,
				key: 'jobs',
			},
			{
				label: <Link to="/employees">Сортрудники</Link>,
				key: 'employees',
			},
		],
	},
	{
		label: 'Отчёты',
		key: 'reports'
	}
];

const MainLayout: React.FC = () => (
	<Layout className="layout">
		<Header>
			<div className="logo"/>
			<Menu
				theme="dark"
				mode="horizontal"
				defaultSelectedKeys={['home']}
				items={items}
			/>
		</Header>
		<Content style={{ padding: '0 50px' }}>
			<Breadcrumb style={{ margin: '16px 0' }}>
				<Breadcrumb.Item>Справочники</Breadcrumb.Item>
				<Breadcrumb.Item>Места работы</Breadcrumb.Item>
			</Breadcrumb>
			<div className="site-layout-content">
				<Outlet/>
			</div>
		</Content>
		<Footer style={{ textAlign: 'center' }}>ЦК6.ОТР ©2022</Footer>
	</Layout>
);

export default MainLayout;