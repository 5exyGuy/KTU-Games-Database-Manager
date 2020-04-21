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
		socket.emit(tables.orders, 'insert', values, (result) => {
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
					title='Užsakymai'
                    subTitle='Vartotojų užsakymai'
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
                                    name='id_vartotojai'
                                    label='Pirkėjas'
                                    rules={[{ required: true, message: 'Pasirinkite užsakymo būseną!' }]}
                                >
                                    <Select mode='multiple'>
                                        {genres.map((genre) => {
                                            return <Select.Option value={genre}>{genre}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name='data'
                                    label='Užsakymo data'
                                    rules={[{ required: true, message: 'Pasirinkite užsakymo datą!' }]}
                                >
                                    <DatePicker />
                                </Form.Item>
                                <Form.Item
                                    name='busena'
                                    label='Būsena'
                                    rules={[{ required: true, message: 'Pasirinkite užsakymo būseną!' }]}
                                >
                                    <Select mode='multiple'>
                                        {genres.map((genre) => {
                                            return <Select.Option value={genre}>{genre}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name='vat'
                                    label='VAT'
                                >
                                    <Input type='number' />
                                </Form.Item>
                                <Form.Item
                                    name='kaina'
                                    label='Kaina'
                                    rules={[{ required: true, message: 'Įveskite kainą!' }]}
                                >
                                    <Input type='number' disabled />
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
                                layout="inline"
                                initialValues={{
                                    price: {
                                    number: 0,
                                    currency: 'rmb',
                                    },
                                }}
                            >
                                <Form.Item name='kiekis' label='Kiekis'>
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name='id_zaidimai'
                                    label='Žaidimas'
                                    rules={[{ required: true, message: 'Pasirinkite žaidimą!' }]}
                                >
                                    <Select defaultValue='test'>
                                        <Select.Option value='test'>test</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item>
                                    <Button type='danger' htmlType='submit'>
                                        Šalinti
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
				</Row>
            </div>
        );
    }
    
}