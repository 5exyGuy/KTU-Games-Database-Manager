import React, { Component } from 'react';
import { PageHeader, Form, Input, Button, Card, Row, Col, DatePicker, Modal, List, Select, notification } from 'antd';
import socket from '../../../socket';
import { tables } from '../../../tables';
import moment from 'moment';
import { orderStatus } from '../../../enums';

const formItemLayout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
};

export default class EditForm extends Component {

    state = {
        users: [],
		games: [],
		orderGames: [],
        isModalVisible: false,
        creatingNew: false
    };

    constructor(props) {
        super(props);

        this.orderForm = React.createRef();
        this.orderGameForm = React.createRef();
    }

    componentDidMount() {
		this.selectOrderGames(this.props.data.id_uzsakymai);
        this.selectUsers();
		this.selectGames();
    }

	onFinish(values) {
		socket.emit(tables.users, 'update', values, (result) => {
			if (!result) return;
            
            const orderGames = [...this.state.orderGames];

            orderGames.forEach(async (game) => {
                await new Promise((resolve) => {
                    game.fk = values.id_vartotojai;
                    if (game.naujas) socket.emit(tables.orders, 'insertGame', game, (result) => resolve(result));
                    else socket.emit(tables.orders, 'updateGame', game, (result) => resolve(result));
                });
            });

            this.props.back();
		});
    }

    addNewOrderGame() {
        if (this.state.games.length === 0)
            return notification['warning']({
                message: 'Žaidimai',
                description: 'Nėra žaidimų!',
                placement: 'bottomRight'
            });

        this.setState({ isModalVisible: true, creatingNew: true }, async () => {
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (this.orderGameForm && this.orderGameForm.current) {
                        this.orderGameForm.current.resetFields();
                        this.orderGameForm.current.setFieldsValue({ 
                            naujas: true
                        });
                        clearInterval(interval);
                        resolve();
                    }
                }, 0);
            });
        });
    }

    addOrderGame(values) {
        const orderGames = [...this.state.orderGames];

        const index = orderGames.findIndex((game) => game.fk_zaidimaiid_zaidimai === values.fk_zaidimaiid_zaidimai);
        if (index > -1) {
            orderGames[index] = values;
            this.calculatePrice(orderGames);

            return this.setState({ 
                orderGames: [...orderGames],
                isModalVisible: false,
                creatingNew: false
            });
        }
        
        orderGames.push(values);
        this.calculatePrice(orderGames);

        this.setState({ 
            orderGames: [...orderGames],
            isModalVisible: false,
            creatingNew: false
        });
    }

    calculatePrice(orderGames) {
        const games = [...this.state.games];
        let price = 0.00;

        orderGames.forEach((orderGame) => {
            const game = games.find((game) => game.id_zaidimai === orderGame.fk_zaidimaiid_zaidimai);
            if (game) {
                price += game.kaina * orderGame.kiekis;
            }
        });

        this.orderForm.current.setFieldsValue({ kaina: price });
    }

    editOrderGame(gameId) {
        const orderGames = [...this.state.orderGames];

        const index = orderGames.findIndex((game) => game.fk_zaidimaiid_zaidimai === gameId);
        if (index < 0) return;

        const game = orderGames[index];

        if (game.naujas) {
            return this.setState({ isModalVisible: true, creatingNew: true }, async () => {
                await new Promise((resolve) => {
                    const interval = setInterval(() => {
                        if (this.orderGameForm && this.orderGameForm.current) {
                            this.orderGameForm.current.resetFields();
                            this.orderGameForm.current.setFieldsValue({...game});
                            clearInterval(interval);
                            resolve();
                        }
                    }, 0);
                });
            });
        }

        return this.setState({ isModalVisible: true, creatingNew: false }, async () => {
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (this.orderGameForm && this.orderGameForm.current) {
                        this.orderGameForm.current.resetFields();
                        this.orderGameForm.current.setFieldsValue({...game});
                        clearInterval(interval);
                        resolve();
                    }
                }, 0);
            });
        });
    }

    removeOrderGame(gameId) {
        const orderGames = [...this.state.orderGames];
        const index = orderGames.findIndex((game) => game.fk_zaidimaiid_zaidimai === gameId);
        if (index < 0) return;

        if (orderGames[index].naujas) {
            orderGames.splice(index, 1);
            return this.setState({ orderGames: [...orderGames] });
        }

        socket.emit(tables.orders, 'deleteGame', gameId, (result) => {
            if (!result) return;
            this.selectOrderGames(this.props.data.id_uzsakymai);
        });
    }

    selectOrderGames(orderId) {
        socket.emit(tables.orders, 'selectGames', orderId, (games) => {
            if (!games) return this.setState({ orderGames: [] });

            const orderGames = [...games];

            orderGames.map((game) => {
                game.naujas = false;
                return game;
            });

            this.setState({ orderGames: [...orderGames] });
        });
	}
    
    selectUsers() {
        socket.emit(tables.users, 'selectAll', null, (users) => {
            if (!users) return this.setState({ users: [] });
            if (users.length === 0) this.props.back();

			const userList = [...users];
			
			this.setState({ users: [...userList] }, async () => {
				await new Promise((resolve) => {
					const interval = setInterval(() => {
						if (this.orderForm && this.orderForm.current) {
							this.orderForm.current.setFieldsValue({ 
                                fk_vartotojaiid_vartotojai: userList[0].id_vartotojai 
                            });
							clearInterval(interval);
							resolve();
						}
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
				if (this.orderForm && this.orderForm.current) {
					this.orderForm.current.resetFields();
					this.orderForm.current.setFieldsValue({ fk_vartotojaiid_vartotojai: user.id_vartotojai });
					clearInterval(interval);
					resolve();
				}
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
			
			this.setState({ games: [...gameList] }, async () => {
				await new Promise((resolve) => {
					const interval = setInterval(() => {
						if (this.orderGameForm && this.orderGameForm.current) {
							this.orderGameForm.current.setFieldsValue({ 
                                fk_zaidimaiid_zaidimai: gameList[0].id_zaidimai 
                            });
							clearInterval(interval);
							resolve();
						}
					}, 0);
				});
			});
		});
    }
	
	selectGame(gameId) {
        const game = this.state.games.find((game) => game.id_zaidimai === gameId);
        if (!game) return;
			
		new Promise((resolve) => {
			const interval = setInterval(() => {
				if (this.orderGameForm && this.orderGameForm.current) {
					this.orderGameForm.current.setFieldsValue({ 
                        fk_zaidimaiid_zaidimai: game.id_zaidimai 
                    });
					clearInterval(interval);
					resolve();
				}
			}, 0);
		});
    }

    getGame(gameId) {
        return this.state.games.find((game) => game.id_zaidimai === gameId);
    }

	render() {
        if (this.state.games.length === 0)
            return (<div></div>);

        return (
            <div>
				<PageHeader
					ghost={false}
					title='Užsakymai'
					subTitle='Vartotojų užsakymai'
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
					extra={[
                        <Button key='editOrder' type='primary' onClick={() => this.orderForm.current.submit()}>
						 	Redaguoti užsakymą
						</Button>,
                        <Button key='addNewOrderGame' onClick={this.addNewOrderGame.bind(this)}>
                            Pridėti naują užsakomą žaidimą
                        </Button>,
						<Button key='cancel' onClick={() => this.props.back()}>
						 	Grįžti
						</Button>
					]}
				/>
				<Row justify='center' style={{ padding: '10px', marginLeft: '0px', marginRight: '0px' }}>
                    <Col span={12}>
                        <Card style={{ backgroundColor: 'rgb(225, 225, 225)' }}>
                            <Form
                                ref={this.orderForm}
                                {...formItemLayout}
                                onFinish={this.onFinish.bind(this)}
                                scrollToFirstError
                                initialValues={{
                                    id_uzsakymai: this.props.data.id_uzsakymai,
									fk_vartotojaiid_vartotojai: this.props.data.fk_vartotojaiid_vartotojai,
									busena: this.props.data.busena,
									data: moment(this.props.data.data),
									kaina: this.props.data.kaina,
                                    pvm: this.props.data.pvm,
                                }}
                            >
                                <Form.Item
									name='id_uzsakymai'
									label='ID'
									rules={[{ required: true, message: 'Įveskite užsakymo ID!' }]}
								>
									<Input type='number' disabled />
								</Form.Item>

								<Form.Item
                                    key='fk_vartotojaiid_vartotojai'
                                    name='fk_vartotojaiid_vartotojai'
                                    label='Užsakovas'
                                    rules={[{ required: true, message: 'Pasirinkite užsakovą!' }]}
                                >
                                    <Select onChange={(user) => this.selectUser(user)}>
                                        {this.state.users.map((user) => {
                                            return <Select.Option value={user.id_vartotojai}>{user.slapyvardis}</Select.Option>;
                                        })}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    key='busena'
                                    name='busena'
                                    label='Būsena'
                                    rules={[{ required: true, message: 'Pasirinkite užsakymo būseną!' }]}
                                >
                                    <Select>
                                        {orderStatus.map((status) => {
                                            return <Select.Option value={status}>{status}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    key='data'
                                    name='data'
                                    label='Užsakymo data'
                                    rules={[{ required: true, message: 'Pasirinkite užsakymo datą!' }]}
                                >
                                    <DatePicker
                                        format="YYYY-MM-DD HH:mm:ss"
                                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    key='kaina'
                                    name='kaina'
                                    label='Kaina'
                                    rules={[{ required: true, message: 'Įveskite kainą!' }]}
                                >
                                    <Input type='number' disabled />
                                </Form.Item>

								<Form.Item
                                    key='pvm'
                                    name='pvm'
                                    label='PVM'
                                    rules={[{ required: true, message: 'Įveskite PVM!' }]}
                                >
                                    <Input type='number' />
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
				</Row>
                <Row justify='center' style={{ padding: '10px', marginLeft: '0px', marginRight: '0px' }}>
                    <Col span={12}>
                        <List
                            bordered
                            dataSource={this.state.orderGames}
                            renderItem={game => (
                                <List.Item actions={[
                                    // eslint-disable-next-line
                                    <a key='edit' onClick={this.editOrderGame.bind(this, game.fk_zaidimaiid_zaidimai)}>redaguoti</a>, 
                                    // eslint-disable-next-line
                                    <a key='remove' onClick={this.removeOrderGame.bind(this, game.fk_zaidimaiid_zaidimai)}>šalinti</a>
                                ]}>
                                    {/* {game.fk_zaidimaiid_zaidimai} */}
                                    {this.getGame(game.fk_zaidimaiid_zaidimai).pavadinimas} ({this.getGame(game.fk_zaidimaiid_zaidimai).platforma}) - {game.kiekis} vnt.
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
                <Modal
                    title='Užsakomas žaidimas'
                    centered
                    visible={this.state.isModalVisible}
                    onCancel={() => this.setState({ isModalVisible: false })}
                    footer={[
                        <Button key='cancel' onClick={() => this.setState({ isModalVisible: false })}>
                            Grįžti
                        </Button>,
                        <Button key='submit' type='primary' onClick={() => this.orderGameForm.current.submit()}>
                            Patvirtinti
                        </Button>
                    ]}
                >
                    <Form
                        ref={this.orderGameForm}
                        {...formItemLayout}
                        onFinish={this.addOrderGame.bind(this)}
                        scrollToFirstError
                    >
                        <Form.Item
                            name='kiekis'
                            label='Kiekis'
                            rules={[{ required: true, message: 'Įveskite žaidimų kiekį!' }]}
                        >
                            <Input type='number' />
                        </Form.Item>

                        <Form.Item
							key='fk_zaidimaiid_zaidimai'
							name='fk_zaidimaiid_zaidimai'
							label='Žaidimas'
							rules={[{ required: true, message: 'Pasirinkite žaidimą!' }]}
						>
							<Select onChange={(game) => this.selectGame(game)}>
								{this.state.games.map((game) => {
									return <Select.Option value={game.id_zaidimai}>{game.pavadinimas} ({game.platforma})</Select.Option>;
								})}
							</Select>
						</Form.Item>

                        <Form.Item
                            name='naujas'
                            label='Naujas'
                            rules={[{ required: true, message: 'Įveskite, ar tai naujas!'}]}
                            // style={{ display: 'none' }}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
    
}