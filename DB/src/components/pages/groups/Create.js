import React, { Component } from 'react';
import { PageHeader, Form, Input, Button, Card, Row, Col, Modal, List, Select, notification } from 'antd';
import socket from '../../../socket';
import { tables } from '../../../tables';
import uniqid from 'uniqid';
import { places } from '../../../enums';

const formItemLayout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
};

export default class CreateForm extends Component {
    state = {
		users: [],
        groupUsers: [],
        isModalVisible: false
    };

    constructor(props) {
        super(props);

        this.groupForm = React.createRef();
        this.groupUserForm = React.createRef();
	}
	
	componentDidMount() {
		this.selectUsers();
	}

	onFinish(values) {
		socket.emit(tables.groups, 'insert', values, (group) => {
			console.log(group);
			if (!group) return;

			notification['success']({
				message: 'Grupės',
				description: 'Grupė sėkmingai įkelta į duomenų bazę!',
				placement: 'bottomRight'
			});
            
            const groupUsers = [...this.state.groupUsers];

            groupUsers.forEach(async (user) => {
                const result = await new Promise((resolve) => {
                    user.fk_grupesid_grupes = group.id_grupes;
                    socket.emit(tables.groups, 'insertUser', user, (result) => resolve(result));
				});
				
				if (result)
					notification['success']({
						message: 'Vartotojai',
						description: 'Vartotojas sėkmingai priskirtas grupei!',
						placement: 'bottomRight'
					});
            });

            this.props.back();
		});
    }

    addNewGroupUser() {
		if (this.state.users.length === 0)
			return notification['warning']({
				message: 'Vartotojai',
				description: 'Nėra vartotojų!',
				placement: 'bottomRight'
			});

        this.setState({ isModalVisible: true}, async () => {
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (this.groupUserForm && this.groupUserForm.current) {
                        this.groupUserForm.current.resetFields();
                        this.groupUserForm.current.setFieldsValue({ 
							id_vartotoju_grupes: uniqid(),
							pareigos: places[0],
							fk_vartotojaiid_vartotojai: this.state.users[0].id_vartotojai
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

        const index = groupUsers.findIndex((user) => user.fk_vartotojaiid_vartotojai === values.fk_vartotojaiid_vartotojai);
        if (index > -1) {
            groupUsers[index] = values;

            return this.setState({ 
                groupUsers: [...groupUsers],
                isModalVisible: false
            });
        }

        groupUsers.push(values);
        this.setState({ 
            groupUsers: [...groupUsers],
            isModalVisible: false
        });
    }

    editGroupUser(userId) {
        const groupUsers = [...this.state.groupUsers];

        const index = groupUsers.findIndex((user) => user.id_vartotoju_grupes === userId);
        if (index < 0) return;

        const user = groupUsers[index];

        this.setState({ isModalVisible: true}, async () => {
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
        groupUsers.splice(index, 1);

        this.setState({ groupUsers: [...groupUsers] });
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
                        <Button key='createGroup' type='primary' onClick={() => this.groupForm.current.submit()}>
						 	Sukurti grupę
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
                    </Form>
                </Modal>}
            </div>
        );
    }
    
}