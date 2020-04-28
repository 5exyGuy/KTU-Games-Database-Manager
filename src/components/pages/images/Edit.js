import React, { Component } from 'react';
import { PageHeader, Form, Input, Button, Card, Row, Col, Select } from 'antd';
import socket from '../../../socket';
import { tables } from '../../../tables';

const formItemLayout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
};

export default class EditForm extends Component {

    state = {
        games: []
    };

    constructor(props) {
        super(props);

        this.imageForm = React.createRef();
    }

    componentDidMount() {
        this.selectGames();
    }

	onFinish(values) {
		socket.emit(tables.images, 'update', values, (result) => {
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
                if (this.imageForm && this.imageForm.current)
                    this.imageForm.current.setFieldsValue({ fk_zaidimaiid_zaidimai: gameList[0].id_zaidimai });
            });
		});
    }

    selectGame(gameId) {
        const game = this.state.games.find((game) => game.id_zaidimai === gameId);
        if (!game) return;
        if (this.imageForm && this.imageForm.current)
            this.imageForm.current.setFieldsValue({ fk_zaidimaiid_zaidimai: game.id_zaidimai });
    }

	render() {
        if (this.state.games.length === 0) 
            return (<div></div>);

        return (
            <div>
				<PageHeader
					ghost={false}
					title='Nuotraukos'
                    subTitle='Žaidimų nuotraukos'
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
					extra={[
                        <Button type='primary' onClick={() => this.imageForm.current.submit()}>
						 	Redaguoti nuotrauką
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
                                ref={this.imageForm}
                                {...formItemLayout}
                                onFinish={this.onFinish.bind(this)}
                                scrollToFirstError
                                initialValues={{
                                    id_nuotraukos: this.props.data.id_nuotraukos,
                                    fk_zaidimaiid_zaidimai: this.props.data.fk_zaidimaiid_zaidimai,
                                    nuoroda: this.props.data.nuoroda
                                }}
                            >
                                <Form.Item
                                    name='id_nuotraukos'
                                    label='ID'
                                    rules={[{ required: true, message: 'Įveskite nuotraukos ID!' }]}
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
                                            return <Select.Option value={game.id_zaidimai}>{game.pavadinimas}</Select.Option>;
                                        })}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name='nuoroda'
                                    label='Nuoroda'
                                    rules={[{ required: true, message: 'Įveskite nuotraukos nuorodą!', whitespace: false, min: 10, max: 255 }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
    
}