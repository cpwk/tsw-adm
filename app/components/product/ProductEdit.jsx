import React from 'react'
import App from '../../common/App.jsx'
import U from '../../common/U.jsx'
import Utils from '../../common/Utils.jsx'
import {Button, Input, InputNumber, message, Modal, Select, Switch, Form} from 'antd';
import {CTYPE, OSSWrap} from "../../common";
import '../../assets/css/common/common-edit.less'

const id_div = 'div-dialog-product-edit';
const FormItem = Form.Item;
const Option = Select.Option;

export default class ProductEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            product: this.props.product,
            uploading: false,
            sort: [],
            checkedKeys: []
        };
    }

    componentDidMount() {
        App.api('adm/sort/sorts', {sortQo: JSON.stringify({})}).then((sort) => {
            this.setState({sort});
        })
    }

    handleNewImage = e => {

        let {uploading, product = {}} = this.state;

        let img = e.target.files[0];

        if (!img || img.type.indexOf('image') < 0) {
            message.error('文件类型不正确,请选择图片类型');
            this.setState({
                uploading: false
            });
            return;
        }

        if (uploading) {
            message.loading('上传中');
            return;
        }

        this.setState({uploading: true});

        OSSWrap.upload(img).then((result) => {
            this.setState({
                product: {
                    ...product,
                    img: result.url
                }, uploading: false
            });
        }).catch((err) => {
            message.error(err);
        });

    };

    submit = () => {

        let {product = {}} = this.state;
        let {sortId, name, price, url, status, priority, img} = product;

        if (!sortId) {
            message.warn('请填写类型');
            return;
        }
        if (U.str.isEmpty(name)) {
            message.warn('请填写名称');
            return;
        }
        if (U.str.isEmpty(img)) {
            message.warn('请上传图片');
            return;
        }
        if (U.str.isEmpty(status)) {
            product.status = 1;
        }

        App.api('adm/product/save', {
                product: JSON.stringify(product)
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

        let {product = {}, sort = [],} = this.state;
        let {name, price, url, status, priority, type = 1, img, sortId} = product;

        let isPC = type === 1;

        let style = isPC ? {width: '480px', height: '182px'} : {width: '187px', height: '237px'};

        return <Modal title={'编辑商品'}
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
                                       product: {
                                           ...product,
                                           name: e.target.value
                                       }
                                   })
                               }}/>
                    </div>

                    <div className="line">
                        <p className='p required'>价格</p>
                        <Input style={{width: 300}} className="input-wide" placeholder="输入价格"
                               value={price} maxLength={64}
                               onChange={(e) => {
                                   this.setState({
                                       product: {
                                           ...product,
                                           price: e.target.value
                                       }
                                   })
                               }}/>
                    </div>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label="类型">
                        <Select
                            style={{width: '500px'}}
                            value={sortId}
                            onChange={(sortId) => {
                                this.setState({
                                    product: {
                                        ...product,
                                        sortId
                                    }
                                })
                            }}>
                            {sort.map((g, i) => {
                                return (<Option key={i} value={g.id}>{g.name}</Option>);
                            })}
                        </Select>
                    </FormItem>

                    <div className="line">
                        <p className='p'>URL</p>
                        <Input className="input-wide" value={url} maxLength={512}
                               onChange={(e) => {
                                   this.setState({
                                       product: {
                                           ...product,
                                           url: e.target.value
                                       }
                                   })
                               }}/>
                    </div>

                    <div className="line">
                        <p className='p'>权重</p>
                        <InputNumber
                            value={priority} max={99}
                            onChange={(v) => {
                                this.setState({
                                    product: {
                                        ...product,
                                        priority: v
                                    }
                                })
                            }}/>
                    </div>

                    <div className="line">
                        <p className='p required'>图片</p>
                        <div>
                            <div className='upload-img-preview' style={style}>
                                {img && <img src={img} style={style}/>}
                            </div>
                            <div className='upload-img-tip'>
                                <Button type="primary" icon="file-jpg">
                                    <input className="file" type='file' onChange={this.handleNewImage}/>
                                    选择图片</Button>
                                <br/>
                                建议上传图片尺寸<span>{isPC ? '1920*730' : '750*950'}</span>，.jpg、.png格式，文件小于1M
                            </div>
                        </div>
                    </div>

                    <div className="line">
                        <p className='p'>上架</p>
                        <Switch checked={status === 1} onChange={(chk) => {
                            this.setState({
                                product: {
                                    ...product,
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