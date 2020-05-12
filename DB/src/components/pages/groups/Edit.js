import React, { Component } from 'react';
import { PageHeader, Form, Input, Button, Card, Row, Col, Modal, List, Select } from 'antd';
import socket from '../../../socket';
import { tables } from '../../../tables';
import uniqid from 'uniqid';
import { places } from '../../../enums';

const formItemLayout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
};

export default class EditForm extends Component {

    state = {
		users: [],
        groupUsers: [],
        isModalVisible: false,
        creatingNew: false
    };

    constructor(props) {
        super(props);

        this.groupForm = React.createRef();
        this.groupUserForm = React.createRef();
    }

    componentDidMount() {
		this.selectGroupUsers(this.props.data.id_grupes);
        this.selectUsers();
    }

	onFinish(values) {
		socket.emit(tables.groups, 'update', values, (result) => {
			if (!result) return;
            
            const groupUsers = [...this.state.groupUsers];

            groupUsers.forEach(async (user) => {
                await new Promise((resolve) => {
                    user.fk_grupesid_grupes = values.id_grupes;
                    if (user.naujas) socket.emit(tables.groups, 'insertUser', user, (result) => resolve(result));
                    else socket.emit(tables.groups, 'updateUser', user, (result) => resolve(result));
                });
            });

            this.props.back();
		});
    }

    addNewGroupUser() {
        this.setState({ isModalVisible: true, creatingNew: true }, async () => {
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (this.groupUserForm && this.groupUserForm.current) {
                        this.groupUserForm.current.resetFields();
                        this.groupUserForm.current.setFieldsValue({ 
                            id_vartotoju_grupes: uniqid(),
							pareigos: places[0],
                            fk_vartotojaiid_vartotojai: this.state.users[0].id_vartotojai,
                            naujas: true
                        });
                        clearInterval(interval);
                        resolve();
                    }
                }, 0);
            });
        });
    }

    addGroupUser(values) {
        const groupUsers = [...this.state.groupUsers];

        const index = groupUsers.findIndex((user) => user.id_vartotoju_grupes === values.id_vartotoju_grupes);
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

    editGroupUser(userId) {
        const groupUsers = [...this.state.groupUsers];

        const index = groupUsers.findIndex((user) => user.id_vartotoju_grupes === userId);
        if (index < 0) return;

        const user = groupUsers[index];

        if (user.naujas) {
            return this.setState({ isModalVisible: true, creatingNew: true }, async () => {
                await new Promise((resolve) => {
                    const interval = setInterval(() => {
                        if (this.groupUserForm && this.groupUserForm.current) {
                            this.groupUserForm.current.resetFields();
                            this.groupUserForm.current.setFieldsValue({...user});
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
                    if (this.groupUserForm && this.groupUserForm.current) {
                        this.groupUserForm.current.resetFields();
                        this.groupUserForm.current.setFieldsValue({...user});
                        clearInterval(interval);
                        resolve();
                    }
                }, 0);
            });
        });
    }

    removeGroupUser(userId) {
        const groupUsers = [...this.state.groupUsers];
        const index = groupUsers.findIndex((user) => user.id_vartotoju_grupes === userId);
        if (index < 0) return;

        if (groupUsers[index].naujas) {
            groupUsers.splice(index, 1);
            return this.setState({ groupUsers: [...groupUsers] });
        }

        socket.emit(tables.groups, 'deleteUser', userId, (result) => {
            if (!result) return;
            this.selectGroupUsers(this.props.data.id_grupes);
        });
    }

    selectGroupUsers(groupId) {
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
	
	selectUsers() {
        socket.emit(tables.users, 'selectAll', null, (users) => {
            if (!users) return;
            if (users.length === 0) this.props.back();

			const userList = [...users];
	
			this.setState({ users: [...userList] }, async () => {
                await new Promise((resolve) => {
					const interval = setInterval(() => {
						if (this.groupUserForm && this.groupUserForm.current) {
							this.groupUserForm.current.setFieldsValue({ 
								fk_vartotojaiid_vartotojai: userList[0].id_vartotojai 
							});
							clearInterval(interval);
							resolve();
						}
					}, 0);
				});
            });
		});
    }
	
	selectUser(userId) {
		if (!userId) return;

        const user = this.state.users.find((user) => user.id_vartotojai === userId);
		if (!user) return;

		new Promise((resolve) => {
			const interval = setInterval(() => {
				if (this.groupUserForm && this.groupUserForm.current) {
					this.groupUserForm.current.setFieldsValue({ 
						fk_vartotojaiid_vartotojai: user.id_vartotojai 
					});
					clearInterval(interval);
					resolve();
				}
			}, 0);
		});
    }

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='Grupės'
					subTitle='Internetinės parduotuvės grupės'
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
					extra={[
                        <Button key='editGruop' type='primary' onClick={() => this.groupForm.current.submit()}>
						 	Redaguoti grupę
						</Button>,
                        <Button key='addNewGroupUser' onClick={this.addNewGroupUser.bind(this)}>
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
									pavadinimas: this.props.data.pavadinimas
                                }}
                            >
                                <Form.Item
									name='id_grupes'
									label='ID'
									rules={[{ required: true, message: 'Įveskite grupės ID!' }]}
								>
									<Input type='number' disabled />
								</Form.Item>

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
                            dataSource={this.state.groupUsers}
                            renderItem={user => (
                                <List.Item actions={[
                                    // eslint-disable-next-line
                                    <a key='edit' onClick={this.editGroupUser.bind(this, user.id_vartotoju_grupes)}>redaguoti</a>, 
                                    // eslint-disable-next-line
                                    <a key='remove' onClick={this.removeGroupUser.bind(this, user.id_vartotoju_grupes)}>šalinti</a>
                                ]}>
                                    {user.id_vartotoju_grupes}
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
                {this.state.users.length === 0 ? '' :
                <Modal
                    title='Grupės vartotojas'
                    centered
                    visible={this.state.isModalVisible}
                    onCancel={() => this.setState({ isModalVisible: false })}
                    footer={[
                        <Button key='cancel' onClick={() => this.setState({ isModalVisible: false })}>
                            Grįžti
                        </Button>,
                        <Button key='submit' type='primary' onClick={() => this.groupUserForm.current.submit()}>
                            Patvirtinti
                        </Button>
                    ]}
                >
                    <Form
                        ref={this.groupUserForm}
                        {...formItemLayout}
                        onFinish={this.addGroupUser.bind(this)}
                        scrollToFirstError
                    >
                        <Form.Item
                            name='id_vartotoju_grupes'
                            label='ID'
                            rules={[{ required: true, message: 'Įveskite grupės vartotojo ID!' }]}
                            style={{ display: 'none' }}
                        >
                            <Input disabled />
                        </Form.Item>

						<Form.Item
							key='pareigos'
							name='pareigos'
							label='Pareigos'
							rules={[{ required: true, message: 'Pasirinkite vartotojo pareigą!' }]}
						>
							<Select>
								{places.map((place) => {
									return <Select.Option value={place}>{place}</Select.Option>
								})}
							</Select>
						</Form.Item>

                        <Form.Item
							key='fk_vartotojaiid_vartotojai'
							name='fk_vartotojaiid_vartotojai'
							label='Vartotojas'
							rules={[{ required: true, message: 'Pasirinkite vartotoją!' }]}
						>
							<Select onChange={(user) => this.selectUser(user)}>
								{this.state.users.map((user) => {
									return <Select.Option value={user.id_vartotojai}>{user.slapyvardis}</Select.Option>;
								})}
							</Select>
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
                </Modal>}
            </div>
        );
    }
    
}