import React, { Component } from 'react';
import { PageHeader, Form, Input, Button, Card, Row, Col, Select, DatePicker, notification } from 'antd';
import socket from '../../../socket';
import { tables } from '../../../tables';
import { paymentMethods } from '../../../enums';
import moment from 'moment';

const formItemLayout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
};

export default class CreateForm extends Component {

    state = {
        orders: [],
        users: []
    };

    constructor(props) {
        super(props);

        this.paymentForm = React.createRef();
    }

    componentDidMount() {
        this.selectOrders();
        this.selectUsers();
    }

	onFinish(values) {
		socket.emit(tables.payments, 'insert', values, (result) => {
			if (!result) return;
			this.props.back();
		});
    }

    selectOrders() {
        socket.emit(tables.orders, 'selectAll', null, (orders) => {
            if (!orders) {
                notification['warning']({
                    message: 'Užsakymai',
                    description: 'Nėra užsakymų!',
                    placement: 'bottomRight'
                });
                return this.props.back();
            }

			const orderList = [...orders];
	
			orderList.map((order) => {
				return order.key = order.id_uzsakymai;
			});
	
			this.setState({ orders: [...orderList] }, () => {
                if (this.paymentForm && this.paymentForm.current)
                    this.paymentForm.current.setFieldsValue({ fk_uzsakymaiid_uzsakymai: orderList[0].id_uzsakymai });
            });
		});
    }

    selectUsers() {
        socket.emit(tables.users, 'selectAll', null, (users) => {
			if (!users) {
                notification['warning']({
                    message: 'Vartotojai',
                    description: 'Nėra vartotojų!',
                    placement: 'bottomRight'
                });
                return this.props.back();
            }

			const userList = [...users];
	
			userList.map((user) => {
				return user.key = user.id_vartotojai;
            });
	
			this.setState({ users: [...userList] }, () => {
                if (this.paymentForm && this.paymentForm.current)
                    this.paymentForm.current.setFieldsValue({ fk_vartotojaiid_vartotojai: userList[0].id_vartotojai });
            });
		});
    }

    selectOrder(orderId) {
        const order = this.state.orders.find((order) => order.id_uzsakymai === orderId);
        if (!order) return;
        if (this.paymentForm && this.paymentForm.current) {
            this.paymentForm.current.setFieldsValue({ fk_uzsakymaiid_uzsakymai: order.id_uzsakymai });
            this.paymentForm.current.setFieldsValue({ kaina: order.kaina });
        }
    }

    selectUser(userId) {
        const user = this.state.users.find((user) => user.id_vartotojai === userId);
        if (!user) return;
        if (this.paymentForm && this.paymentForm.current)
            this.paymentForm.current.setFieldsValue({ fk_vartotojaiid_vartotojai: user.id_vartotojai });
    }

	render() {
        if (this.state.orders.length === 0 || this.state.users.length === 0) 
            return (<div></div>);

        return (
            <div>
				<PageHeader
					ghost={false}
					title='Mokėjimai'
                    subTitle='Vartotojų atlikti užsakymo mokėjimai'
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
					extra={[
                        <Button type='primary' onClick={() => this.paymentForm.current.submit()}>
						 	Sukurti mokėjimą
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
                                ref={this.paymentForm}
                                {...formItemLayout}
                                onFinish={this.onFinish.bind(this)}
                                scrollToFirstError
                                initialValues={{
                                    fk_uzsakymaiid_uzsakymai: this.state.orders[0].id_uzsakymai,
                                    fk_vartotojaiid_vartotojai: this.state.users[0].id_vartotojai,
                                    tipas: paymentMethods[0],
                                    data: moment(),
                                    kaina: this.state.orders[0].kaina
                                }}
                            >
                                <Form.Item
                                    key='fk_uzsakymaiid_uzsakymai'
                                    name='fk_uzsakymaiid_uzsakymai'
                                    label='Užsakymas'
                                    rules={[{ required: true, message: 'Pasirinkite užsakymą!' }]}
                                >
                                    <Select onChange={(order) => this.selectOrder(order)}>
                                        {this.state.orders.map((order) => {
                                            return <Select.Option value={order.id_uzsakymai}>{order.id_uzsakymai}</Select.Option>;
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
                                    key='tipas'
                                    name='tipas'
                                    label='Apmokėjimo būdas'
                                    rules={[{ required: true, message: 'Pasirinkite apmokėjimo būdą!' }]}
                                >
                                    <Select>
                                        {paymentMethods.map((method) => {
                                            return <Select.Option value={method}>{method}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    key='data'
                                    name='data'
                                    label='Apmokėjimo data'
                                    rules={[{ required: true, message: 'Pasirinkite apmokėjimo datą!' }]}
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
                                    <Input type='number' disabled />
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
				</Row>
            </div>
        );
    }
    
}