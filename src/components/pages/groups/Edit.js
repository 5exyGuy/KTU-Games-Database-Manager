import React, { Component } from 'react';
import { PageHeader, Form, Input, Button, Card, Row, Col, DatePicker, Modal, List, Checkbox } from 'antd';
import socket from '../../../socket';
import { tables } from '../../../tables';
import moment from 'moment';
import uniqid from 'uniqid';

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

export default class EditForm extends Component {

    state = {
        groupUsers: [],
        isModalVisible: false,
        creatingNew: false
    };

    constructor(props) {
        super(props);

        this.groupForm = React.createRef();
        this.userForm = React.createRef();
    }

    componentDidMount() {
        this.selectUsers(this.props.data.id_grupes);
    }

	onFinish(values) {
		socket.emit(tables.groups, 'update', values, (result) => {
			if (!result) return;
            
            const groupUsers = [...this.state.groupUsers];

            groupUsers.forEach(async (user) => {
                await new Promise((resolve) => {
                    user.fk_grupesid_grupes = values.id_grupes;
                    if (user.naujas) socket.emit(tables.users, 'insert', user, (result) => resolve(result));
                    else socket.emit(tables.users, 'update', user, (result) => resolve(result));
                });
            });

            this.props.back();
		});
    }

    addNewUser() {
        this.setState({ isModalVisible: true, creatingNew: true }, async () => {
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (this.userForm && this.userForm.current) {
                        this.userForm.current.resetFields();
                        this.userForm.current.setFieldsValue({ 
                            naujas: true,
                            id_vartotojai: uniqid()
                        });
                        clearInterval(interval);
                        resolve();
                    }
                }, 0);
            });
        });
    }

    addUser(values) {
        const groupUsers = [...this.state.groupUsers];

        const index = groupUsers.findIndex((user) => 
            user.id_vartotojai === values.id_vartotojai ||
            user.slapyvardis === values.slapyvardis || 
            user.el_pastas === values.el_pastas
        );
        if (index > -1) {
            groupUsers[index] = values;

            return this.setState({ 
                groupUsers: [...groupUsers],
                isModalVisible: false,
                creatingNew: false
            });
        }
        
        groupUsers.push(values);
        this.setState({ 
            groupUsers: [...groupUsers],
            isModalVisible: false,
            creatingNew: false
        });
    }

    editUser(userId) {
        const groupUsers = [...this.state.groupUsers];

        const index = groupUsers.findIndex((user) => user.id_vartotojai === userId);
        if (index < 0) return;

        const user = groupUsers[index];

        if (user.naujas) {
            return this.setState({ isModalVisible: true, creatingNew: true }, async () => {
                await new Promise((resolve) => {
                    const interval = setInterval(() => {
                        if (this.userForm && this.userForm.current) {
                            this.userForm.current.resetFields();
                            this.userForm.current.setFieldsValue({...user});
                            clearInterval(interval);
                            resolve();
                        }
                    }, 0);
                });
            });
        }

        return this.setState({ isModalVisible: true, creatingNew: false }, async () => {
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (this.userForm && this.userForm.current) {
                        this.userForm.current.resetFields();
                        this.userForm.current.setFieldsValue({...user});
                        clearInterval(interval);
                        resolve();
                    }
                }, 0);
            });
        });
    }

    removeUser(userId) {
        const groupUsers = [...this.state.groupUsers];
        const index = groupUsers.findIndex((user) => user.id_vartotojai === userId);
        if (index < 0) return;

        if (groupUsers[index].naujas) {
            groupUsers.splice(index, 1);
            return this.setState({ groupUsers: [...groupUsers] });
        }

        socket.emit(tables.images, 'deleteId', userId, (result) => {
            if (!result) return;
            this.selectUsers(this.props.data.id_grupes);
        });
    }

    selectUsers(groupId) {
        socket.emit(tables.groups, 'selectUsers', groupId, (users) => {
            if (!users) return this.setState({ groupUsers: [] });
            const groupUsers = [...users];

            groupUsers.map((user) => {
                user.naujas = false;
                return user;
            });

            this.setState({ groupUsers: [...groupUsers] });
        });
    }

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='Grupės'
                    subTitle='Vartotojų grupės'
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
					extra={[
                        <Button key='editGroup' type='primary' onClick={() => this.groupForm.current.submit()}>
						 	Redaguoti grupę
						</Button>,
                        <Button key='addNewUser' onClick={this.addNewUser.bind(this)}>
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
                                initialValues={{
                                    id_grupes: this.props.data.id_grupes,
                                    pavadinimas: this.props.data.pavadinimas,
                                }}
                            >
                                <Form.Item
                                    key='id_grupes'
                                    name='id_grupes'
                                    label='ID'
                                    rules={[{ required: true, message: 'Įveskite grupės ID!' }]}
                                >
                                    <Input type='number' disabled />
                                </Form.Item>

                                <Form.Item
                                    key='pavadinimas'
                                    name='pavadinimas'
                                    label='Pavadinimas'
                                    rules={[{ required: true, message: 'Įveskite pavadinimą!', min: 5, max: 255 }]}
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
                            dataSource={this.state.groupUsers}
                            renderItem={user => (
                                <List.Item actions={[
                                    // eslint-disable-next-line
                                    <a key='edit' onClick={this.editUser.bind(this, user.id_vartotojai)}>redaguoti</a>, 
                                    // eslint-disable-next-line
                                    <a key='remove' onClick={this.removeUser.bind(this, user.id_vartotojai)}>šalinti</a>
                                ]}>
                                    {user.slapyvardis}
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
                <Modal
                    title='Vartotojas'
                    centered
                    visible={this.state.isModalVisible}
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
                    >
                        <Form.Item
                            name='id_vartotojai'
                            label='ID'
                            rules={[{ required: true, message: 'Įveskite vartotojo ID!' }]}
                            style={{ display: 'none' }}
                        >
                            <Input type='number' disabled />
                        </Form.Item>

                        <Form.Item
                            name='slapyvardis'
                            label='Slapyvardis'
                            rules={[{ required: true, message: 'Įveskite slapyvardį!', whitespace: false, min: 5, max: 255 }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
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
                            name='paskutinis_prisijungimas'
                            label='Paskutinis prisijungimas'
                        >
                            <DatePicker
                                format="YYYY-MM-DD HH:mm:ss"
                                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                            />
                        </Form.Item>

                        <Form.Item
                            name='registracijos_data'
                            label='Registracijos data'
                        >
                            <DatePicker
                                format="YYYY-MM-DD HH:mm:ss"
                                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                            />
                        </Form.Item>

                        <Form.Item
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
                            name='aktyvuotas'
                            valuePropName='checked'
                            {...tailFormItemLayout}
                        >
                            <Checkbox>
                                Ar aktyvuoti vartotoją?
                            </Checkbox>
                        </Form.Item>

                        <Form.Item
                            name='naujas'
                            label='Naujas'
                            rules={[{ required: true, message: 'Įveskite, ar tai naujas!'}]}
                            // style={{ display: 'none' }}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
    
}