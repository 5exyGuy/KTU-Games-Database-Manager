import React, { Component } from 'react';
import { PageHeader, Form, Input, Button, Card, Row, Col, Select, DatePicker, Modal, List, notification } from 'antd';
import socket from '../../../socket';
import { tables } from '../../../tables';
import moment from 'moment';
import { genres, gamemodes, platforms } from '../../../enums';
import uniqid from 'uniqid';

const formItemLayout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
};

export default class CreateForm extends Component {

    state = {
        devs: [],
        gameImages: [],
        isModalVisible: false
    };

    constructor(props) {
        super(props);

        this.gameForm = React.createRef();
        this.imageForm = React.createRef();
    }

    componentDidMount() {
        this.selectDevs();
    }

	onFinish(values) {
		socket.emit(tables.games, 'insert', values, (result) => {
			if (!result) return;
            
            const gameImages = [...this.state.gameImages];

            gameImages.forEach(async (image) => {
                await new Promise((resolve) => {
                    image.fk_zaidimaiid_zaidimai = result.id_zaidimai;
                    socket.emit(tables.images, 'insert', image, (result) => resolve(result));
                });
            });

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

    selectDevs() {
        socket.emit(tables.developers, 'selectAll', null, (devs) => {
            if (!devs) return this.props.back();
            if (devs && devs.length === 0) {
                notification['warning']({
                    message: 'Kūrėjai',
                    description: 'Nėra kūrėjų!',
                    placement: 'bottomRight'
                });
                return this.props.back();
            }

			const devList = [...devs];

            this.setState({ devs: [...devList] }, async () => {
                await new Promise((resolve) => {
					const interval = setInterval(() => {
						if (this.gameForm && this.gameForm.current) {
							this.gameForm.current.setFieldsValue({ fk_kurejaiid_kurejai: devList[0].id_kurejai });
							clearInterval(interval);
							resolve();
						}
					}, 0);
				});
            });
		});
    }

    selectDev(devId) {
        const dev = this.state.devs.find((dev) => dev.id_kurejai === devId);
        if (!dev) return;

        new Promise((resolve) => {
            const interval = setInterval(() => {
                if (this.gameForm && this.gameForm.current) {
                    this.gameForm.current.setFieldsValue({ fk_kurejaiid_kurejai: dev.id_kurejai });
                    clearInterval(interval);
                    resolve();
                }
            }, 0);
        });
    }

	render() {
        if (this.state.devs.length === 0) 
            return (<div></div>);

        return (
            <div>
				<PageHeader
					ghost={false}
					title='Žaidimai'
                    subTitle='Parduodami žaidimai'
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
					extra={[
                        <Button key='create' type='primary' onClick={() => this.gameForm.current.submit()}>
						 	Pridėti žaidimą
						</Button>,
                        <Button key='addImage' onClick={this.addNewImage.bind(this)}>
						 	Pridėti naują nuotrauką
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
                                ref={this.gameForm}
                                {...formItemLayout}
                                onFinish={this.onFinish.bind(this)}
                                scrollToFirstError
                                initialValues={{
                                    fk_kurejaiid_kurejai: this.state.devs[0].id_kurejai,
                                    isleidimo_data: moment(),
                                    platforma: platforms[0]
                                }}
                            >
                                <Form.Item
                                    key='fk_kurejaiid_kurejai'
                                    name='fk_kurejaiid_kurejai'
                                    label='Kūrėjas'
                                    rules={[{ required: true, message: 'Pasirinkite žaidimo kūrėją!' }]}
                                >
                                    <Select onChange={(dev) => this.selectDev(dev)}>
                                        {this.state.devs.map((dev) => {
                                            return <Select.Option value={dev.id_kurejai}>{dev.pavadinimas}</Select.Option>;
                                        })}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    key='pavadinimas'
                                    name='pavadinimas'
                                    label='Pavadinimas'
                                    rules={[{ required: true, message: 'Įveskite pavadinimą!', min: 5, max: 255 }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    key='isleidimo_data'
                                    name='isleidimo_data'
                                    label='Išleidimo data'
                                    rules={[{ required: true, message: 'Pasirinkite išleidimo datą!' }]}
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
                                    key='varikliukas'
                                    name='varikliukas'
                                    label='Varikliukas'
                                    rules={[{ required: true, message: 'Įveskite varikliuką!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    key='zanras'
                                    name='zanras'
                                    label='Žanras'
                                    rules={[{ required: true, message: 'Pasirinkite žanrą!' }]}
                                >
                                    <Select mode='multiple'>
                                        {genres.map((genre) => {
                                            return <Select.Option value={genre}>{genre}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    key='rezimas'
                                    name='rezimas'
                                    label='Režimas'
                                    rules={[{ required: true, message: 'Pasirinkite rėžimą!' }]}
                                >
                                    <Select mode='multiple'>
                                        {gamemodes.map((gamemode) => {
                                            return <Select.Option value={gamemode}>{gamemode}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    key='platforma'
                                    name='platforma'
                                    label='Platforma'
                                    rules={[{ required: true, message: 'Pasirinkite platformą!' }]}
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
                        <List
                            bordered
                            dataSource={this.state.gameImages}
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