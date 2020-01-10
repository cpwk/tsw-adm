import React from 'react'
import App from '../../common/App.jsx'
import U from '../../common/U.jsx'
import Utils from '../../common/Utils.jsx'
import {Button, Card, Dropdown, Icon, Menu, message, Modal, Table, Row, Col, Input} from 'antd';
import BreadcrumbCustom from '../common/BreadcrumbCustom'
import CTYPE from '../../common/CTYPE'
import '../../assets/css/common/common-list.less'
import SortUtils from "./SortUtils";

const InputSearch = Input.Search;

export default class Sort extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            q: '',
            key: 'name',
            list: [],
            loading: false
        };
    }

    componentDidMount() {
        this.loadData();
    }

    getQuery = () => {
        let {search, q, key} = this.state;
        let query = {};
        if (search === true) {
            if (U.str.isNotEmpty(q)) {
                if (key === 'name') {
                    query = {name: q};
                }
            }
        }
        return query;
    };

    loadData = () => {
        this.setState({loading: true});
        Utils.nProgress.start();
        App.api('adm/sort/sorts', {sortQo: JSON.stringify({...this.getQuery()})}).then((sort) => {
                Utils.nProgress.done();
                console.log(sort);
                this.setState({
                    list: sort, loading: false
                });
            }
        );
    };

    remove = (id, index) => {
        let _this = this;
        Modal.confirm({
            title: `确认删除操作?`,
            onOk() {
                App.api('adm/sort/remove', {id}).then(() => {
                    message.success('删除成功');
                    let list = _this.state.list;
                    _this.setState({
                        list: U.array.remove(list, index)
                    })
                })
            },
            onCancel() {
            },
        });
    };

    edit = (sort) => {
        SortUtils.edit(sort, this.loadData);
    };

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            this.setState({selectedRowKeys})
        },
    };

    putSome = () => {
        let {selectedRowKeys} = this.state;

        App.api(`adm/sort/putsome`, {ids: JSON.stringify(selectedRowKeys)}).then((v) => {
            if (v == null) {
                message.success("批量启用成功！");
                this.loadData();
            }
        });
    };

    outSome = () => {
        let {selectedRowKeys} = this.state;
        App.api(`adm/sort/outsome`, {ids: JSON.stringify(selectedRowKeys)}).then((v) => {
            if (v == null) {
                message.success("批量停用成功！");
                this.loadData();
            }
        });
    };

    removesome = () => {
        let {selectedRowKeys} = this.state;
        selectedRowKeys.map((id) => {
            App.api(`adm/sort/remove`, {id})
        });
        message.success("批量删除成功！");
        this.loadData();
    };

    render() {

        let {list = [], loading, q} = this.state;

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.info_sort.txt}/>

            <Card bordered={false}>

                <Row>
                    <Col span={12}>

                        <Button type="primary" icon="file-add" onClick={() => {
                            this.edit({id: 0})
                        }}>添加商品类型</Button>

                        <Button type="primary" icon="edit" onClick={() => {
                            this.putSome();
                        }}>批量启用</Button>

                        <Button type="primary" icon="edit" onClick={() => {
                            this.outSome();
                        }}>批量停用</Button>

                        <Button type="primary" icon="delete" onClick={() => {
                            this.removesome();
                        }}>批量删除</Button>

                    </Col>

                    <Col span={12} style={{textAlign: 'right'}}>

                        <InputSearch
                            placeholder="输入商品类型名称查询"
                            style={{width: 200}}
                            value={q}
                            onChange={(e) => {
                                this.setState({q: e.target.value});
                            }}
                            onSearch={(v) => {
                                this.setState({
                                    q: v, search: true
                                }, () => {
                                    this.loadData()
                                });
                            }}/>
                        &nbsp;
                        &nbsp;
                        &nbsp;
                    </Col>

                </Row>

                <Table

                    rowSelection={this.rowSelection}

                    columns={[

                        {
                            title: '序号',
                            dataIndex: 'priority',
                            className: 'txt-center',
                            width: '100px',
                            render: (col, row, i) => {
                                return <span>{(i + 1)}</span>
                            }
                        },
                        {
                            title: '商品类型ID',
                            dataIndex: 'id',
                            className: 'txt-center',
                            width: '100px'
                        },
                        {
                            title: '商品类型名称',
                            dataIndex: 'name',
                            className: 'txt-center',
                            width: '100px'
                        }, {

                            title: '状态',
                            dataIndex: 'status',
                            className: 'txt-center',
                            width: '100px',
                            render: (obj, c) => {
                                return <div className="state">
                                    {c.status === 1 ? <span className="important">启用</span> :
                                        <span className="disabled">停用</span>}
                                </div>
                            }
                        },

                        {
                            title: '操作',
                            dataIndex: 'opt',
                            className: 'txt-center',
                            width: '100px',
                            render: (obj, sort, index) => {

                                return <Dropdown overlay={<Menu>
                                    <Menu.Item key="1">
                                        <a onClick={() => this.edit(sort)}>编辑</a>
                                    </Menu.Item>
                                    <Menu.Divider/>
                                    <Menu.Item key="2">
                                        <a onClick={() => this.remove(sort.id, index)}>删除</a>
                                    </Menu.Item>
                                </Menu>} trigger={['click']}>
                                    <a className="ant-dropdown-link">操作 <Icon type="down"/>
                                    </a>
                                </Dropdown>
                            }
                        }]} rowKey={(record) => record.id} dataSource={list} loading={loading} pagination={false}/>
            </Card>

        </div>
    }
}