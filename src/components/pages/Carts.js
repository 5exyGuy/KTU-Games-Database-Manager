import React, { Component } from 'react';
import { Button, PageHeader } from 'antd';

export default class Carts extends Component {

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='Krepšeliai'
					subTitle='Visi krepšeliai'
					extra={[
						<Button type='primary'>Atnaujinti</Button>
					]}
				/>
            </div>
        );
    }
    
}