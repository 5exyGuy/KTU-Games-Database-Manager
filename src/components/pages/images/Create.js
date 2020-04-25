import React, { Component } from 'react';
import { PageHeader, Form, Input, Button, Card, Row, Col, Select } from 'antd';
import socket from '../../../socket';
import { tables } from '../../../tables';

export default class CreateForm extends Component {

    state = {
        games: [],
        images: [
            {
                form: React.createRef(),
                id: 0
            }
        ]
    };

    componentDidMount() {
        this.selectGames();
    }

	onFinish(values) {
		socket.emit(tables.images, 'insert', values, (result) => {
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

    insertImage() {
        const images = [...this.state.images];
        
        let maxId = images[0].id;

        images.forEach((images) => {
            if (images.id > maxId) {
                maxId = images.id;
            }
        });

        images.push({ form: React.createRef(), id: maxId + 1, url: '' });
        this.setState({ images: [...images] });
    }

    removeImage(imageId) {
        const images = [...this.state.images];
        if (images.length <= 1) return;

        const index = images.findIndex((image) => image.id === imageId);
        if (index > -1) images.splice(index, 1);

        this.setState({ images: [...images] });
    }

    addImages() {
        const images = [...this.state.images];

        images.forEach((image) => {
            image.form.current.submit()
        });
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
                        <Button type='primary' shape='round' onClick={this.addImages.bind(this)}>
						 	Pridėti nuotraukas
                        </Button>,
                        <Button shape='round' onClick={this.insertImage.bind(this)}>
                            Įterpti naują
                        </Button>,
						<Button shape='round' onClick={() => this.props.back()}>
						 	Grįžti
						</Button>
					]}
				/>
                {this.state.images.map(image => {
				    return (<Row justify='center' style={{ padding: '10px', marginLeft: '0px', marginRight: '0px' }}>
                        <Col span={12}>
                            <Card style={{ backgroundColor: 'rgb(225, 225, 225)' }}>
                                <Form
                                    ref={image.form}
                                    onFinish={this.onFinish.bind(this)}
                                    scrollToFirstError
                                    initialValues={{
                                        fk_zaidimaiid_zaidimai: this.state.games[0].id_zaidimai
                                    }}
                                    layout='inline'
                                >
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

                                    <Form.Item key='salinti'>
                                        <Button type='danger' shape='round' onClick={this.removeImage.bind(this, image.id)}>
                                            Šalinti
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
				    </Row>);
                })}
            </div>
        );
    }
    
}