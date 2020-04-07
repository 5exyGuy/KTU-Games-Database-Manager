import React, { Component } from 'react';
import { PageHeader } from 'antd';

export default class EditUserForm extends Component {

	render() {
        return (
            <div>
				<PageHeader
					ghost={false}
					title='Varotojai'
					subTitle='Užregistruoti internetinės parduotuvės vartotojai'
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.10)' }}
				/>

            </div>
        );
    }
    
}