import React, { Component } from 'react';
import { Button, PageHeader } from 'antd';

export default class Payments extends Component {

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='Mokėjimai'
					subTitle='Aktyvūs mokėjimai, laukiantys pervedimo'
					extra={[
						<Button type='primary'>Atnaujinti</Button>
					]}
				/>
            </div>
        );
    }
    
}