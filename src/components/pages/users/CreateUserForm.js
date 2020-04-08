import React, { Component } from 'react';
import { PageHeader, Form, Input, Checkbox, Button, DatePicker } from 'antd';
import moment from 'moment';
import socket from '../../../socket';
import { tables } from '../../../tables';

const formItemLayout = {
	labelCol: { span: 4, offset: 6 },
	wrapperCol: { span: 4 }
};

const tailFormItemLayout = {
	wrapperCol: {
		span: 4,
		offset: 10
	}
};

const CustomForm = () => {
	const [form] = Form.useForm();
  
	const onFinish = async (values) => {
		socket.emit(tables.users, 'insert', values, (result) => {
			if (!result) return;
			// TODO
		});
	};
  
	return (
	  	<Form
			{...formItemLayout}
			form={form}
			onFinish={onFinish}
			scrollToFirstError
			style={{ marginTop: '10vh' }}
			initialValues={{
				registracijos_data: moment(),
				paskutinis_prisijungimas: moment()
			}}
	  	>
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
				name='registracijos_data'
				label='Registracijos data'
			>
				<DatePicker showTime format='YYYY-MM-DD HH:MM:SS' disabled />
			</Form.Item>

			<Form.Item
				name='paskutinis_prisijungimas'
				label='Paskutinis prisijungimas'
			>
				<DatePicker showTime format='YYYY-MM-DD HH:MM:SS' disabled />
			</Form.Item>

			<Form.Item
				name='balansas'
				label='Balansas'
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
			<Form.Item {...tailFormItemLayout}>
				<Button type='primary' htmlType='submit'>
					Sukurti
				</Button>
			</Form.Item>
	  </Form>
	);
};

export default class CreateUserForm extends Component {

	onFinish(values) {
		socket.emit(tables.users, 'insert', values, (result) => {
			if (!result) return;
			// TODO
			this.props.back();
		});
	}

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='Varotojai'
					subTitle='Užregistruoti internetinės parduotuvės vartotojai'
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
				/>
                <Form
					{...formItemLayout}
					onFinish={this.onFinish.bind(this)}
					scrollToFirstError
					style={{ marginTop: '10vh' }}
					initialValues={{
						registracijos_data: moment(),
						paskutinis_prisijungimas: moment()
					}}
				>
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
						name='registracijos_data'
						label='Registracijos data'
					>
						<DatePicker showTime format='YYYY-MM-DD HH:MM:SS' disabled />
					</Form.Item>

					<Form.Item
						name='paskutinis_prisijungimas'
						label='Paskutinis prisijungimas'
					>
						<DatePicker showTime format='YYYY-MM-DD HH:MM:SS' disabled />
					</Form.Item>

					<Form.Item
						name='balansas'
						label='Balansas'
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
					<Form.Item {...tailFormItemLayout}>
						<Button type='primary' htmlType='submit'>
							Sukurti
						</Button>
					</Form.Item>
				</Form>
            </div>
        );
    }
    
}