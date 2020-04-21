import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import Users from './pages/users/Users';
import Orders from './pages/orders/Orders';
import FAQ from './pages/faq/FAQ';
import Developers from './pages/developers/Developers';
import Reviews from './pages/reviews/Reviews';
import Games from './pages/games/Games';
import Images from './pages/images/Images';
import Carts from './pages/carts/Carts';
import Payments from './pages/payments/Payments';

const { Header, Content } = Layout;

export default class App extends Component {

	state = {
		currentPage: 'users'
	};

	clickMenuItem(event) {
		this.setState({ currentPage: event.key });
	}

	render() {
		const pages = [
			{ name: 'Vartotojai', key: 'users', content: <Users /> },
			{ name: 'Kūrėjai', key: 'developers', content: <Developers /> },
			{ name: 'DUK', key: 'faq', content: <FAQ /> },
			{ name: 'Mokėjimai', key: 'payments', content: <Payments /> },
			{ name: 'Atsiliepimai', key: 'reviews', content: <Reviews /> },
			{ name: 'Nuotraukos', key: 'images', content: <Images /> },
			{ name: 'Žaidimai', key: 'games', content: <Games /> },
			{ name: 'Užsakymai', key: 'orders', content: <Orders /> },
			{ name: 'Krepšeliai', key: 'carts', content: <Carts /> },
		];

		return (
			<Layout className='layout'>
				<Header className='header'>
					<Menu onClick={this.clickMenuItem.bind(this)} selectedKeys={this.state.currentPage} mode='horizontal'>
						{pages.map((item) => (
							<Menu.Item key={item.key}>
								{item.name}
							</Menu.Item>
						))}
					</Menu>
				</Header>
				<Content className='site-layout-content'>
					{pages.find((item) => item.key === this.state.currentPage).content}
				</Content>
			</Layout>
		);
	}

}