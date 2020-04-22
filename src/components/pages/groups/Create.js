import React, { Component } from 'react';
import { PageHeader, Form, Input, Button, Card, Row, Col, Select, DatePicker } from 'antd';
import socket from '../../../socket';
import { tables } from '../../../tables';
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

export default class CreateForm extends Component {

    state = {
        orders: [],
        users: []
    };

    constructor(props) {
        super(props);

        this.form = React.createRef();
    }

    componentDidMount() {
        this.selectUsers();
    }

	onFinish(values) {
		socket.emit(tables.groups, 'insert', values, (result) => {
			if (!result) return;
			this.props.back();
		});
    }

    selectUsers() {
        socket.emit(tables.users, 'selectAll', null, (users) => {
			if (!users) return this.setState({ users: [] });

			const userList = [...users];
	
			userList.map((user) => {
				return user.key = user.id_vartotojai;
            });
	
			this.setState({ users: [...userList] }, () => {
                if (this.form && this.form.current)
                    this.form.current.setFieldsValue({ fk_vartotojaiid_vartotojai: userList[0].id_vartotojai });
            });
		});
    }

    selectUser(userId) {
        const user = this.state.users.find((user) => user.id_vartotojai === userId);
        if (!user) return;
        if (this.form && this.form.current)
            this.form.current.setFieldsValue({ fk_vartotojaiid_vartotojai: user.id_vartotojai });
    }

	render() {
        if (this.state.users.length === 0) 
            return (<div></div>);

        return (
            <div>
				<PageHeader
					ghost={false}
					title='Grupės'
                    subTitle='Vartotojų sukurtos grupės'
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
                                ref={this.form}
                                {...formItemLayout}
                                onFinish={this.onFinish.bind(this)}
                                scrollToFirstError
                                initialValues={{
                                    fk_vartotojaiid_vartotojai: this.state.users[0].id_vartotojai,
                                    ikurimo_data: moment()
                                }}
                            >
                                <Form.Item
                                    key='fk_vartotojaiid_vartotojai'
                                    name='fk_vartotojaiid_vartotojai'
                                    label='Savininkas'
                                    rules={[{ required: true, message: 'Pasirinkite grupės savininką!' }]}
                                >
                                    <Select onChange={(user) => this.selectUser(user)}>
                                        {this.state.users.map((user) => {
                                            return <Select.Option value={user.id_vartotojai}>{user.slapyvardis}</Select.Option>;
                                        })}
                                    </Select>
                                </Form.Item>

                                <Form.Item
									name='pavadinimas'
									label='Pavadinimas'
									rules={[{ required: true, message: 'Įveskite grupės pavadinimą!', whitespace: false, min: 5, max: 255 }]}
								>
									<Input />
								</Form.Item>

                                <Form.Item
                                    key='ikurimo_data'
                                    name='ikurimo_data'
                                    label='Įkūrimo data'
                                    rules={[{ required: true, message: 'Pasirinkite grupės įkūrimo datą!' }]}
                                >
                                    <DatePicker
                                        format="YYYY-MM-DD HH:mm:ss"
                                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                    />
                                </Form.Item>

                                <Form.Item key='sukurti' {...tailFormItemLayout}>
                                    <Button type='primary' htmlType='submit'>
                                        Sukurti
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