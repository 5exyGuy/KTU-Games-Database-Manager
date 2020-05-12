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

		this.devForm = React.createRef();
	}

	onFinish(values) {
		socket.emit(tables.developers, 'update', values, (result) => {
			if (!result) return;
			this.props.back();
		});
	}

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='Kūrėjai'
					subTitle='Žaidimų kūrėjai'
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
					extra={[
						<Button type='primary' onClick={() => this.devForm.current.submit()}>
							Redaguoti kūrėją
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
								ref={this.devForm}
								{...formItemLayout}
								onFinish={this.onFinish.bind(this)}
								scrollToFirstError
								initialValues={{
									id_kurejai: this.props.data.id_kurejai,
									pavadinimas: this.props.data.pavadinimas,
									logotipas: this.props.data.logotipas,
									hipersaitas: this.props.data.hipersaitas
								}}
							>
								<Form.Item
									name='id_kurejai'
									label='ID'
								>
									<Input disabled />
								</Form.Item>
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
							</Form>
						</Card>
					</Col>
				</Row>
            </div>
        );
    }
    
}