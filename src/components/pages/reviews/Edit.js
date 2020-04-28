import React, { Component } from 'react';
import { PageHeader, Form, Button, Card, Row, Col, Select, DatePicker, Rate, Input } from 'antd';
import socket from '../../../socket';
import { tables } from '../../../tables';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';

const formItemLayout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
};

export default class EditForm extends Component {

    state = {
        games: [],
        users: []
    };

    constructor(props) {
        super(props);

        this.reviewForm = React.createRef();
    }

    componentDidMount() {
        this.selectGames();
        this.selectUsers();
    }

	onFinish(values) {
		socket.emit(tables.reviews, 'update', values, (result) => {
			if (!result) return;
			this.props.back();
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
	
			this.setState({ games: [...gameList] }, () => {
                if (this.reviewForm && this.reviewForm.current)
                    this.reviewForm.current.setFieldsValue({ fk_zaidimaiid_zaidimai: gameList[0].id_zaidimai });
            });
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
	
			this.setState({ users: [...userList] }, () => {
                if (this.reviewForm && this.reviewForm.current)
                    this.reviewForm.current.setFieldsValue({ fk_vartotojaiid_vartotojai: userList[0].id_vartotojai });
            });
		});
    }

    selectGame(gameId) {
        const game = this.state.games.find((game) => game.id_zaidimai === gameId);
        if (!game) return;
        if (this.reviewForm && this.reviewForm.current)
            this.reviewForm.current.setFieldsValue({ fk_zaidimaiid_zaidimai: game.id_zaidimai });
    }

    selectUser(userId) {
        const user = this.state.users.find((user) => user.id_vartotojai === userId);
        if (!user) return;
        if (this.reviewForm && this.reviewForm.current)
            this.reviewForm.current.setFieldsValue({ fk_vartotojaiid_vartotojai: user.id_vartotojai });
    }

	render() {
        if (this.state.games.length === 0 || this.state.users.length === 0) 
            return (<div></div>);

        return (
            <div>
				<PageHeader
					ghost={false}
					title='Atsiliepimai'
                    subTitle='Vartotojų atsiliepimai apie žaidimus'
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
					extra={[
                        <Button type='primary' onClick={() => this.reviewForm.current.submit()}>
						 	Redaguoti atsiliepimą
						</Button>,
						<Button onClick={() => this.props.back()}>
						 	Grįžti
						</Button>
					]}
				/>
				<Row justify='center' style={{ padding: '10px', marginLeft: '0px', marginRight: '0px' }}>
                    <Col span={12}>
                        <Card style={{ backgroundColor: 'rgb(225, 225, 225)' }}>
                            <Form
                                ref={this.reviewForm}
                                {...formItemLayout}
                                onFinish={this.onFinish.bind(this)}
                                scrollToFirstError
                                initialValues={{
                                    id_atsiliepimai: this.props.data.id_atsiliepimai,
                                    fk_zaidimaiid_zaidimai: this.props.data.fk_zaidimaiid_zaidimai,
                                    fk_vartotojaiid_vartotojai: this.props.data.fk_vartotojaiid_vartotojai,
                                    ivertinimas: this.props.data.ivertinimas,
                                    komentaras: this.props.data.komentaras,
                                    data:  moment(this.props.data.data)
                                }}
                            >
                                <Form.Item
                                    key='id_atsiliepimai'
                                    name='id_atsiliepimai'
                                    label='ID'
                                    rules={[{ required: true, message: 'Įveskite atsiliepimo ID!' }]}
                                >
                                    <Input disabled />
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
                        </Card>
                    </Col>
				</Row>
            </div>
        );
    }
    
}