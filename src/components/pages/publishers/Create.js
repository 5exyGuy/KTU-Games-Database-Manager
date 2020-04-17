import React, { Component } from 'react';
import { PageHeader, Form, Input, Button, Card, Row, Col } from 'antd';
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

export default class CreateForm extends Component {

	onFinish(values) {
		socket.emit(tables.publishers, 'insert', values, (result) => {
			if (!result) return;
			this.props.back();
		});
	}

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='Leidėjai'
					subTitle='Žaidimų leidėjai'
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
					extra={[
						<Button onClick={() => this.props.back()}>
						 	Grįžti
						</Button>
					]}
				/>
				<Row gutter={24} style={{ padding: '10px', marginLeft: '0px', marginRight: '0px' }}>
					<Col span={12}>
						<Card style={{ backgroundColor: 'rgb(225, 225, 225)' }}>
							<Form
								{...formItemLayout}
								onFinish={this.onFinish.bind(this)}
								scrollToFirstError
							>
								<Form.Item
									name='pavadinimas'
									label='Pavadinimas'
									rules={[{ required: true, message: 'Įveskite pavadinimą!' }]}
								>
									<Input />
								</Form.Item>
								<Form.Item
									name='logotipas'
									label='Logotipas'
									rules={[{ required: true, message: 'Įveskite logotipo nuotraukos nuorodą!' }]}
								>
									<Input />
								</Form.Item>
								<Form.Item
									name='hipersaitas'
									label='Hipersaitas'
									rules={[{ required: true, message: 'Įveskite hipersaitą!' }]}
								>
									<Input />
								</Form.Item>
								<Form.Item {...tailFormItemLayout}>
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