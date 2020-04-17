import React, { Component } from 'react';
import { PageHeader, Form, Input, Checkbox, Button, DatePicker, Card, Row, Col } from 'antd';
import moment from 'moment';
import socket from '../../../socket';
import { tables } from '../../../tables';

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

	onFinish(values) {
		socket.emit(tables.users, 'update', values, (result) => {
			if (!result) return;
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
								{...formItemLayout}
								onFinish={this.onFinish.bind(this)}
								scrollToFirstError
								initialValues={{
									id_vartotojai: this.props.data.id_vartotojai,
									slapyvardis: this.props.data.slapyvardis,
									el_pastas: this.props.data.el_pastas,
									registracijos_data: moment(this.props.data.registracijos_data),
									paskutinis_prisijungimas: moment(this.props.data.paskutinis_prisijungimas),
									balansas: this.props.data.balansas,
									aktyvuotas: this.props.data.aktyvuotas,
								}}
							>
								<Form.Item
									name='id_vartotojai'
									label='ID'
								>
									<Input disabled />
								</Form.Item>
								<Form.Item
									name='slapyvardis'
									label='Slapyvardis'
									rules={[{ required: true, message: 'Įveskite slapyvardį!', whitespace: false, min: 5, max: 255 }]}
								>
									<Input id='slapyvardis' />
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
									<Input id='el_pastas' />
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
									<Input.Password id='slaptazodis' />
								</Form.Item>

								<Form.Item
									name='registracijos_data'
									label='Registracijos data'
								>
									<DatePicker id='registracijos_data' showTime format='YYYY-MM-DD HH:MM:SS' />
								</Form.Item>

								<Form.Item
									name='paskutinis_prisijungimas'
									label='Paskutinis prisijungimas'
								>
									<DatePicker id='paskutinis_prisijungimas' showTime format='YYYY-MM-DD HH:MM:SS' />
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
									<Input type='number' id='balansas' />
								</Form.Item>
					
								<Form.Item
									name='aktyvuotas'
									valuePropName='checked'
									{...tailFormItemLayout}
								>
									<Checkbox id='aktyvuotas'>
										Ar aktyvuoti vartotoją?
									</Checkbox>
								</Form.Item>
								<Form.Item {...tailFormItemLayout}>
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