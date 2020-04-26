import React, { Component } from 'react';
import { PageHeader, Form, Input, Button, Card, Row, Col, Select, DatePicker, Checkbox, Modal, List } from 'antd';
import socket from '../../../socket';
import { tables } from '../../../tables';
import moment from 'moment';

const formItemLayout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
};

const tailFormItemLayout = {
	wrapperCol: {
		span: 16,
		offset: 8
	}
};

export default class CreateForm extends Component {

    state = {
        users: [],
        isModalVisible: false
    };

    constructor(props) {
        super(props);

        this.groupForm = React.createRef();
        this.userForm = React.createRef();
    }

	onFinish(values) {
		socket.emit(tables.groups, 'insert', values, (result) => {
			if (!result) return;
            
            const users = [...this.state.users];

            users.forEach(async (user) => {
                await new Promise((resolve) => {
                    user.fk_grupesid_grupes = result.id_grupes;
                    socket.emit(tables.users, 'insert', user, (result) => resolve(result));
                });
            });

            this.props.back();
		});
    }

    addUser(values) {
        const users = [...this.state.users];

        const user = users.find((user) => 
            user.slapyvardis === values.slapyvardis || 
            user.el_pastas === values.el_pastas
        );
        if (user) {
            this.setState({ isModalVisible: false });
            return;
        }

        users.push(values);
        this.setState({ 
            users: [...users],
            isModalVisible: false
        });
    }

    editUser(username) {
        const users = [...this.state.users];

        const index = users.findIndex((user) => user.slapyvardis === username);
        if (index < 0) return;

        const user = users[index];

        this.userForm.current.setFieldsValue({...user});
        this.setState({ isModalVisible: true });
    }

    removeUser(username) {
        const users = [...this.state.users];

        const index = users.findIndex((user) => user.slapyvardis === username);
        if (index < 0) return;
        users.splice(index, 1);

        this.setState({ users: [...users] });
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
                        <Button key='create' type='primary' onClick={() => this.groupForm.current.submit()}>
						 	Sukurti grupę
						</Button>,
                        <Button key='addUser' onClick={() => { 
                            if (this.userForm && this.userForm.current) this.userForm.current.resetFields(); 
                            this.setState({ isModalVisible: true })}
                        }>
						 	Pridėti naują vartotoją
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
                                ref={this.groupForm}
                                {...formItemLayout}
                                onFinish={this.onFinish.bind(this)}
                                scrollToFirstError
                            >
                                <Form.Item
									name='pavadinimas'
									label='Pavadinimas'
									rules={[{ required: true, message: 'Įveskite grupės pavadinimą!', whitespace: false, min: 5, max: 255 }]}
								>
									<Input />
								</Form.Item>
                            </Form>
                        </Card>
                    </Col>
				</Row>
                <Row justify='center' style={{ padding: '10px', marginLeft: '0px', marginRight: '0px' }}>
                    <Col span={12}>
                        <List
                            bordered
                            dataSource={this.state.users}
                            renderItem={user => (
                                <List.Item actions={[
                                    // eslint-disable-next-line
                                    <a key='edit' onClick={this.editUser.bind(this, user.slapyvardis)}>redaguoti</a>, 
                                    // eslint-disable-next-line
                                    <a key='remove' onClick={this.removeUser.bind(this, user.slapyvardis)}>šalinti</a>
                                ]}>
                                    {user.slapyvardis}
                                    {/* <List.Item.Meta
                                        avatar={
                                            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                        }
                                        title={<a href="https://ant.design">{item.name.last}</a>}
                                        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                    /> */}
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
                <Modal
                    title='Naujas vartotojas'
                    centered
                    visible={this.state.isModalVisible}
                    onOk={this.handleOk}
                    onCancel={() => this.setState({ isModalVisible: false })}
                    footer={[
                        <Button key='cancel' onClick={() => this.setState({ isModalVisible: false })}>
                            Grįžti
                        </Button>,
                        <Button key='submit' type='primary' onClick={() => this.userForm.current.submit()}>
                            Patvirtinti
                        </Button>
                    ]}
                >
                    <Form
                        ref={this.userForm}
                        {...formItemLayout}
                        onFinish={this.addUser.bind(this)}
                        scrollToFirstError
                        initialValues={{
                            registracijos_data: moment(),
                            paskutinis_prisijungimas: moment(),
                            balansas: 0,
                            aktyvuotas: false
                        }}
                    >
                        <Form.Item
                            key='username'
                            name='slapyvardis'
                            label='Slapyvardis'
                            rules={[{ required: true, message: 'Įveskite slapyvardį!', whitespace: false, min: 5, max: 255 }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            key='email'
                            name='el_pastas'
                            label='El. paštas'
                            rules={[
                                {
                                    type: 'email',
                                    message: 'Neteisingai įvedėte el. paštą!',
                                },
                                {
                                    required: true,
                                    message: 'Įveskite el. paštą!',
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            key='password'
                            name='slaptazodis'
                            label='Slaptažodis'
                            rules={[
                                {
                                    required: true,
                                    message: 'Įveskite slaptažodį!'
                                }
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            key='lastLogin'
                            name='paskutinis_prisijungimas'
                            label='Paskutinis prisijungimas'
                        >
                            <DatePicker
                                format='YYYY-MM-DD HH:mm:ss'
                                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                            />
                        </Form.Item>

                        <Form.Item
                            key='registration'
                            name='registracijos_data'
                            label='Registracijos data'
                        >
                            <DatePicker
                                format='YYYY-MM-DD HH:mm:ss'
                                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                            />
                        </Form.Item>

                        <Form.Item
                            key='balance'
                            name='balansas'
                            label='Balansas'
                            rules={[
                                {
                                    required: true,
                                    message: 'Įveskite balansą!'
                                }
                            ]}
                        >
                            <Input type='number' />
                        </Form.Item>
            
                        <Form.Item
                            key='activated'
                            name='aktyvuotas'
                            valuePropName='checked'
                            {...tailFormItemLayout}
                        >
                            <Checkbox>
                                Ar aktyvuoti vartotoją?
                            </Checkbox>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
    
}