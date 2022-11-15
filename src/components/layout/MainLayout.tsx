import React from "react";
import "./MainLayout.css";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Layout, Menu, MenuProps, PageHeader } from "antd";
import { Route } from "antd/es/breadcrumb/Breadcrumb";

const { Header, Content, Footer } = Layout;

const items: MenuProps['items'] = [
	{
		label: <Link to="/">Телефонная книга</Link>,
		key: ''
	},
	{
		label: 'Справочники',
		key: 'refs',
		children: [
			{
				label: <Link to="/refs/jobs">Места работы</Link>,
				key: 'jobs',
			},
			{
				label: <Link to="/refs/employees">Сортрудники</Link>,
				key: 'employees',
			},
		],
	},
	{
		label: 'Отчёты',
		key: 'reports'
	}
];

const breadcrumbTitles = (path: string): Route => {
	if (path === '/') {
		return {
			path: '',
			breadcrumbName: 'Телефонная книга',
		}
	}
	if (path === '/refs') {
		return {
			path: 'refs',
			breadcrumbName: 'Справочники',
		}
	}
	if (path === '/refs/jobs') {
		return {
			path: 'jobs',
			breadcrumbName: 'Места работы',
		}
	}
	if (path === '/refs/employees') {
		return {
			path: 'employees',
			breadcrumbName: 'Сотрудники',
		}
	}
	return {
		path: 'nomatch',
		breadcrumbName: 'NoMatch',
	}
}

const itemRender = (route: Route, params: any, routes: Array<Route>, paths: Array<string>) => {
	const last = routes.indexOf(route) === routes.length - 1;
	return last ? (
		<span>{route.breadcrumbName}</span>
	) : (
		<Link to={paths.join('/')}>{route.breadcrumbName}</Link>
	);
}

const MainLayout: React.FC = () => {
	const location = useLocation();
	console.log('location', location, location.pathname.split('/'));
	const title = breadcrumbTitles(location.pathname).breadcrumbName;
	console.log('title', title);
	const path: string[] = location.pathname.split('/').filter(item => item !== '');
	const routes = path.reduce((prev: Route[], curr) => {
		console.log(`${prev.map(route => route.path).join('/')}/${curr}`);
		return [...prev, breadcrumbTitles(`${prev.map(route => route.path).join('/')}/${curr}`)];
	}, [breadcrumbTitles('/')]);
	console.log('routes', routes);

	return <Layout style={{ height: '100vh' }}>
		<Header>
			<img className="logo" src="/logo.png" alt="Phonebook"/>
			<Menu
				theme="dark"
				mode="horizontal"
				defaultSelectedKeys={['']}
				selectedKeys={[breadcrumbTitles(location.pathname).path]}
				items={items}
			/>
		</Header>
		<Content style={{ padding: '0 50px' }}>
			<PageHeader
				className="site-page-header"
				title={title}
				breadcrumb={{ itemRender, routes }}
			/>
			<div className="site-layout-content">
				<Outlet/>
			</div>
		</Content>
		<Footer style={{ textAlign: 'center' }}>ЦК6.ОТР ©2022</Footer>
	</Layout>;
};

export default MainLayout;