import React from 'react'
import App from '../../common/App.jsx'
import U from '../../common/U.jsx'
import Utils from '../../common/Utils.jsx'
import {Input, message, Modal, Switch} from 'antd';
import '../../assets/css/common/common-edit.less'

const id_div = 'div-dialog-sort-edit';

export default class SortEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sort: this.props.sort,
        };
    }


    submit = () => {
        let {sort = {}} = this.state;
        let {name,} = sort;
        if (U.str.isEmpty(name)) {
            message.warn('请填写名称');
            return;
        }
        App.api('adm/sort/save', {
                sort: JSON.stringify(sort)
            }
        ).then(() => {
            message.success('已保存');
            this.props.loadData();
            this.close();
        });
    };

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {

        let {sort = {}} = this.state;
        let {name, status} = sort;
        return <Modal title={'添加商品类型'}
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      width={'1000px'}
                      okText='确定'
                      onOk={this.submit}
                      onCancel={this.close}>
            <div className="common-edit-page">

                <div className="form">

                    <div className="line">
                        <p className='p required'>名称</p>
                        <Input style={{width: 300}} className="input-wide" placeholder="输入名称"
                               value={name} maxLength={64}
                               onChange={(e) => {
                                   this.setState({
                                       sort: {
                                           ...sort,
                                           name: e.target.value
                                       }
                                   })
                               }}/>
                    </div>

                    <div className="line">
                        <p className='p'>启用</p>
                        <Switch checked={status === 1} onChange={(chk) => {
                            this.setState({
                                sort: {
                                    ...sort,
                                    status: chk ? 1 : 2
                                }
                            })
                        }}/>
                    </div>
                </div>
            </div>
        </Modal>
    }
}
