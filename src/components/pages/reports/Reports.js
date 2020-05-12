import React, { Component } from 'react';
import { Button, PageHeader, Form, Select, Row, Col, Card, Empty, Statistic } from 'antd';
import socket from '../../../socket';
import { platforms } from '../../../enums';
import { tables } from '../../../tables';

const formItemLayout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
};

export default class Reports extends Component {

	state = {
		action: 'none',
		users: [],
		games: [],
		userOrders: []
	};

	constructor(props) {
        super(props);

        this.reportForm = React.createRef();
    }

	componentDidMount() {
		this.selectUsers();
		this.selectGames();
	}

	onFinish(values) {
		console.log(values);
		socket.emit('ataskaitos', 'selectUserOrders', { pavadinimas: 'Game03', platforma: 'PlayStation 4', id_vartotojai: 9 }, (userOrders) => {
			console.log(userOrders);
			this.setState({ userOrders: [...userOrders] });
		});
	}
	
	selectUsers() {
        socket.emit(tables.users, 'selectAll', null, (users) => {
            if (!users) return this.setState({ users: [] });
            if (users.length === 0) this.props.back();

			const userList = [...users];
	
			userList.map((user) => {
				return user.key = user.id_vartotojai;
            });
	
			this.setState({ users: [...userList] }, async () => {
				await new Promise((resolve) => {
					const interval = setInterval(() => {
						if (this.reportForm && this.reportForm.current)
							this.reportForm.current.setFieldsValue({ id_vartotojai: userList[0].id_vartotojai });
						clearInterval(interval);
						resolve();
					}, 0);
				});
            });
		});
	}

	selectUser(userId) {
        const user = this.state.users.find((user) => user.id_vartotojai === userId);
        if (!user) return;
			
		new Promise((resolve) => {
			const interval = setInterval(() => {
				if (this.reportForm && this.reportForm.current)
					this.reportForm.current.setFieldsValue({ id_vartotojai: user.id_vartotojai });
				clearInterval(interval);
				resolve();
			}, 0);
		});
    }
	
	selectGames() {
        socket.emit(tables.games, 'selectAll', null, (games) => {
            if (!games) return this.setState({ games: [] });
            if (games.length === 0) this.props.back();

			const gameList = [...games];
	
			gameList.map((game) => {
				return game.key = game.id_zaidimai;
			});

			const unique = gameList.filter((v, i, a) => a.indexOf(v) === i); 
	
			this.setState({ games: [...unique] }, async () => {
				await new Promise((resolve) => {
					const interval = setInterval(() => {
						if (this.reportForm && this.reportForm.current)
							this.reportForm.current.setFieldsValue({ pavadinimas: unique[0].pavadinimas });
						clearInterval(interval);
						resolve();
					}, 0);
				});
            });
		});
    }

    selectGame(name) {
        const game = this.state.games.find((game) => game.pavadinimas === name);
        if (!game) return;
			
		new Promise((resolve) => {
			const interval = setInterval(() => {
				if (this.reportForm && this.reportForm.current)
					this.reportForm.current.setFieldsValue({ pavadinimas: game.pavadinimas });
				clearInterval(interval);
				resolve();
			}, 0);
		});
    }

	render() {
		return (
			<div>
                <PageHeader
                    ghost={false}
                    title='Užsakymų ataskaita'
                    subTitle='Informacija apie vartotojo sudarytus užsakymus'
                    extra={[
						<Button type='primary' onClick={() => this.reportForm.current.submit()}>
                        	Sukurti ataskaitą
                        </Button>
                    ]}
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
                />
				<Row justify='center' style={{ padding: '10px', marginLeft: '0px', marginRight: '0px' }}>
                    <Col span={12}>
                        <Card style={{ backgroundColor: 'rgb(225, 225, 225)' }}>
                            <Form
                                ref={this.reportForm}
                                {...formItemLayout}
                                onFinish={this.onFinish.bind(this)}
                                scrollToFirstError
                                initialValues={{
                                    platforma: platforms[0]
                                }}
                            >
								<Form.Item
                                    key='id_vartotojai'
                                    name='id_vartotojai'
                                    label='Vartotojas'
                                    rules={[{ required: true, message: 'Pasirinkite vartotoją!' }]}
                                >
                                    <Select onChange={(user) => this.selectUser(user)}>
                                        {this.state.users.map((user) => {
                                            return <Select.Option value={user.id_vartotojai}>{user.slapyvardis}</Select.Option>;
                                        })}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    key='pavadinimas'
                                    name='pavadinimas'
                                    label='Pavadinimas'
                                    rules={[{ required: true, message: 'Pasirinkite žaidimo pavadinimą!' }]}
                                >
                                    <Select onChange={(game) => this.selectGame(game)}>
                                        {this.state.games.map((game) => {
                                            return <Select.Option value={game.pavadinimas}>{game.pavadinimas}</Select.Option>;
                                        })}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    key='platforma'
                                    name='platforma'
                                    label='Platforma'
                                    rules={[{ required: true, message: 'Pasirinkite žaidimo platformą!' }]}
                                >
                                    <Select>
                                        {platforms.map((platform) => {
                                            return <Select.Option value={platform}>{platform}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
				</Row>
				<Row justify='center' style={{ padding: '10px', marginLeft: '0px', marginRight: '0px' }}>
                    <Col span={12}>
                        <Card style={{ backgroundColor: 'rgba(225, 225, 225, 0.2)' }}>
							{this.state.userOrders.length === 0 ? 
								<Empty description='Nėra duomenų' />
								:
								<Row gutter={16}>
									<Col span={6}>
										<Statistic title='Vartotojas' value={this.state.userOrders[0].slapyvardis} />
									</Col>
									<Col span={6}>
										<Statistic title='El. paštas' value={this.state.userOrders[0].el_pastas} />
									</Col>
									<Col span={6}>
										<Statistic title='Žaidimas' value={5} />
									</Col>
									<Col span={6}>
										<Statistic title='Iš viso' value={112893} precision={2} />
									</Col>
								</Row>
							}
                        </Card>
                    </Col>
				</Row>
			</div>
		);
	}	
    
}