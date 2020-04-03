import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import Users from './pages/Users';

const { Header, Content } = Layout;

export default class App extends Component {

	state = {
		currentPage: 'users'
	};

	render() {
		return (
			<Layout className='layout'>
				<Header className='header'>
					<Menu mode='horizontal'>
						<Menu.Item key='mail'>
							Vartotojai
						</Menu.Item>
						<Menu.Item key='app'>
							Užsakymai
						</Menu.Item>
					</Menu>
				</Header>
				<Content className='site-layout-content'>
					<Users />
				</Content>
			</Layout>
		);
	}

}