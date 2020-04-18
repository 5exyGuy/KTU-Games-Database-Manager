import React, { Component } from 'react';
import { PageHeader, Form, Input, Button, Card, Row, Col, Select, DatePicker } from 'antd';
import socket from '../../../socket';
import { tables } from '../../../tables';
import { genres, gamemodes, platforms } from '../../../enums';

const formItemLayout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
};

const tailFormItemLayout = {
	wrapperCol: {
		span: 8,
		offset: 8
	}
};

export default class CreateForm extends Component {

    state = {
        devs: [],
        pubs: [],
        currentDev: 0,
        currentPub: 0
    };

    componentDidMount() {
        this.selectDevs();
        this.selectPubs();
    }

	onFinish(values) {
		socket.emit(tables.games, 'insert', values, (result) => {
			if (!result) return;
			this.props.back();
		});
    }

    selectDevs() {
        socket.emit(tables.developers, 'selectAll', null, (devs) => {
			if (!devs) return this.setState({ devs: [] });

			const devList = [...devs];
	
			devList.map((dev) => {
				return dev.key = dev.id_kurejai;
			});
	
			this.setState({ 
                devs: [...devList],
                currentDev: devList[0].id_kurejai
            });
		});
    }

    selectPubs() {
        socket.emit(tables.publishers, 'selectAll', null, (pubs) => {
			if (!pubs) return this.setState({ pubs: [] });

			const pubList = [...pubs];
	
			pubList.map((pub) => {
				return pub.key = pub.id_leidejai;
			});
	
			this.setState({ 
                pubs: [...pubList],
                currentPub: pubList[0].id_leidejai
            });
		});
    }

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='Žaidimai'
                    subTitle='Parduodami žaidimai'
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
					extra={[
						<Button onClick={() => this.props.back()}>
						 	Grįžti
						</Button>
					]}
				/>
				<Row gutter={24} style={{ padding: '10px', marginLeft: 'px', marginRight: '0px' }}>
                    <Col span={12}>
                        <Card style={{ backgroundColor: 'rgb(225, 225, 225)' }}>
                            <Form
                                {...formItemLayout}
                                onFinish={this.onFinish.bind(this)}
                                scrollToFirstError
                                initialValues={{
                                    zanras: genres[0],
                                    rezimas: gamemodes[0],
                                    platforma: platforms[0]
                                }}
                            >
                                <Form.Item
                                    name='pavadinimas'
                                    label='Pavadinimas'
                                    rules={[{ required: true, message: 'Įveskite pavadinimą!', min: 5, max: 255 }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name='isleidimo_data'
                                    label='Išleidimo data'
                                    rules={[{ required: true, message: 'Pasirinkite išleidimo datą!' }]}
                                >
                                    <DatePicker />
                                </Form.Item>
                                <Form.Item
                                    name='kaina'
                                    label='Kaina'
                                    rules={[{ required: true, message: 'Įveskite kainą!' }]}
                                >
                                    <Input type='number' />
                                </Form.Item>
                                <Form.Item
                                    name='varikliukas'
                                    label='Varikliukas'
                                    rules={[{ required: true, message: 'Įveskite varikliuką!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
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
                                <Form.Item {...tailFormItemLayout}>
                                    <Button type='primary' htmlType='submit'>
                                        Sukurti
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card style={{ backgroundColor: 'rgb(225, 225, 225)' }}>
                            <Form
                                {...formItemLayout}
                                scrollToFirstError
                            >
                                <Form.Item
                                    name='fk_kurejaiid_kurejai'
                                    label='Kūrėjas'
                                    rules={[{ required: true, message: 'Pasirinkite kūrėją!' }]}
                                >
                                    <Select defaultValue={this.state.currentDev} onChange={(dev) => this.setState({ currentDev: dev })}>
                                        {this.state.devs.map((dev) => {
                                            return <Select.Option value={dev.id_kurejai}>{dev.pavadinimas}</Select.Option>;
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name='fk_leidejaiid_leidejai'
                                    label='Leidėjas'
                                    rules={[{ required: true, message: 'Pasirinkite leidėją!' }]}
                                >
                                    <Select defaultValue={this.state.currentPub} onChange={(pub) => this.setState({ currentPub: pub })}>
                                        {this.state.pubs.map((pub) => {
                                            return <Select.Option value={pub.id_leidejai}>{pub.pavadinimas}</Select.Option>;
                                        })}
                                    </Select>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
				</Row>
            </div>
        );
    }
    
}