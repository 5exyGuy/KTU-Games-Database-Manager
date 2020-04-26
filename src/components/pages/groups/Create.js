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
        newUsers: [],
        isModalVisible: false
    };

    constructor(props) {
        super(props);

        this.form = React.createRef();
        this.newUserForm = React.createRef();
    }

    componentDidMount() {
        this.selectUsers();
    }

	onFinish(values) {
		socket.emit(tables.groups, 'insert', values, (result) => {
			if (!result) return;
            
            const newUsers = [...this.state.newUsers];

            newUsers.forEach(async (user) => {
                await new Promise((resolve) => {
                    socket.emit(tables.users, 'insert', user, (result) => resolve(result));
                });
            });

            this.props.back();
		});
    }

    addNewUser(values) {
        const newUsers = [...this.state.newUsers];

        const user = newUsers.find((user) => 
            user.slapyvardis === values.slapyvardis || 
            user.el_pastas === values.el_pastas
        );
        if (user) {
            this.setState({ isModalVisible: false });
            return;
        }

        newUsers.push(values);
        this.setState({ 
            newUsers: [...newUsers],
            isModalVisible: false
        });
    }

    editNewUser(username) {
        const newUsers = [...this.state.newUsers];

        const index = newUsers.findIndex((user) => user.slapyvardis === username);
        if (index < 0) return;

        const user = newUsers[index];

        this.newUserForm.current.setFieldsValue({...user});
        this.setState({ isModalVisible: true });
    }

    removeNewUser(username) {
        const newUsers = [...this.state.newUsers];

        const index = newUsers.findIndex((user) => user.slapyvardis === username);
        if (index < 0) return;
        newUsers.splice(index, 1);

        this.setState({ newUsers: [...newUsers] });
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
                        <Button key='create' type='primary' onClick={() => this.form.current.submit()}>
						 	Sukurti grupę
						</Button>,
                        <Button key='addNewUser' onClick={() => { 
                            if (this.newUserForm && this.newUserForm.current) this.newUserForm.current.resetFields(); 
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
                            dataSource={this.state.newUsers}
                            renderItem={user => (
                                <List.Item actions={[
                                    // eslint-disable-next-line
                                    <a key='edit' onClick={this.editNewUser.bind(this, user.slapyvardis)}>redaguoti</a>, 
                                    // eslint-disable-next-line
                                    <a key='remove' onClick={this.removeNewUser.bind(this, user.slapyvardis)}>šalinti</a>
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
                        <Button key='submit' type='primary' onClick={() => this.newUserForm.current.submit()}>
                            Patvirtinti
                        </Button>
                    ]}
                >
                    <Form
                        ref={this.newUserForm}
                        {...formItemLayout}
                        onFinish={this.addNewUser.bind(this)}
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