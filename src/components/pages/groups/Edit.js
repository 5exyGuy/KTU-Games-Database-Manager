import React, { Component } from 'react';
import { PageHeader, Form, Input, Button, Card, Row, Col, Select, DatePicker, List, Modal, Checkbox } from 'antd';
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

export default class EditForm extends Component {

    state = {
        users: [],
        groupUsers: [],
        isModalVisible: false,
        creatingNew: false
    };

    constructor(props) {
        super(props);

        this.form = React.createRef();
        this.groupUserForm = React.createRef();
    }

    componentDidMount() {
        this.selectUsers();
        this.selectGroupUsers(this.props.data.id_grupes);
    }

	onFinish(values) {
		socket.emit(tables.groups, 'update', values, (result) => {
			if (!result) return;
            
            const newUsers = [...this.state.newUsers];

            newUsers.forEach(async (user) => {
                await new Promise((resolve) => {
                    socket.emit(tables.users, 'update', user, (result) => resolve(result));
                });
            });

            this.props.back();
		});
    }

    addGroupUser(values) {
        const groupUsers = [...this.state.groupUsers];

        const user = groupUsers.find((user) => 
            user.slapyvardis === values.slapyvardis || 
            user.el_pastas === values.el_pastas
        );
        if (user) {
            const index = groupUsers.findIndex((user) => user.id_vartotojai === values.id_vartotojai);
            if (index > -1) {
                values.naujas = false;
                groupUsers[index] = values;
            }

            return this.setState({ 
                groupUsers: [...groupUsers],
                isModalVisible: false,
                creatingNew: false
            });
        }

        values.naujas = true;
        groupUsers.push(values);
        this.setState({ 
            groupUsers: [...groupUsers],
            isModalVisible: false,
            creatingNew: false
        });
    }

    editGroupUser(userId) {
        const groupUsers = [...this.state.groupUsers];

        const index = groupUsers.findIndex((user) => user.id_vartotojai === userId);
        if (index < 0) return;

        const user = groupUsers[index];

        this.setState({ isModalVisible: true }, () => {
            if (this.groupUserForm && this.groupUserForm.current)
                return this.groupUserForm.current.setFieldsValue({...user});

            setTimeout(() => {
                this.groupUserForm.current.setFieldsValue({...user});
            }, 1000);
        });
    }

    removeGroupUser(userId, groupId) {
        const groupUsers = [...this.state.groupUsers];
        const index = groupUsers.findIndex((user) => user.id_vartotojai === userId);
        if (index < 0) return;

        if (groupUsers[index].naujas) {
            groupUsers.splice(index, 1);
            return this.setState({ groupUsers: [...groupUsers] });
        }

        socket.emit(tables.groups, 'deleteUser', { userId: userId, groupId: groupId }, (result) => {
            if (!result) return;
            this.selectGroupUsers();
        });
    }

    selectGroupUsers(groupId) {
        socket.emit(tables.groups, 'selectGroupUsers', groupId, (users) => {
            if (!users) return this.setState({ groupUsers: [] });

            const userList = [...users];

            userList.map((user) => {
                user.naujas = false;
                user.paskutinis_prisijungimas = moment(user.paskutinis_prisijungimas);
                user.registracijos_data = moment(user.registracijos_data);
                return user;
            });

            this.setState({ groupUsers: [...userList] });
        });
    }

    selectUsers() {
        socket.emit(tables.users, 'selectAll', null, (users) => {
			if (!users) return this.setState({ users: [] });
            if (users.length === 0) this.props.back();

            const userList = [...users];
	
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
                        <Button key='edit' type='primary' onClick={() => this.form.current.submit()}>
						 	Redaguoti
						</Button>,
                        <Button key='addNewUser' onClick={() => this.setState({ isModalVisible: true, creatingNew: true })}>
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
                                ref={this.form}
                                {...formItemLayout}
                                onFinish={this.onFinish.bind(this)}
                                scrollToFirstError
                                initialValues={{
                                    id_grupes: this.props.data.id_grupes,
                                    fk_vartotojaiid_vartotojai: this.props.data.fk_vartotojaiid_vartotojai,
                                    pavadinimas: this.props.data.pavadinimas,
                                    ikurimo_data: moment(this.props.data.ikurimo_data)
                                }}
                            >
                                <Form.Item
                                    key='id_grupes'
                                    name='id_grupes'
                                    label='ID'
                                    rules={[{ required: true, message: 'Įveskite grupės ID!' }]}
                                >
                                    <Input disabled />
                                </Form.Item>

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
                                        format='YYYY-MM-DD HH:mm:ss'
                                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                    />
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
                                    <a key='edit' onClick={this.editGroupUser.bind(this, user.id_vartotojai)}>redaguoti</a>, 
                                    // eslint-disable-next-line
                                    <a key='remove' onClick={this.removeGroupUser.bind(this, user.id_vartotojai, this.props.data.id_grupes)}>šalinti</a>
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
                        {this.state.creatingNew ? '' : <Form.Item
                            key='id_vartotojai'
                            name='id_vartotojai'
                            label='ID'
                            rules={[{ required: true, message: 'Įveskite vartotojo ID!' }]}
                        >
                            <Input disabled />
                        </Form.Item>}

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
                            key='registrationDate'
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