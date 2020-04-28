import React, { Component } from 'react';
import { PageHeader, Form, Input, Button, Card, Row, Col, DatePicker, Modal, List, Select, Rate, Checkbox, notification } from 'antd';
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
		games: [],
        userReviews: [],
        isModalVisible: false
    };

    constructor(props) {
        super(props);

        this.userForm = React.createRef();
        this.reviewForm = React.createRef();
	}
	
	componentDidMount() {
		this.selectGames();
	}

	onFinish(values) {
		socket.emit(tables.users, 'insert', values, (user) => {
			if (!user) return;
			console.log(user);

			notification['success']({
				message: 'Vartotojai',
				description: 'Vartotojas sėkmingai įkeltas į duomenų bazę!',
				placement: 'bottomRight'
			});
            
            const userReviews = [...this.state.userReviews];

            userReviews.forEach(async (review) => {
                const result = await new Promise((resolve) => {
                    review.fk_vartotojaiid_vartotojai = user.id_vartotojai;
                    socket.emit(tables.reviews, 'insert', review, (result) => resolve(result));
				});
				
				if (result)
					notification['success']({
						message: 'Atsiliepimai',
						description: 'Atsiliepimas sėkmingai įkeltas į duomenų bazę!',
						placement: 'bottomRight'
					});
            });

            this.props.back();
		});
    }

    addNewReview() {
		if (this.state.games.length === 0)
			return notification['warning']({
				message: 'Žaidimai',
				description: 'Nėra žaidimų!',
				placement: 'bottomRight'
			});

        this.setState({ isModalVisible: true}, async () => {
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (this.reviewForm && this.reviewForm.current) {
                        this.reviewForm.current.resetFields();
                        this.reviewForm.current.setFieldsValue({ id_atsiliepimai: uniqid() });
                        clearInterval(interval);
                        resolve();
                    }
                }, 0);
            });
        });
    }

    addReview(values) {
        const userReviews = [...this.state.userReviews];

        const index = userReviews.findIndex((review) => review.id_atsiliepimai === values.id_atsiliepimai);
        if (index > -1) {
            userReviews[index] = values;

            return this.setState({ 
                userReviews: [...userReviews],
                isModalVisible: false
            });
        }

        userReviews.push(values);
        this.setState({ 
            userReviews: [...userReviews],
            isModalVisible: false
        });
    }

    editReview(reviewId) {
        const userReviews = [...this.state.userReviews];

        const index = userReviews.findIndex((review) => review.id_atsiliepimai === reviewId);
        if (index < 0) return;

        const review = userReviews[index];

        this.setState({ isModalVisible: true}, async () => {
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (this.reviewForm && this.reviewForm.current) {
                        this.reviewForm.current.resetFields();
                        this.reviewForm.current.setFieldsValue({...review});
                        clearInterval(interval);
                        resolve();
                    }
                }, 0);
            });
        });
    }

    removeReview(reviewId) {
        const userReviews = [...this.state.userReviews];

        const index = userReviews.findIndex((user) => user.id_atsiliepimai === reviewId);
        if (index < 0) return;
        userReviews.splice(index, 1);

        this.setState({ userReviews: [...userReviews] });
	}

	selectGames() {
        socket.emit(tables.games, 'selectAll', null, (games) => {
            if (!games) return;
            if (games.length === 0) this.props.back();

			const gameList = [...games];
	
			gameList.map((game) => {
				return game.key = game.id_zaidimai;
			});
	
			this.setState({ games: [...gameList] }, async () => {
                await new Promise((resolve) => {
					const interval = setInterval(() => {
						if (this.reviewForm && this.reviewForm.current) {
							this.reviewForm.current.setFieldsValue({ fk_zaidimaiid_zaidimai: gameList[0].id_zaidimai });
							clearInterval(interval);
							resolve();
						}
					}, 0);
				});
            });
		});
    }
	
	selectGame(gameId) {
		if (!gameId) return;

        const game = this.state.games.find((game) => game.id_zaidimai === gameId);
		if (!game) return;

		new Promise((resolve) => {
			const interval = setInterval(() => {
				if (this.reviewForm && this.reviewForm.current) {
					this.reviewForm.current.setFieldsValue({ fk_zaidimaiid_zaidimai: game.id_zaidimai });
					clearInterval(interval);
					resolve();
				}
			}, 0);
		});
    }

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='Varotojai'
					subTitle='Užregistruoti internetinės parduotuvės vartotojai'
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
					extra={[
                        <Button key='createUser' type='primary' onClick={() => this.userForm.current.submit()}>
						 	Sukurti vartotoją
						</Button>,
                        <Button key='addNewReview' onClick={this.addNewReview.bind(this)}>
						 	Pridėti naują atsiliepimą
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
                                ref={this.userForm}
                                {...formItemLayout}
                                onFinish={this.onFinish.bind(this)}
                                scrollToFirstError
                                initialValues={{
									paskutinis_prisijungimas: moment(),
									registracijos_data: moment()
                                }}
                            >
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
                            dataSource={this.state.userReviews}
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
				{this.state.games.length === 0 ? '' :
                <Modal
                    title='Atsiliepimas'
                    centered
                    visible={this.state.isModalVisible}
                    onCancel={() => this.setState({ isModalVisible: false })}
                    footer={[
                        <Button key='cancel' onClick={() => this.setState({ isModalVisible: false })}>
                            Grįžti
                        </Button>,
                        <Button key='submit' type='primary' onClick={() => this.reviewForm.current.submit()}>
                            Patvirtinti
                        </Button>
                    ]}
                >
                    <Form
                        ref={this.reviewForm}
                        {...formItemLayout}
                        onFinish={this.addReview.bind(this)}
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
									return <Select.Option value={game.id_zaidimai}>{game.pavadinimas} ({game.platforma})</Select.Option>;
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
                </Modal>}
            </div>
        );
    }
    
}