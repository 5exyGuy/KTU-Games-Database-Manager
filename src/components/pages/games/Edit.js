import React, { Component } from 'react';
import { PageHeader, Form, Input, Button, Card, Row, Col, Select, DatePicker } from 'antd';
import socket from '../../../socket';
import { tables } from '../../../tables';
import { genres, gamemodes, platforms } from '../../../enums';
import moment from 'moment';

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

export default class EditForm extends Component {

    state = {
        devs: []
    };

    constructor(props) {
        super(props);

        this.form = React.createRef();
    }

    componentDidMount() {
        this.selectDevs();
    }

	onFinish(values) {
		socket.emit(tables.games, 'update', values, (result) => {
			if (!result) return;
			this.props.back();
		});
    }

    selectDevs() {
        socket.emit(tables.developers, 'selectAll', null, (devs) => {
            if (!devs) return this.setState({ devs: [] });
            if (devs.length === 0) this.props.back();

			const devList = [...devs];
	
			devList.map((dev) => {
				return dev.key = dev.id_kurejai;
			});

            this.setState({ devs: [...devList] }, () => {
                if (this.form && this.form.current)
                    this.form.current.setFieldsValue({ fk_kurejaiid_kurejai: devList[0].id_kurejai });
            });
		});
    }

    selectDev(devId) {
        const dev = this.state.devs.find((dev) => dev.id_kurejai === devId);
        if (!dev) return;
        if (this.form && this.form.current)
            this.form.current.setFieldsValue({ fk_kurejaiid_kurejai: dev.id_kurejai });
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
						<Button onClick={() => this.props.back()}>
						 	Grįžti
						</Button>
					]}
				/>
				<Row justify='center' style={{ padding: '10px', marginLeft: '0px', marginRight: '0px' }}>
                    <Col span={12}>
                        <Card style={{ backgroundColor: 'rgb(225, 225, 225)' }}>
                            <Form
                                ref={this.form}
                                {...formItemLayout}
                                onFinish={this.onFinish.bind(this)}
                                scrollToFirstError
                                initialValues={{
                                    id_zaidimai: this.props.data.id_zaidimai,
                                    fk_kurejaiid_kurejai: this.props.data.fk_kurejaiid_kurejai,
                                    pavadinimas: this.props.data.pavadinimas,
                                    isleidimo_data: moment(this.props.data.isleidimo_data),
                                    kaina: this.props.data.kaina,
                                    varikliukas: this.props.data.varikliukas,
                                    zanras: this.props.data.zanras,
                                    rezimas: this.props.data.rezimas,
                                    platforma: this.props.data.platforma
                                }}
                            >
                                <Form.Item
                                    key='id_zaidimai'
                                    name='id_zaidimai'
                                    label='ID'
                                    rules={[{ required: true, message: 'Įveskite žaidimo ID!' }]}
                                >
                                    <Input type='number' disabled />
                                </Form.Item>

                                <Form.Item
                                    key='fk_kurejaiid_kurejai'
                                    name='fk_kurejaiid_kurejai'
                                    label='Kūrėjas'
                                    rules={[{ required: true, message: 'Pasirinkite kūrėją!' }]}
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

                                <Form.Item key='redaguoti' {...tailFormItemLayout}>
                                    <Button type='primary' htmlType='submit'>
                                        Redaguoti
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