import React, { Component } from 'react';
import { PageHeader, Button, Row, Col, List, Input, Form, Modal, Select } from 'antd';
import socket from '../../../socket';
import { tables } from '../../../tables';
import uniqid from 'uniqid';

const formItemLayout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
};

export default class CreateForm extends Component {

    state = {
        games: [],
        images: []
    };

    constructor(props) {
        super(props);

        this.imageForm = React.createRef();
    }

    componentDidMount() {
        this.selectGames();
    }

	onFinish(values) {
		socket.emit(tables.images, 'insert', values, (result) => {
			if (!result) return;
			this.props.back();
		});
    }

    addNewImage() {
        this.setState({ isModalVisible: true }, async () => {
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (this.imageForm && this.imageForm.current) {
                        this.imageForm.current.resetFields();
                        this.imageForm.current.setFieldsValue({ id_nuotraukos: uniqid() });
                        clearInterval(interval);
                        resolve();
                    }
                }, 0);
            });
        });
    }

    addImage(values) {
        const gameImages = [...this.state.gameImages];

        const index = gameImages.findIndex((image) => image.id_nuotraukos === values.id_nuotraukos);
        if (index > -1) {
            gameImages[index] = values;

            return this.setState({ 
                gameImages: [...gameImages],
                isModalVisible: false
            });
        }

        gameImages.push(values);
        this.setState({ 
            gameImages: [...gameImages],
            isModalVisible: false
        });
    }

    editImage(imageId) {
        const gameImages = [...this.state.gameImages];

        const index = gameImages.findIndex((image) => image.id_nuotraukos === imageId);
        if (index < 0) return;

        const image = gameImages[index];

        this.setState({ isModalVisible: true}, async () => {
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (this.imageForm && this.imageForm.current) {
                        this.imageForm.current.resetFields();
                        this.imageForm.current.setFieldsValue({...image});
                        clearInterval(interval);
                        resolve();
                    }
                }, 0);
            });
        });
    }

    removeImage(imageId) {
        const gameImages = [...this.state.gameImages];

        const index = gameImages.findIndex((image) => image.id_nuotraukos === imageId);
        if (index < 0) return;
        gameImages.splice(index, 1);

        this.setState({ gameImages: [...gameImages] });
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
					title='Nuotraukos'
                    subTitle='Žaidimų nuotraukos'
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
					extra={[
                        <Button type='primary' onClick={() => this.onFinish()}>
						 	Sukurti nuotraukas
                        </Button>,
                        <Button onClick={() => this.addNewImage()}>
                            Pridėti naują nuotrauką
                        </Button>,
						<Button onClick={() => this.props.back()}>
						 	Grįžti
						</Button>
					]}
				/>
                <Row justify='center' style={{ padding: '10px', marginLeft: '0px', marginRight: '0px' }}>
                    <Col span={12}>
                        <List
                            bordered
                            dataSource={this.state.images}
                            renderItem={image => (
                                <List.Item actions={[
                                    // eslint-disable-next-line
                                    <a key='edit' onClick={this.editImage.bind(this, image.id_nuotraukos)}>redaguoti</a>, 
                                    // eslint-disable-next-line
                                    <a key='remove' onClick={this.removeImage.bind(this, image.id_nuotraukos)}>šalinti</a>
                                ]}>
                                    {image.nuoroda}
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
                <Modal
                    title='Nuotrauka'
                    centered
                    visible={this.state.isModalVisible}
                    onCancel={() => this.setState({ isModalVisible: false })}
                    footer={[
                        <Button key='cancel' onClick={() => this.setState({ isModalVisible: false })}>
                            Grįžti
                        </Button>,
                        <Button key='submit' type='primary' onClick={() => this.imageForm.current.submit()}>
                            Patvirtinti
                        </Button>
                    ]}
                >
                    <Form
                        ref={this.imageForm}
                        {...formItemLayout}
                        onFinish={this.addImage.bind(this)}
                        scrollToFirstError
                    >
                        <Form.Item
                            name='id_nuotraukos'
                            label='ID'
                            rules={[{ required: true, message: 'Įveskite nuotraukos ID!' }]}
                            style={{ display: 'none' }}
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
                            rules={[{ required: true, message: 'Įveskite nuotraukos nuorodą!', min: 5, max: 255 }]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
    
}