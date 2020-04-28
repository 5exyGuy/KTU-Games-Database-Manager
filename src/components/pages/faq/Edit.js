import React, { Component } from 'react';
import { PageHeader, Form, Input, Button, Card, Row, Col } from 'antd';
import socket from '../../../socket';
import { tables } from '../../../tables';

const formItemLayout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
};

export default class EditForm extends Component {

	constructor(props) {
		super(props);

		this.faqForm = React.createRef();
	}

	onFinish(values) {
		socket.emit(tables.faq, 'update', values, (result) => {
			if (!result) return;
			this.props.back();
		});
	}

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='DUK'
					subTitle='Dažniausiai užduodami klausimai'
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
					extra={[
						<Button type='primary' onClick={() => this.faqForm.current.submit()}>
						 	Redauoti klausimą
						</Button>,
						<Button onClick={() => this.props.back()}>
						 	Grįžti
						</Button>
					]}
				/>
				<Row justify='center' style={{ padding: '10px', marginLeft: '0px', marginRight: '0px' }}>
                    <Col span={12}>
						<Card style={{ backgroundColor: 'rgb(225, 225, 225)' }}>
							<Form
								ref={this.faqForm}
								{...formItemLayout}
								onFinish={this.onFinish.bind(this)}
								scrollToFirstError
								initialValues={{
									id_duk: this.props.data.id_duk,
									klausimas: this.props.data.klausimas,
									atsakymas: this.props.data.atsakymas
								}}
							>
								<Form.Item
									name='id_duk'
									label='ID'
								>
									<Input disabled />
								</Form.Item>
								<Form.Item
									name='klausimas'
									label='Klausimas'
									rules={[{ required: true, message: 'Įveskite slapyvardį!' }]}
								>
									<Input />
								</Form.Item>
								<Form.Item
									name='atsakymas'
									label='Atsakymas'
									rules={[{ required: true, message: 'Įveskite slapyvardį!' }]}
								>
									<Input />
								</Form.Item>
							</Form>
						</Card>
					</Col>
				</Row>
            </div>
        );
    }
    
}