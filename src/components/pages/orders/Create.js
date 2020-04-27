import React, { Component } from 'react';
import { PageHeader, Form, Input, Button, Card, Row, Col, DatePicker, Modal, List, Select, Rate, Checkbox } from 'antd';
import socket from '../../../socket';
import { tables } from '../../../tables';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
import uniqid from 'uniqid';

const formItemLayout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
};

const tailFormItemLayout = {
	wrapperCol: {
		span: 16,
		offset: 8
	}
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
		socket.emit(tables.users, 'insert', values, (result) => {
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
        this.setState({ isModalVisible: true}, async () => {
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (this.orderGameForm && this.orderGameForm.current) {
                        this.orderGameForm.current.resetFields();
                        this.orderGameForm.current.setFieldsValue({ id_: uniqid() });
                        clearInterval(interval);
                        resolve();
                    }
                }, 0);
            });
        });
    }

    addOrderGame(values) {
        const orderGames = [...this.state.orderGames];

        const index = orderGames.findIndex((review) => review.id_atsiliepimai === values.id_atsiliepimai);
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

    editReview(reviewId) {
        const orderGames = [...this.state.orderGames];

        const index = orderGames.findIndex((review) => review.id_atsiliepimai === reviewId);
        if (index < 0) return;

        const review = orderGames[index];

        this.setState({ isModalVisible: true}, async () => {
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (this.orderGameForm && this.orderGameForm.current) {
                        this.orderGameForm.current.resetFields();
                        this.orderGameForm.current.setFieldsValue({...review});
                        clearInterval(interval);
                        resolve();
                    }
                }, 0);
            });
        });
    }

    removeReview(reviewId) {
        const orderGames = [...this.state.orderGames];

        const index = orderGames.findIndex((user) => user.id_atsiliepimai === reviewId);
        if (index < 0) return;
        orderGames.splice(index, 1);

        this.setState({ orderGames: [...orderGames] });
	}

	selectGames() {
        socket.emit(tables.games, 'selectAll', null, (games) => {
            if (!games) return this.setState({ games: [] });
            if (games.length === 0) this.props.back();

			const gameList = [...games];
	
			gameList.map((game) => {
				return game.key = game.id_zaidimai;
			});
	
			this.setState({ games: [...gameList] }, () => {
                if (this.form && this.form.current)
                    this.form.current.setFieldsValue({ fk_zaidimaiid_zaidimai: gameList[0].id_zaidimai });
            });
		});
    }
	
	selectGame(gameId) {
        const game = this.state.games.find((game) => game.id_zaidimai === gameId);
        if (!game) return;
        if (this.form && this.form.current)
            this.form.current.setFieldsValue({ fk_zaidimaiid_zaidimai: game.id_zaidimai });
    }

	render() {
		if (this.state.games.length === 0)
			return (<div></div>);

        return (
            <div>
				<PageHeader
					ghost={false}
					title='Varotojai'
					subTitle='Užregistruoti internetinės parduotuvės vartotojai'
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
					extra={[
                        <Button key='create' type='primary' onClick={() => this.orderForm.current.submit()}>
						 	Sukurti grupę
						</Button>,
                        <Button key='addNewOrderGame' onClick={this.addNewOrderGame.bind(this)}>
						 	Pridėti naują vartotoją
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
									paskutinis_prisijungimas: moment(),
									registracijos_data: moment()
                                }}
                            >
								<Form.Item
									name='id_vartotojai'
									label='ID'
									rules={[{ required: true, message: 'Įveskite vartotojo ID!' }]}
									style={{ display: 'none' }}
								>
									<Input type='number' disabled />
								</Form.Item>

								<Form.Item
									name='slapyvardis'
									label='Slapyvardis'
									rules={[{ required: true, message: 'Įveskite slapyvardį!', whitespace: false, min: 5, max: 255 }]}
								>
									<Input />
								</Form.Item>
								<Form.Item
									name='el_pastas'
									label='El. paštas'
									rules={[
										{
											type: 'email',
											message: 'Neteisingai įvedėte el. paštą!',
										},
										{
											required: true,
											message: 'Įveskite el. paštą!',
										}
									]}
								>
									<Input />
								</Form.Item>

								<Form.Item
									name='slaptazodis'
									label='Slaptažodis'
									rules={[
										{
											required: true,
											message: 'Įveskite slaptažodį!'
										}
									]}
								>
									<Input.Password />
								</Form.Item>

								<Form.Item
									name='paskutinis_prisijungimas'
									label='Paskutinis prisijungimas'
								>
									<DatePicker
										format="YYYY-MM-DD HH:mm:ss"
										showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
									/>
								</Form.Item>

								<Form.Item
									name='registracijos_data'
									label='Registracijos data'
								>
									<DatePicker
										format="YYYY-MM-DD HH:mm:ss"
										showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
									/>
								</Form.Item>

								<Form.Item
									name='balansas'
									label='Balansas'
									rules={[
										{
											required: true,
											message: 'Įveskite balansą!'
										}
									]}
								>
									<Input type='number' />
								</Form.Item>
					
								<Form.Item
									name='aktyvuotas'
									valuePropName='checked'
									{...tailFormItemLayout}
								>
									<Checkbox>
										Ar aktyvuoti vartotoją?
									</Checkbox>
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
                            renderItem={review => (
                                <List.Item actions={[
                                    // eslint-disable-next-line
                                    <a key='edit' onClick={this.editReview.bind(this, review.id_atsiliepimai)}>redaguoti</a>, 
                                    // eslint-disable-next-line
                                    <a key='remove' onClick={this.removeReview.bind(this, review.id_atsiliepimai)}>šalinti</a>
                                ]}>
                                    {review.komentaras}
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
                <Modal
                    title='Atsiliepimas'
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
                            fk_zaidimaiid_zaidimai: this.state.games[0].id_zaidimai,
							ivertinimas: 0,
							data: moment()
                        }}
                    >
						<Form.Item
                            name='id_atsiliepimai'
                            label='ID'
                            rules={[{ required: true, message: 'Įveskite atsiliepimo ID!' }]}
                            style={{ display: 'none' }}
                        >
                            <Input type='number' disabled />
                        </Form.Item>

                        <Form.Item
							key='fk_zaidimaiid_zaidimai'
							name='fk_zaidimaiid_zaidimai'
							label='Žaidimas'
							rules={[{ required: true, message: 'Pasirinkite žaidimą!' }]}
						>
							<Select onChange={(game) => this.selectGame(game)}>
								{this.state.games.map((game) => {
									return <Select.Option value={game.fk_zaidimaiid_zaidimai}>{game.fk_zaidimaiid_zaidimai}</Select.Option>;
								})}
							</Select>
						</Form.Item>

						<Form.Item
							key='ivertinimas'
							name='ivertinimas'
							label='Įvertinimas'
							rules={[{ required: true, message: 'Pasirinkite žaidimo įvertinimą!' }]}
						>
							<Rate />
						</Form.Item>

						<Form.Item
							key='komentaras'
							name='komentaras'
							label='Komentaras'
							rules={[{ required: true, message: 'Įveskite komentarą apie žaidimą!' }]}
						>
							<TextArea />
						</Form.Item>

						<Form.Item
							key='data'
							name='data'
							label='Parašymo data'
							rules={[{ required: true, message: 'Pasirinkite atsiliepimo parašymo datą!' }]}
						>
							<DatePicker
								format="YYYY-MM-DD HH:mm:ss"
								showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
							/>
						</Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
    
}