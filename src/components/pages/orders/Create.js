import React, { Component } from 'react';
import { PageHeader, Form, Input, Button, Card, Row, Col, Select, DatePicker, Modal, List, notification } from 'antd';
import socket from '../../../socket';
import { tables } from '../../../tables';
import moment from 'moment';
import { orderStatus } from '../../../enums';
import uniqid from 'uniqid';

const formItemLayout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
};

export default class CreateForm extends Component {

    state = {
        users: [],
		games: [],
		orderGames: [],
        isModalVisible: false
    };

    constructor(props) {
        super(props);

        this.orderForm = React.createRef();
        this.orderGameForm = React.createRef();
    }

    componentDidMount() {
		this.selectUsers();
		this.selectGames();
    }

	onFinish(values) {
		socket.emit(tables.orders, 'insert', values, (result) => {
			if (!result) return;
            
            const orderGames = [...this.state.orderGames];

            orderGames.forEach(async (game) => {
                await new Promise((resolve) => {
                    game.fk_uzsakymaiid_uzsakymai = result.id_uzsakymai;
                    socket.emit(tables.orders, 'insertGame', game, (result) => resolve(result));
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

        this.setState({ isModalVisible: true }, async () => {
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (this.orderGameForm && this.orderGameForm.current) {
                        this.orderGameForm.current.resetFields();
                        this.orderGameForm.current.setFieldsValue({ id_zaidimu_uzsakymai: uniqid() });
                        clearInterval(interval);
                        resolve();
                    }
                }, 0);
            });
        });
    }

    addOrderGame(values) {
        const orderGames = [...this.state.orderGames];

        const index = orderGames.findIndex((game) => game.id_zaidimu_uzsakymai === values.id_zaidimu_uzsakymai);
        if (index > -1) {
            orderGames[index] = values;

            return this.setState({ 
                orderGames: [...orderGames],
                isModalVisible: false
            });
        }

        orderGames.push(values);
        this.setState({ 
            orderGames: [...orderGames],
            isModalVisible: false
        });
    }

    editOrderGame(gameId) {
        const orderGames = [...this.state.orderGames];

        const index = orderGames.findIndex((game) => game.id_zaidimu_uzsakymai === gameId);
        if (index < 0) return;

        const game = orderGames[index];

        this.setState({ isModalVisible: true}, async () => {
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

        const index = orderGames.findIndex((game) => game.id_zaidimu_uzsakymai === gameId);
        if (index < 0) return;
        orderGames.splice(index, 1);

        this.setState({ orderGames: [...orderGames] });
	}
	
	selectUsers() {
        socket.emit(tables.users, 'selectAll', null, (users) => {
            if (!users) return this.props.back();
            if (users && users.length === 0) {
                notification['warning']({
                    message: 'Vartotojai',
                    description: 'Nėra vartotojų!',
                    placement: 'bottomRight'
                });
                return this.props.back();
            }

			const userList = [...users];

            this.setState({ users: [...userList] }, async () => {
                await new Promise((resolve) => {
					const interval = setInterval(() => {
						if (this.orderForm && this.orderForm.current) {
							this.orderForm.current.setFieldsValue({ fk_vartotojaiid_vartotojai: userList[0].id_zaidimai });
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
                    this.orderForm.current.setFieldsValue({ fk_vartotojaiid_vartotojai: user.id_vartotojai });
                    clearInterval(interval);
                    resolve();
                }
            }, 0);
        });
    }

    selectGames() {
        socket.emit(tables.games, 'selectAll', null, (games) => {
            if (!games) return this.props.back();
            if (games && games.length === 0) {
                notification['warning']({
                    message: 'Žaidimai',
                    description: 'Nėra žaidimų!',
                    placement: 'bottomRight'
                });
                return this.props.back();
            }

			const gameList = [...games];

            this.setState({ games: [...gameList] }, async () => {
                await new Promise((resolve) => {
					const interval = setInterval(() => {
						if (this.orderGameForm && this.orderGameForm.current) {
							this.orderGameForm.current.setFieldsValue({ fk_zaidimaiid_zaidimai: gameList[0].id_zaidimai });
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
                    this.orderGameForm.current.setFieldsValue({ fk_zaidimaiid_zaidimai: game.id_zaidimai });
                    clearInterval(interval);
                    resolve();
                }
            }, 0);
        });
    }

	render() {
        if (this.state.users.length === 0) 
            return (<div></div>);

        return (
            <div>
				<PageHeader
					ghost={false}
					title='Užsakymai'
					subTitle='Vartotojų užsakymai'
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
					extra={[
                        <Button key='createOrder' type='primary' onClick={() => this.orderForm.current.submit()}>
						 	Sukurti užsakymą
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
									fk_vartotojaiid_vartotojai: this.state.users[0].id_vartotojai,
									busena: orderStatus[0],
                                    data: moment()
                                }}
                            >
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
                                    <Input type='number' />
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
                                    <a key='edit' onClick={this.editOrderGame.bind(this, game.id_zaidimu_uzsakymai)}>redaguoti</a>, 
                                    // eslint-disable-next-line
                                    <a key='remove' onClick={this.removeOrderGame.bind(this, game.id_zaidimu_uzsakymai)}>šalinti</a>
                                ]}>
                                    {game.id_zaidimu_uzsakymai}
                                    {/* <List.Item.Meta
                                        avatar={
                                            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                        }
                                        title={<a href="https://ant.design">{item.name.last}</a>}
                                        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                    /> */}
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
				{this.state.games.length === 0 ? '' :
                <Modal
                    title='Užsakymo žaidimas'
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
						initialValues={{
							kiekis: 1,
							fk_zaidimaiid_zaidimai: this.state.games[0].id_zaidimai
						}}
                    >
                        <Form.Item
                            name='id_zaidimu_uzsakymai'
                            label='ID'
                            rules={[{ required: true, message: 'Įveskite užsakymo žaidimo ID!' }]}
                            style={{ display: 'none' }}
                        >
                            <Input disabled />
                        </Form.Item>

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
                    </Form>
                </Modal>}
            </div>
        );
    }
    
}